### 디렉토리 구조

fastapi-projecvt-v0.1/
├── app/
│   ├── main.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── upload_proxy.py  
│   │   └── file.py         # 파일 업로드/다운로드 API
│   ├── services/
│   │   └── minio_client.py # MinIO 연동 함수
│   ├── train/
│   │   └── trainer.py      # YOLOv8 학습 코드
│   └── static/
│       └── uploader/
│           └── index.html  
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env
└── 시작.txt
