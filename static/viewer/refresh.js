// static/viewer/refresh.js
export function initRefresh({ loadFiles, filterAndRender, buttonId = 'refreshListBtn' }) {
    const btn = document.getElementById(buttonId);
    if (!btn) return; // 버튼이 없으면 조용히 종료

    btn.addEventListener('click', async () => {
        console.log('🔃 새로고침 버튼 클릭 → 최신 목록 요청');
        btn.disabled = true;
        const oldText = btn.textContent;
        btn.textContent = '새로고침 중...';

        try {
        await loadFiles();       // 현재 선택 버킷 기준 최신 목록
        filterAndRender();       // 기존 검색/정렬 상태로 재렌더
        } catch (err) {
        console.error('새로고침 실패:', err);
        alert('목록 새로고침에 실패했습니다.');
        } finally {
        btn.textContent = oldText;
        btn.disabled = false;
        }
    });
}
