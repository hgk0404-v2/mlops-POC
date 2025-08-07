### test.minio-v2
✅ 1. uploader 페이지 버킷별로 분리하여 업로드 하는 기능 추가 <br>
✅ 2. viewer 페이지 버킷별로 분리하여 업로드 하는 기능 추가

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
│       └── delete.js
│       └── files.js
│       └── main.js
│       └── render.js
│       └── resize.js
│       └── state.js
│       └── viewer.js // 사용 ❌
├── .env
├── 시작.txt
├── docker-compose.yaml
├── Dockerfile.fastapi 
├── readme.md 
└── requirements.txt
```

### 구현 이미지
모든 이미지는 coco2017 이미지를 사용하였습니다.
1. 이미지 업로드 upload
<img width="1913" height="1030" alt="Image" src="https://github.com/user-attachments/assets/b87cd2eb-ad5d-4d37-a053-51315f8a297c" />

<br>

2. 업로드된 이미지 preview
- 2-1.
<img width="1914" height="1029" alt="Image" src="https://github.com/user-attachments/assets/5d179ae0-a501-4684-8d7e-b39731707f70" />
<br>
- 2-2. 
<img width="1911" height="1028" alt="Image" src="https://github.com/user-attachments/assets/16725a8f-42a3-43e6-adaf-e5fd3601d965" />
<br>


