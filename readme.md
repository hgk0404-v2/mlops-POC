### 실행
✅ 백그라운드 실행: docker-compose up -d --build <br>
✅ 실행: docker-compose up --build <br>
☑️ 모든 컨테이너 중지: docker-compose down <br>
☑️ 볼륨도 함께 제거: docker-compose down -v <br>

### 디렉토리 구조
```
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
```
