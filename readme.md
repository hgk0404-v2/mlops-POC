## test.minio-v2
✅ 1. uploader 페이지 버킷별로 분리하여 업로드 하는 기능 추가 <br>
✅ 2. viewer 페이지 버킷별로 분리하여 업로드 하는 기능 추가

## 실행
✅ 백그라운드 실행: docker-compose up -d --build <br>
✅ 실행: docker-compose up --build <br>
☑️ 모든 컨테이너 중지: docker-compose down <br>
☑️ 볼륨도 함께 제거: docker-compose down -v <br>

## 디렉토리 구조
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
<br>
<br>

## 구현 이미지
모든 이미지는 coco2017 이미지를 사용하였습니다.
### 1. 이미지 업로드 upload
<img width="1913" height="1030" alt="Image" src="https://github.com/user-attachments/assets/b87cd2eb-ad5d-4d37-a053-51315f8a297c" />

<br>

### 2. 업로드된 이미지 preview
각기 다른 클래스는 다른 색상으로 인식해서 preview 제공

2-1. 000000000036.jpg
<img width="1914" height="1029" alt="Image" src="https://github.com/user-attachments/assets/5d179ae0-a501-4684-8d7e-b39731707f70" />

**클래스 라벨링:**  

```txt
25 0.475759 0.414523 0.951518 0.672422
0 0.671279 0.617945 0.645759 0.726859
```
```
- 0 person
- 25 umbrella
```

<br>

2-2. 000000000127.jpg
<img width="1911" height="1028" alt="Image" src="https://github.com/user-attachments/assets/16725a8f-42a3-43e6-adaf-e5fd3601d965" />

**클래스 라벨링:**  

```txt
58 0.384211 0.176424 0.101078 0.146778
60 0.58357 0.652942 0.831141 0.694116
41 0.741516 0.589574 0.289375 0.259356
43 0.551609 0.760468 0.162844 0.330374
44 0.608008 0.659958 0.132672 0.171143
55 0.37832 0.694688 0.196797 0.293451
73 0.502742 0.49973 0.201672 0.192349
13 0.0502734 0.394875 0.100547 0.170374
13 0.281094 0.19657 0.0687187 0.0341788
25 0.541289 0.108805 0.163828 0.217609
25 0.230813 0.0645634 0.051125 0.115863
26 0.542062 0.426798 0.734312 0.339501
0 0.711789 0.0551871 0.0355469 0.0743243
13 0.216469 0.257308 0.101562 0.102807
13 0.348836 0.344044 0.0824219 0.0754054
60 0.582313 0.222152 0.334781 0.0486694
25 0.185305 0.0493971 0.0445156 0.0925988
```

<br>


