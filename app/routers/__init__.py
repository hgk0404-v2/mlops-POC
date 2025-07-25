from fastapi import APIRouter
from .file import router as file_router
from .presign import router as presign_router

api_router = APIRouter()
api_router.include_router(file_router)              # /upload/, /files/ ...
api_router.include_router(presign_router, prefix="/upload")  # /upload/presign/