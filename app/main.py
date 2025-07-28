from fastapi import FastAPI
from app.routers import api_router
from fastapi.staticfiles import StaticFiles
from app.services.minio_client import ensure_bucket
import uvicorn

app = FastAPI(
    title="YOLOv8 MinIO API",
    summary="preview 넣었는데 왜 안뜨는데~~~",
)
app.include_router(api_router)
app.mount("/uploader", StaticFiles(directory="static/uploader", html=True), name="uploader")

@app.on_event("startup")
async def startup_event():
    ensure_bucket()

# if __name__ == "__main__":
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)