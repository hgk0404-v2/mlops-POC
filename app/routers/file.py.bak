from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import StreamingResponse
from app.services.minio_client import (
    upload_file,
    download_file,
    delete_file,
    list_files,
)
from io import BytesIO

# """
#     파일 업로드/다운로드 API
# """

router = APIRouter()

@router.post("/upload/")
async def upload_image(
    image: UploadFile = File(...), 
    annotation: UploadFile = File(...),
    bucket_name: str = Query(..., description="MinIO 버킷 이름")
):
    if not image.filename.endswith(('.jpg', '.png', '.svg')):
        raise HTTPException(status_code=400, detail="Image file must be jpg/png/svg")
    if not annotation.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Annotation file must be .txt")

    upload_file(image.file, image.filename, bucket_name)
    upload_file(annotation.file, annotation.filename, bucket_name)
    return {"msg": f"{image.filename} and {annotation.filename} uploaded to {bucket_name}"}

@router.get("/files/")
def get_files():
    return {"files": list_files()}

@router.delete("/delete/")
def delete(image_name: str):
    delete_file(image_name)
    txt_name = image_name.rsplit('.', 1)[0] + '.txt'
    delete_file(txt_name)
    return {"msg": f"{image_name} and {txt_name} deleted"}

@router.get("/download/")
def download(file_name: str = Query(...), bucket_name: str = Query(...)):
    try:
        file_data = download_file(file_name, bucket_name)
        return StreamingResponse(
            BytesIO(file_data.read()),
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={file_name}"}
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"File not found: {file_name}")
