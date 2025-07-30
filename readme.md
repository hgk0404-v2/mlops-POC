### 실행
✅ 백그라운드 실행: docker-compose up -d --build <br>
✅ 실행: docker-compose up --build <br>
☑️ 모든 컨테이너 중지: docker-compose down <br>
☑️ 볼륨도 함께 제거: docker-compose down -v <br>

### 디렉토리 구조
```
fastapi-projecvt-v0.1/
├── app/
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── file.py         # 파일 업로드/다운로드 API
│   │   ├── preview.py         # 
│   │   └── upload_proxy.py
│   ├── services/
│   │   ├── minio_client.py # MinIO 연동 함수
│   │   └── preview_renderer.py
│   ├── train/
│   │   └── trainer.py      # YOLOv8 학습 코드
│   └── main.py
├── static/ 
│   └── uploader/
│       └── index.html
│       └── uploader.css 
│       └── uploader.js
│   └── viewer/
│       └── index.html
│       └── viewer.css
│       └── viewer.js
├── .env
├── 시작.txt
├── docker-compose.yaml
├── Dockerfile.fastapi 
├── readme.md 
└── requirements.txt
```
