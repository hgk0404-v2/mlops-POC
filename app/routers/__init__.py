from fastapi import APIRouter
from .file import router as file_router
from .upload_proxy import router as upload_proxy_router

api_router = APIRouter()
api_router.include_router(file_router)              # /upload/, /files/ ...
api_router.include_router(upload_proxy_router)