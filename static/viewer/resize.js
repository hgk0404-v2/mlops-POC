// static/viewer/resize.js
// 사이드바 폭 조절
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
