// static/viewer/resize.js
// 리사이저 마우스 이벤트 설정 (mousedown, mousemove, mouseup) -> 사이드바 너비 조절 가능하게 함
// 호출위치: main.js 내 초기화 시점
export function setupResizer() {
    const resizer = document.getElementById('resizer');
    const sidebar = document.getElementById('sidebar');

    resizer.addEventListener('mousedown', function (e) {
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
        const newWidth = Math.min(Math.max(e.clientX, 150), 600);
        sidebar.style.width = newWidth + 'px';
    }

    function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
}
