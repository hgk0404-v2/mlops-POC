// static/viewer/main.js
// 진입점 / 이벤트 등록 / 초기화
import { loadFiles, filterAndRender, loadBuckets } from './files.js';
import { handleBulkDelete } from './delete.js';
import { setupResizer } from './resize.js';
import { initRefresh } from './refresh.js';

console.log("✅ viewer 모듈 기반 JS 시작"); // F12 console에 시작 로그 출력
const $ = (s) => document.querySelector(s);

// 프리뷰 라벨 세터 (안전하게 사용)
function setPreviewLabel(name) {
    const el = $('#previewLabel');
    if (!el) return; // 요소가 아직 없더라도 앱이 죽지 않게
    el.textContent = name || '파일을 선택하세요';
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM fully loaded");

    // 0) 초기 라벨
    setPreviewLabel('파일을 선택하세요');

    // 1) UI 이벤트 바인딩
    $('#deleteSelected').onclick = handleBulkDelete;

    $('#searchInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
        }
    });
    $('#searchInput').addEventListener('input', filterAndRender);
    $('#sortSelect').addEventListener('change', filterAndRender);

    $('#bucketSelect').addEventListener('change', async () => {
        console.log('🔄 버킷 변경됨 → 파일 목록 재로딩');
        await loadFiles(); // 선택된 버킷 기준으로 내부에서 처리
    });

    // 2) 프리뷰 변경 이벤트 수신 → 라벨만 갱신
    //   (render.js 또는 files.js에서 프리뷰 바꿀 때 아래 이벤트를 dispatch 해주세요)
    document.addEventListener('preview:change', (e) => {
        setPreviewLabel(e.detail?.filename);
    });

    // 3) 초기 데이터 로딩
    await loadBuckets(); // #bucketSelect 옵션 채우기
    const first = await loadFiles(); // 파일 목록 로드 (가능하면 첫 파일 프리뷰까지)
    //  ⤷ 만약 loadFiles가 첫 파일명을 리턴하도록 구현했다면:
    if (first) {
        // 첫 프리뷰가 이미 표시됐다면 render.js쪽에서 이벤트를 쐈을 것이고,
        // 아니라면 최소 라벨만이라도 맞춰 둡니다.
        setPreviewLabel(first);
    }
    initRefresh({ loadFiles, filterAndRender });

    // 4) 리사이저
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
