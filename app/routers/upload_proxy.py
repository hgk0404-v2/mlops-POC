# app/routers/upload_proxy.py
from fastapi import APIRouter, UploadFile, File, Query, Form
from app.services.minio_client import upload_file

router = APIRouter()

@router.post(
    "/upload/direct/",
    summary="🚨 파일 UPLOAD(API 사용 ❌)",
    description="이 API는 Dropzone 업로더를 통해 자동 호출됩니다.\n직접 사용하지 마시고 [http://localhost:8000/uploader](http://localhost:8000/uploader)에서 업로드하세요."
)
async def upload_direct(
    file: UploadFile = File(...),
    bucket_name: str = Form(..., description="🪣 업로드할 MinIO 버킷 이름")
):
    upload_file(file.file, file.filename, bucket_name)
    return {"filename": file.filename, "bucket": bucket_name}
