// static/viewer/viewer.js
let allFiles = [];

document.getElementById("searchInput").addEventListener("input", filterAndRender);
document.getElementById("sortSelect").addEventListener("change", filterAndRender);

function filterAndRender() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;

    let filtered = allFiles
        .filter(name =>
            name.toLowerCase().endsWith('.jpg') ||
            name.toLowerCase().endsWith('.jpeg') ||
            name.toLowerCase().endsWith('.png')
        )
        .filter(name => name.toLowerCase().includes(keyword)); // 검색 필터
    // 정렬 순서. 오름차순, 내림차순
    if (sortType === "name_asc") {
        filtered.sort((a, b) => a.localeCompare(b));
    } else if (sortType === "name_desc") {
        filtered.sort((a, b) => b.localeCompare(a));
    }

    renderList(filtered);
}

// .jpg에 해당하는 .txt가 없으면 🚨 표시
function renderList(files) {
    const ul = document.getElementById("fileList");
    ul.innerHTML = "";

    if (files.length === 0) {
        const li = document.createElement("li");
        li.textContent = "😢 검색 결과가 없습니다.";
        ul.appendChild(li);
        return;
    }

files.forEach(name => {
    const li = document.createElement("li");
    const txtName = name.replace(/\.(jpg|jpeg|png)$/i, ".txt");
    const hasTxt = allFiles.includes(txtName);

    li.textContent = hasTxt ? name : `${name} 🚨`;

    li.onclick = () => {
    document.getElementById("previewImg").src = "/preview?image_name=" + name;
    };
    ul.appendChild(li);
});
}

async function loadFiles() {
const res = await fetch('/files');
const data = await res.json();
allFiles = Array.isArray(data)
    ? data.map(item => typeof item === 'string' ? item : item.object_name)
    : (data.files || []);
filterAndRender();  // 🚨 반드시 초기 렌더 호출
}
loadFiles();

// 검색창에서 Enter 누르면 포커스 자동 해제 onkeydown 활용
document.getElementById("searchInput").addEventListener("keydown", function (e) {
if (e.key === "Enter") {
    e.preventDefault();  // 폼 전송 방지
    e.target.blur();     // 포커스 해제
}
});

const resizer = document.getElementById('resizer');
const sidebar = document.getElementById('sidebar');

resizer.addEventListener('mousedown', function (e) {
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
});

function resize(e) {
    const newWidth = Math.min(Math.max(e.clientX, 150), 600); // 범위 제한
    sidebar.style.width = newWidth + 'px';
}

function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}