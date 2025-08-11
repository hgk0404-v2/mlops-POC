// static/viewer/select_all.js
export function initSelectAll({ buttonId = 'selectAllBtn', listRoot = '#fileList' } = {}) {
    const btn = document.getElementById(buttonId);
    const root = document.querySelector(listRoot);
    if (!btn || !root) return;

    const getChecks = () => Array.from(root.querySelectorAll('input[type="checkbox"]'));

    function updateButtonLabel() {
        const checks = getChecks();
        const anyUnchecked = checks.some(c => !c.checked);
        btn.innerHTML = anyUnchecked ? '✅ 전체 선택' : '❎ 전체 해제';
    }

    btn.addEventListener('click', () => {
        const checks = getChecks();
        const anyUnchecked = checks.some(c => !c.checked);
        checks.forEach(c => { c.checked = anyUnchecked; });
        updateButtonLabel();
    });

    // 초기 라벨 상태 세팅
    updateButtonLabel();

    // 외부에서 목록 재렌더(loadFiles → render) 후 라벨이 어긋나면,
    // 아래 커스텀 이벤트를 발행해서 상태를 맞출 수 있습니다.
    document.addEventListener('files:rendered', updateButtonLabel);
}
