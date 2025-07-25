from fastapi import FastAPI
from app.routers import api_router
from fastapi.staticfiles import StaticFiles
from app.services.minio_client import ensure_bucket
import uvicorn

app = FastAPI(title="YOLOv8 MinIO API")
app.include_router(api_router)
app.mount("/uploader", StaticFiles(directory="static/uploader", html=True), name="uploader")

@app.on_event("startup")
def init():
    ensure_bucket("yolo-train") # 지금은 버킷이름을 이렇게 지정해 주어야 함.

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)