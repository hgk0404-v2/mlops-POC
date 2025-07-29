# app/routers/upload_proxy.py
from fastapi import APIRouter, UploadFile, File, Query
from app.services.minio_client import upload_file, ensure_bucket

router = APIRouter()

@router.post(
    "/upload/direct/",
    summary="🚨 파일 UPLOAD(API 사용 ❌)",
    description="이 API는 Dropzone 업로더를 통해 자동 호출됩니다.\n직접 사용하지 마시고 [http://localhost:8000/uploader](http://localhost:8000/uploader)에서 업로드하세요."
)
async def upload_direct(
    file: UploadFile = File(...)
):
    upload_file(file.file, file.filename)
    return {"filename": file.filename}
