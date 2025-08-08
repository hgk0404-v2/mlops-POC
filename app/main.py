from fastapi import FastAPI
from app.routers import api_router
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI(
    title="YOLOv8 MinIO API",
    summary="minio 관련된 기능만 추가하는 것이 1차 목표",
)
app.include_router(api_router)
app.mount("/uploader", StaticFiles(directory="static/uploader", html=True), name="uploader")
app.mount("/viewer", StaticFiles(directory="static/viewer", html=True), name="viewer")
app.mount("/dashboard", StaticFiles(directory="static/dashboard", html=True), name="dashboard")

# @app.on_event("startup")
# async def startup_event():
#     ensure_bucket()

# if __name__ == "__main__":
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)