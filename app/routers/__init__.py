# /app/routers/__init__.py
from fastapi import APIRouter
from .file import router as file_router
from .upload_proxy import router as upload_proxy_router
from .preview import router as preview_router
from .bucket import router as bucket_router
from .dashboard import router as dashboard_router

api_router = APIRouter()
api_router.include_router(file_router, tags=["📁 파일 관리"])     # /upload/, /files/ ...
api_router.include_router(upload_proxy_router, tags=["📤 업로드"])
api_router.include_router(preview_router, tags=["🖼️ 미리보기"])
api_router.include_router(bucket_router, tags=["🪣 Bucket 관리"])
api_router.include_router(dashboard_router, tags=["📺 Dashboard 관리"])