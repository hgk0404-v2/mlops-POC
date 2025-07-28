from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import StreamingResponse
from app.services.minio_client import (
    upload_file,
    download_file,
    delete_file,
    list_files,
)
from io import BytesIO
from zipfile import ZipFile
from typing import List
# """
#     파일 업로드, 다운로드, 삭제, 확인 API
# """

router = APIRouter()

@router.post(
        "/upload/",
        summary="🚨 단일 파일 업로드(API 사용 ✅)",
        description="하나의 파일 하나의 .txt만 업로드 가능"
)
async def upload_files(
    files: List[UploadFile] = File(..., description="업로드할 파일들 (jpg/png/svg 이미지와 txt 어노테이션)"),
    bucket_name: str = Query("yolo-train", description="MinIO 버킷 이름")
    # bucket_name: str = Query(..., description="MinIO 버킷 이름")
):
    image_files = []
    annotation_files = []
    
    # 업로드된 파일들을 분류
    for file in files:
        if file.filename.endswith(('.jpg', '.jpeg', '.png', '.svg')):
            image_files.append(file)
        elif file.filename.endswith('.txt'):
            annotation_files.append(file)
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"지원하지 않는 파일 형식입니다: {file.filename}. jpg/png/svg/txt 파일만 업로드 가능합니다"
            )
    
    # 파일 존재 확인
    if not image_files:
        raise HTTPException(status_code=400, detail="최소 하나의 이미지 파일(jpg/png/svg)이 필요합니다")
    
    uploaded_files = {"images": [], "annotations": []}
    failed_files = []
    
    try:
        # 이미지 파일 업로드
        for image_file in image_files:
            try:
                upload_file(image_file.file, image_file.filename, bucket_name)
                uploaded_files["images"].append(image_file.filename)
            except Exception as e:
                failed_files.append({"filename": image_file.filename, "error": str(e)})
        
        # 어노테이션 파일 업로드
        for annotation_file in annotation_files:
            try:
                upload_file(annotation_file.file, annotation_file.filename, bucket_name)
                uploaded_files["annotations"].append(annotation_file.filename)
            except Exception as e:
                failed_files.append({"filename": annotation_file.filename, "error": str(e)})
        
        response_msg = f"{len(uploaded_files['images'])}개의 이미지와 {len(uploaded_files['annotations'])}개의 어노테이션 파일이 {bucket_name}에 업로드되었습니다"
        
        result = {
            "msg": response_msg,
            "uploaded_files": uploaded_files,
            "total_uploaded": len(uploaded_files["images"]) + len(uploaded_files["annotations"])
        }
        
        if failed_files:
            result["failed_files"] = failed_files
            result["msg"] += f" ({len(failed_files)}개 파일 실패)"
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 업로드 중 오류가 발생했습니다: {str(e)}")

@router.get("/files/")
def get_files():
    return {"files": list_files()}

@router.delete("/delete/")
def delete(
    image_name: str = Query(..., description="삭제할 이미지 이름"),
    bucket_name: str = Query(..., description="MinIO 버킷 이름")
):
    try:
        delete_file(image_name, bucket_name)

        # 대응하는 .txt 파일도 같이 삭제
        txt_name = image_name.rsplit(".", 1)[0] + ".txt"
        delete_file(txt_name, bucket_name)

        return {"msg": f"{image_name} and {txt_name} deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"삭제 실패: {str(e)}")

@router.get("/download/")
def download_zip(
    file_name: str = Query(..., description="기준 파일명 (.jpg 등)"),
    bucket_name: str = Query(..., description="MinIO 버킷 이름")
):
    try:
        base_name = file_name.rsplit('.', 1)[0]
        txt_name = f"{base_name}.txt"

        files = []

        # 메인 파일 (필수)
        img_data = download_file(file_name, bucket_name)
        files.append((file_name, img_data.read()))

        # txt 파일 (선택)
        try:
            txt_data = download_file(txt_name, bucket_name)
            files.append((txt_name, txt_data.read()))
        except Exception:
            pass  # .txt 없어도 무시

        # ZIP으로 묶기
        zip_stream = BytesIO()
        with ZipFile(zip_stream, mode="w") as zf:
            for fname, fbytes in files:
                zf.writestr(fname, fbytes)
        zip_stream.seek(0)

        return StreamingResponse(
            zip_stream,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={base_name}.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download error: {str(e)}")
