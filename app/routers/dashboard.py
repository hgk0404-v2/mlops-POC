# app/routers/dashboard.py
from fastapi import APIRouter
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

router = APIRouter()

# 대시보드 HTML (정적 파일이라면 Redirect로 열어도 됩니다)
@router.get("/dashboard", response_class=HTMLResponse)
def dashboard():
    # 정적 html을 쓰는 경우:
    return RedirectResponse("/static/dashboard/index.html", status_code=307)

# 정식 엔드포인트로 열기
@router.get("/upload")
def open_upload():
    return RedirectResponse("/static/uploader/index.html", status_code=307)

@router.get("/viewer")
def open_viewer():
    return RedirectResponse("/static/viewer/index.html", status_code=307)
