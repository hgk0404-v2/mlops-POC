// static/uploader/uploader.js
Dropzone.autoDiscover = false;

const dz = new Dropzone("#yoloDropzone", {
paramName: "file",        // FastAPI에서 받을 필드명
autoProcessQueue: true,   // 드롭하자마자 업로드
uploadMultiple: false,    // false가 되면 여러 파일 전송 가능
maxFilesize: 50,          // MB
acceptedFiles: ".jpg,.png,.svg,.txt",
init: function () {
    this.on("success", function (file, response) {
    console.log("✅ 업로드 성공:", file.name, response);
    });
    this.on("error", function (file, errorMessage) {
    console.error("❌ 업로드 실패:", file.name, errorMessage);
    });
}
});