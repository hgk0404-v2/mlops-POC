// static/uploader/uploader.js
Dropzone.autoDiscover = false;

const dz = new Dropzone("#yoloDropzone", {
    paramName: "file",          // ← FastAPI upload_files의 파라미터 이름과 일치
    autoProcessQueue: true,
    uploadMultiple: false,        // ✅ Dropzone의 파일 업로드는 하나씩 전송됨
    maxFilesize: 50,             // MB
    acceptedFiles: ".jpg,.png,.svg,.txt",
    init: function () {
        /* ✅ 가장 중요: 업로드 직전 bucket_name 추가 */
        this.on("sending", function (file, xhr, formData) {
            const selectedBucket = document.getElementById("bucketSelect").value;
            formData.append("bucket_name", selectedBucket);
        });

        /* 선택: 성공/실패 로그 */
        this.on("success", function (file, response) {
            console.log("✅ 업로드 성공:", file.name, response);
        });
        this.on("error", function (file, errorMessage) {
            console.error("❌ 업로드 실패:", file.name, errorMessage);
        });
    }
});

// 목록 비우기 버튼 클릭으로 dropzone UI 초기화
document.getElementById("clearBtn").addEventListener("click", () => {
    // if (confirm("업로드된 항목을 모두 초기화할까요?")) {
    //     dz.removeAllFiles(true);  // ✅ Dropzone UI 상의 파일 모두 제거
    //     console.log("🧹 Dropzone 목록 비움");
    // }
    dz.removeAllFiles(true);  // ✅ Dropzone UI 상의 파일 모두 제거
    console.log("🧹 Dropzone 목록 비움");
});

/* 버킷 목록 로드 함수는 그대로 사용 */
async function loadBuckets() {
    try {
        const res = await fetch("/buckets");               // 필요하면 '/api/buckets'
        if (!res.ok) throw new Error(await res.text());
        const { buckets } = await res.json();

        const sel = document.getElementById("bucketSelect");
        sel.innerHTML = "";
        buckets.forEach(name => {
        sel.insertAdjacentHTML("beforeend",
            `<option value="${name}">${name}</option>`);
        });
        console.log("✅ 버킷 목록:", buckets);
    } catch (err) {
        console.error("❌ 버킷 목록 실패:", err);
        alert("버킷 목록을 불러오지 못했습니다.");
    }
}
document.addEventListener("DOMContentLoaded", loadBuckets);