# app/routes/presign.py
from datetime import timedelta
from fastapi import APIRouter, Query
from typing import List
from app.services.minio_client import client, ensure_bucket

router = APIRouter()

@router.post("/presign/")
def get_presigned_urls(
    filenames: List[str],
    bucket_name: str = Query("yolo-train", description="MinIO 버킷 이름"),
    expires_hours: int = 1
):
    ensure_bucket(bucket_name)
    urls = []
    for name in filenames:
        url = client.presigned_put_object(
            bucket_name=bucket_name,
            object_name=name,
            expires=timedelta(hours=expires_hours)
        )
        urls.append({"file": name, "url": url})
    return {"presigned": urls, "expires_in_hours": expires_hours}
