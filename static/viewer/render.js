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
         // allFiles가 Array이든 Set이든 안전하게 동작하도록 처리
        const hasTxt = Array.isArray(allFiles)
        ? allFiles.includes(txtName)
        : (allFiles && typeof allFiles.has === 'function')
            ? allFiles.has(txtName)
            : false;
        const warning = hasTxt ? "" : " 🚨";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "file-checkbox";
        checkbox.dataset.name = name;   // ✅ 삭제용: 파일명을 dataset에 저장
        checkbox.value = name;          // (백업용) value에도 동일하게
        checkbox.checked = selectedFiles.has(name);
        checkbox.onchange = () => {
            checkbox.checked ? selectedFiles.add(name) : selectedFiles.delete(name);
            console.log("현재 선택:", [...selectedFiles]);
        };

        const fileSpan = document.createElement("span");
        fileSpan.textContent = name + warning;
        
        // ✅ li 전체(빈 여백 포함)를 클릭하면 미리보기, 단 체크박스 클릭은 제외
        li.addEventListener("click", (e) => {
            if (e.target.closest('input[type="checkbox"]')) return; // 체크박스 클릭은 무시
            const bucket = document.getElementById("bucketSelect").value;
            if (!bucket) {
                alert("버킷을 선택해주세요.");
                return;
            }
            const url = `${window.location.origin}/preview?image_name=${encodeURIComponent(name)}&bucket_name=${encodeURIComponent(bucket)}`;
            console.log("🖼️ Preview 요청:", url);
            // document.getElementById("previewImage").src = url;
            applyPreviewSrc(name, bucket);
            document.getElementById("previewLabel").textContent = name;
        });

        li.appendChild(checkbox);
        li.appendChild(fileSpan);
        ul.appendChild(li);
    });
    // ✅ 목록 렌더 완료 이벤트(전체선택 버튼 라벨 갱신에 사용)
    document.dispatchEvent(new Event('files:rendered'));
}

// === Overlay 상태 ===
let overlayOn = true;

function applyPreviewSrc(name, bucket) {
    const url = `${window.location.origin}/preview`
                + `?image_name=${encodeURIComponent(name)}`
                + `&bucket_name=${encodeURIComponent(bucket)}`
                + `&overlay=${overlayOn ? 1 : 0}`
                + `&_=${Date.now()}`; // 캐시 방지
    console.log("🖼️ Preview 요청:", url);
    document.getElementById("previewImage").src = url;
    document.getElementById("previewLabel").textContent = name;
}

const overlayBtn = document.getElementById('overlayToggleBtn');
if (overlayBtn) {
    overlayBtn.addEventListener('click', () => {
        overlayOn = !overlayOn;
        overlayBtn.classList.toggle('off', !overlayOn);
        overlayBtn.textContent = overlayOn ? '어노테이션 ON' : '어노테이션 OFF';

        // 현재 표시 중인 이미지 다시 로드
        const bucket = document.getElementById("bucketSelect").value;
        const currentName = document.getElementById("previewLabel").textContent?.trim();
        if (bucket && currentName) applyPreviewSrc(currentName, bucket);
    });
}