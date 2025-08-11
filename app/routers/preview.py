from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
from app.services.minio_client import get_object  # presigned URL 대신 내부 API
from app.services.preview_renderer import draw_yolo_bboxes

router = APIRouter()

@router.get(
        "/preview",
        summary="🚨 파일 Preview(API 사용 ❌)",
        description="이 API는 Dropzone 업로더를 통해 자동 호출됩니다.\n직접 사용하지 마시고 [http://localhost:8000/viewer/](http://localhost:8000/viewer/)에서 업로드하세요."
)
def preview_image_with_boxes(
    image_name: str = Query(...),
    bucket_name: str = Query(..., description="MinIO 버킷 이름"),  # ✅ 추가
    overlay: bool = Query(True, description="YOLO bbox 오버레이 표시 여부")
):
    if not image_name.endswith(".jpg"):
        raise HTTPException(400, "Only .jpg allowed")

    txt_name = image_name.replace(".jpg", ".txt")

    try:
        image_bytes = get_object(image_name, bucket_name).read()

        # overlay=True일 때만 어노테이션 파일 읽어서 bbox 그림
        if overlay:
            annotation_text = get_object(txt_name, bucket_name).read().decode("utf-8")
            preview = draw_yolo_bboxes(image_bytes, annotation_text)
        else:
            preview = image_bytes  # 원본 그대로 반환

        return Response(content=preview, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(500, f"preview 실패: {str(e)}")
