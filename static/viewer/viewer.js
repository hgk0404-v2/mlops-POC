// static/viewer/viewer.js
console.log("✅ viewer.js loaded"); // 로드 잘 되었는지 확인용 F12 눌러서 console에서 확인
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded");
});

let allFiles = [];

document.getElementById("searchInput").addEventListener("input", filterAndRender);
document.getElementById("sortSelect").addEventListener("change", filterAndRender);

// *! 1. 🔄 전체 파일 목록 불러오기
async function loadFiles() {
    const res = await fetch('/files');
    const data = await res.json();
    allFiles = Array.isArray(data)
        ? data.map(item => typeof item === 'string' ? item : item.object_name)
        : (data.files || []);
    filterAndRender();  // 🚨 반드시 초기 렌더 호출
}
loadFiles();

// *! 2. 🔎 파일 필터 + 정렬
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
    if (sortType === "asc") {
        filtered.sort((a, b) => a.localeCompare(b));
    } else if (sortType === "desc") {
        filtered.sort((a, b) => b.localeCompare(a));
    }
    // 업로드 순은 그냥 정렬 안 함 (초기 순서 유지)
    renderList(filtered);
}

let selectedFiles = new Set(); // ✅ 선택 추적, 선택된 이미지 파일들 (Set 자료구조)

// *! 3. 📄 목록 렌더링
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
        const hasTxt = allFiles.includes(txtName); // ✅ 파일과 짝이 없는 .txt 감지
        const warning = hasTxt ? "" : " 🚨"; // .jpg에 해당하는 .txt가 없으면 🚨 표시

        // ✅ 체크박스
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "file-checkbox";
        checkbox.checked = selectedFiles.has(name);
        // 📦 체크박스 상태 따라 추가/삭제
        checkbox.onchange = () => {
            if (checkbox.checked) {
                selectedFiles.add(name);
            } else {
                selectedFiles.delete(name);
            }
            console.log('현재 선택:', [...selectedFiles]); // 🗒️ 콘솔 출력
        };

        // 📷 파일 이름 클릭 → preview
        const fileSpan = document.createElement("span");
        fileSpan.textContent = name + warning;
        fileSpan.style.cursor = "pointer";
        fileSpan.onclick = () => {
        // 🔍 파일 이름 클릭 시
        document.getElementById("previewImage").src =
            "/preview?image_name=" + name;
        };

        // 🗑️ 개별 삭제 버튼
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.className = "file-delete-button";
        deleteBtn.onclick = async () => {
            const ok = confirm(`정말 ${name} (+ txt) 파일을 삭제할까요?`);
            if (!ok) return;

            await fetch(`/delete?image_name=${encodeURIComponent(name)}`, { method: "DELETE" });
            loadFiles();
        };

            li.appendChild(checkbox);
            li.appendChild(fileSpan);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });
}

// *! 검색창에서 Enter 누르면 포커스 자동 해제 onkeydown 활용
document.getElementById("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();  // 폼 전송 방지
        e.target.blur();     // 포커스 해제
    }
});

// *! 업로드된 이미지 목록 크기 좌우 조절
const resizer = document.getElementById('resizer'); // 적용 대상 id="sidebar"
const sidebar = document.getElementById('sidebar');

resizer.addEventListener('mousedown', function (e) { // 드래그 시작
    document.addEventListener('mousemove', resize); // 누른 상태에서 마우스 이동 -> 사이즈 변경
    document.addEventListener('mouseup', stopResize); // 마우스 클릭에서 손 떼면 사이즈 변경 멈춤
});

function resize(e) {
    const newWidth = Math.min(Math.max(e.clientX, 150), 600); // 범위 제한
    sidebar.style.width = newWidth + 'px';
}

function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

// *! 일괄 삭제 이벤트 처리 🗑️ 선택 삭제
document.addEventListener('DOMContentLoaded', () => {
    /* === ↓ 기존 viewer.js 의 일괄-삭제 코드만 예시 ↓ === */
    document.getElementById('deleteSelected').onclick = async () => {
        console.log('🔔 deleteSelected 클릭됨');
        if (selectedFiles.size === 0) {
        alert('선택된 파일이 없습니다.');
        return;
        }

        const confirmMsg =
        `다음 ${selectedFiles.size}개 파일(+ txt)을 삭제할까요?\n\n`
        + [...selectedFiles].join('\n');
        if (!confirm(confirmMsg)) return;

        for (const name of selectedFiles)
        await fetch(`/delete?image_name=${encodeURIComponent(name)}`,
                    { method: 'DELETE' });

        selectedFiles.clear();
        loadFiles();
    };
});
