from fastapi import APIRouter
from app.train.trainer import train_model

router = APIRouter()

@router.post("/train")
async def run_training():
    train_model()
    return {"status": "success", "message": "Model training started"}
