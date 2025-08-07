# app/routers/bucket.py
from fastapi import APIRouter, HTTPException, Query
from app.services.minio_client import create_bucket, list_buckets

router = APIRouter()

@router.post("/buckets")
def make_bucket(bucket_name: str = Query(...)):
    try:
        create_bucket(bucket_name)
        return {"msg": f"{bucket_name} created"}
    except Exception as e:
        raise HTTPException(500, str(e))

@router.get("/buckets")
def get_buckets():
    return {"buckets": list_buckets()}
