// static/viewer/render.js
// DOM에 리스트 렌더링
import { allFiles, selectedFiles } from './state.js';
import { loadFiles, filterAndRender } from './files.js';

// 파일 목록을 <ul>에 렌더링. 파일 이름, 체크박스, 삭제 버튼, 미리보기 포함
// 호출 위치: file.js의 filterAndRender() 내부
export function renderList(files) {
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
        const warning = hasTxt ? "" : " 🚨";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "file-checkbox";
        checkbox.checked = selectedFiles.has(name);
        checkbox.onchange = () => {
            checkbox.checked ? selectedFiles.add(name) : selectedFiles.delete(name);
            console.log("현재 선택:", [...selectedFiles]);
        };

        const fileSpan = document.createElement("span");
        fileSpan.textContent = name + warning;
        fileSpan.style.cursor = "pointer";
        fileSpan.onclick = () => {
            const bucket = document.getElementById("bucketSelect").value;
            if (!bucket) {
                alert("버킷을 선택해주세요.");
                return;
            }
            const url =
                `/preview?image_name=${encodeURIComponent(name)}` + `&bucket_name=${encodeURIComponent(bucket)}`;
            console.log("🖼️ Preview 요청:", url);
            document.getElementById("previewImage").src = url;
            document.getElementById("previewLabel").textContent = name; // ✅ 파일 이름 라벨 표시
        };

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
