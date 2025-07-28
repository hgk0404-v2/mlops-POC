### 실행
✅ 백그라운드 실행: docker-compose up -d --build
✅ 실행: docker-compose up --build
☑️ 모든 컨테이너 중지: docker-compose down
☑️ 볼륨도 함께 제거: docker-compose down -v

### 디렉토리 구조
fastapi-projecvt-v0.1/ <br>
├── app/ <br>
│   ├── main.py <br>
│   ├── routers/ <br>
│   │   ├── __init__.py <br>
│   │   ├── upload_proxy.py  <br>
│   │   └── file.py         # 파일 업로드/다운로드 API <br>
│   ├── services/ <br>
│   │   └── minio_client.py # MinIO 연동 함수 <br>
│   ├── train/ <br>
│   │   └── trainer.py      # YOLOv8 학습 코드 <br>
│   └── static/ <br>
│       └── uploader/ <br>
│           └── index.html  <br>
├── Dockerfile <br>
├── docker-compose.yml <br>
├── requirements.txt <br>
├── .env <br>
└── 시작.txt <br>

