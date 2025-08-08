# app/routers/bucket.py
from fastapi import APIRouter, HTTPException, Query
from app.services.minio_client import client
router = APIRouter()

@router.get("/buckets")
def list_buckets():
    return {"buckets": [b.name for b in client.list_buckets()]}

@router.post("/buckets")
def create_bucket(name: str = Query(..., min_length=1)):
    if client.bucket_exists(name):
        raise HTTPException(status_code=400, detail="이미 존재하는 버킷입니다.")
    client.make_bucket(name)
    return {"ok": True, "name": name}

@router.delete("/buckets/{bucket}")
def delete_bucket(bucket: str):
    # 비어있지 않으면 실패(강제 삭제는 별도 로직 필요)
    objs = list(client.list_objects(bucket, recursive=True))
    if objs:
        raise HTTPException(400, "버킷이 비어있지 않습니다.")
    client.remove_bucket(bucket)
    return {"ok": True}
