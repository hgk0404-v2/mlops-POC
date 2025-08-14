from PIL import Image, ImageDraw
import io, colorsys

def color_for(cls_id: int) -> tuple[int,int,int]:
    # golden-ratio 파생 상수로 Hue 분산
    hue = (cls_id * 0.61803398875) % 1.0      # 0-1
    r, g, b = colorsys.hsv_to_rgb(hue, 0.8, 1) # S, V 값은 고정
    return int(r*255), int(g*255), int(b*255)

def draw_yolo_bboxes(image_bytes: bytes, anno_txt: str) -> bytes:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    w, h = img.size
    draw = ImageDraw.Draw(img, "RGBA")

    for line in anno_txt.strip().splitlines():
        cls, cx, cy, bw, bh = map(float, line.split())
        x1 = (cx - bw/2) * w
        y1 = (cy - bh/2) * h
        x2 = (cx + bw/2) * w
        y2 = (cy + bh/2) * h

        color = (*color_for(int(cls)), 255)
        draw.rectangle([x1, y1, x2, y2], outline=color, width=3)

    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()
