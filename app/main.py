from fastapi import FastAPI
from app.routers import file
from app.services.minio_client import ensure_bucket
import uvicorn

app = FastAPI()
app.include_router(file.router)

@app.on_event("startup")
def init():
    ensure_bucket("yolo-train") # 지금은 버킷이름을 이렇게 지정해 주어야 함.

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)