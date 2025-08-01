// static/viewer/files.js
// 목록 불러오기 / 검색 / 정렬
import { allFiles, setAllFiles, selectedFiles } from './state.js';
import { renderList } from './render.js';

// "/files" API 호출하여 전체 파일 목록을 불러오고 setAllFiles()로 저장한 뒤 렌더링
// 호출 위치: main.js, 삭제 후 재갱신
export async function loadFiles() {
    const res = await fetch('/files');
    const data = await res.json();
    const fileList = Array.isArray(data)
        ? data.map(item => typeof item === 'string' ? item : item.object_name)
        : (data.files || []);
    setAllFiles(fileList);
    filterAndRender();
}

// 검색어 및 정렬 조건에 맞는 파일 목록을 필터링하고 renderList()로 넘김
// 입력창, 드롭다운 변경 시
export function filterAndRender() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;

    let filtered = allFiles
        .filter(name => /\.(jpg|jpeg|png)$/i.test(name))
        .filter(name => name.toLowerCase().includes(keyword));

    if (sortType === "asc") { 
        console.log("🔼 오름차순 정렬 적용됨");
        filtered.sort((a, b) => a.localeCompare(b));
    }
    else if (sortType === "desc") { 
        console.log("🔽 내림차순 정렬 적용됨");
        filtered.sort((a, b) => b.localeCompare(a));
    }
    else if (sortType === "upload") {
        console.log("📦 업로드 순 유지 (정렬 안함)");
    }
    renderList(filtered);
}
