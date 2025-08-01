// static/viewer/main.js
// 진입점 / 이벤트 등록 / 초기화
import { loadFiles, filterAndRender } from './files.js';
import { handleBulkDelete } from './delete.js';
import { setupResizer } from './resize.js';

console.log("✅ viewer 모듈 기반 JS 시작"); // F12 console에 시작 로그 출력

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded");

    document.getElementById("deleteSelected").onclick = handleBulkDelete; // 선택삭제 버튼과 함수 연결

    document.getElementById("searchInput").addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault(); // Enter 눌렀을 때 폼이 전송 되는것 방지
            e.target.blur(); // 검색창에서 Enter 누르면 커서 포커스 해제(입력 완료 의미)
        }
    });

    document.getElementById("searchInput").addEventListener("input", filterAndRender); // 입력 변화 시 필터링
    document.getElementById("sortSelect").addEventListener("change", filterAndRender); // 정렬 방식 변경시 필터링

    loadFiles(); // 시작 시 목록 불러오기
    setupResizer(); // 리사이저 이벤트 연결
});
    // 📦 main.js
    //  ├── import → files.js
    //  │     ├── import → render.js
    //  │     │       └── import → state.js
    //  │     └── import → state.js
    //  ├── import → delete.js
    //  │     └── import → state.js
    //  ├── import → resize.js
