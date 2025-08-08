# app/services/minio_client.py
import os
from minio import Minio
from minio.error import S3Error
from dotenv import load_dotenv, find_dotenv
# """
#     MinIO 연동 함수
# """
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")

# ✨ 경로를 수동으로 계산하지 말고, 프로젝트 트리에서 .env 를 자동 탐색
load_dotenv(find_dotenv())

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET = os.getenv("MINIO_BUCKET")

client = Minio(
    endpoint=MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False,
)
# ────────────────────────── MinIO Helper ──────────────────────────
# 버킷 목록 조회
def list_buckets():
    return [b.name for b in client.list_buckets()]

# ── 추가: 버킷 존재 여부
def bucket_exists(bucket_name: str) -> bool:
    return client.bucket_exists(bucket_name)

def create_bucket(bucket_name: str):
    if not client.bucket_exists(bucket_name):
        client.make_bucket(bucket_name)

# ── 추가: 버킷 비우기(모든 객체 삭제)
def _empty_bucket(bucket_name: str):
    # recursive=True 로 전체 객체 순회
    objs = client.list_objects(bucket_name, recursive=True)
    # 대량 삭제 API 사용
    client.remove_objects(bucket_name, (obj.object_name for obj in objs))

# ── 추가: 버킷 삭제(force=True면 비운 뒤 삭제)
def delete_bucket(bucket_name: str, force: bool = False):
    if force:
        _empty_bucket(bucket_name)
    client.remove_bucket(bucket_name)

# 버킷이 없다면 생성
def ensure_bucket():
    if not client.bucket_exists(MINIO_BUCKET):
        client.make_bucket(MINIO_BUCKET)

# 파일 업로드
def upload_file(file_data, file_name: str, bucket_name: str):
    client.put_object(bucket_name, file_name, file_data, length=-1, part_size=10*1024*1024)

# 파일 목록 조회
def list_files(bucket_name: str):
    return [obj.object_name for obj in client.list_objects(bucket_name)]

# 파일 다운로드
def download_file(file_name: str, bucket_name: str):
    return client.get_object(bucket_name, file_name)

# 파일 삭제
# def delete_file(file_name: str):
#     client.remove_object(MINIO_BUCKET, file_name)
def delete_file(file_name: str, bucket_name: str):
    client.remove_object(bucket_name, file_name)

def get_object(file_name: str, bucket_name: str):
    return client.get_object(bucket_name, file_name)


