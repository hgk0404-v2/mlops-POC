from PIL import Image, ImageDraw
import io

def draw_yolo_bboxes(image_bytes: bytes, annotation_text: str) -> bytes:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    w, h = img.size
    draw = ImageDraw.Draw(img)

    for line in annotation_text.strip().splitlines():
        parts = line.strip().split()
        if len(parts) != 5:
            continue
        cls, xc, yc, bw, bh = map(float, parts)
        x1 = (xc - bw / 2) * w
        y1 = (yc - bh / 2) * h
        x2 = (xc + bw / 2) * w
        y2 = (yc + bh / 2) * h
        draw.rectangle([x1, y1, x2, y2], outline="red", width=2)

    output = io.BytesIO()
    img.save(output, format="JPEG")
    output.seek(0)
    return output.read()
