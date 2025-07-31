// static/viewer/main.js
// 진입점 / 이벤트 등록 / 초기화
import { loadFiles, filterAndRender } from './files.js';
import { handleBulkDelete } from './delete.js';
import { setupResizer } from './resize.js';

console.log("✅ viewer 모듈 기반 JS 시작");

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded");

    document.getElementById("deleteSelected").onclick = handleBulkDelete;

    document.getElementById("searchInput").addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }
    });

    document.getElementById("searchInput").addEventListener("input", filterAndRender);
    document.getElementById("sortSelect").addEventListener("change", filterAndRender);

    loadFiles();
    setupResizer();
});
    // 📦 main.js
    //  ├── import → files.js
    //  │     ├── import → render.js
    //  │     │       └── import → state.js
    //  │     └── import → state.js
    //  ├── import → delete.js
    //  │     └── import → state.js
    //  ├── import → resize.js
