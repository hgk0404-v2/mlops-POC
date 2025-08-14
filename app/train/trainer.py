import os
from ultralytics import YOLO
from dotenv import load_dotenv
from app.services.minio_client import download_file, list_files
from pathlib import Path

# 환경변수 로드
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)

YOLO_MODEL = os.getenv("YOLO_MODEL")
YOLO_DATA = os.getenv("YOLO_DATA")
YOLO_EPOCHS = int(os.getenv("YOLO_EPOCHS", 50))
YOLO_IMG_SIZE = int(os.getenv("YOLO_IMG_SIZE", 640))
MINIO_BUCKET = os.getenv("MINIO_BUCKET")

def train_model():
    # MinIO에서 데이터 다운로드
    os.makedirs("datasets", exist_ok=True)
    files = list_files(MINIO_BUCKET)
    for f in files:
        if f.endswith((".jpg", ".png", ".txt")):
            obj = download_file(f, MINIO_BUCKET)
            local_path = Path("datasets") / f
            local_path.parent.mkdir(parents=True, exist_ok=True)
            with open(local_path, "wb") as out:
                out.write(obj.read())
    
    # 모델 학습
    model = YOLO(YOLO_MODEL)
    model.train(
        data=YOLO_DATA,
        epochs=YOLO_EPOCHS,
        imgsz=YOLO_IMG_SIZE
    )
    print("✅ 학습 완료")
