from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
from app.services.minio_client import get_object  # presigned URL 대신 내부 API
from app.services.preview_renderer import draw_yolo_bboxes

router = APIRouter()

@router.get("/preview")
def preview_image_with_boxes(image_name: str = Query(...)):
    if not image_name.endswith(".jpg"):
        raise HTTPException(400, "Only .jpg allowed")

    txt_name = image_name.replace(".jpg", ".txt")

    try:
        image_bytes = get_object(image_name).read()
        annotation_text = get_object(txt_name).read().decode("utf-8")
        preview = draw_yolo_bboxes(image_bytes, annotation_text)
        return Response(content=preview, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(500, str(e))
