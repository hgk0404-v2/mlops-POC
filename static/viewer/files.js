// static/viewer/files.js
// 목록 불러오기 / 검색 / 정렬
import { allFiles, setAllFiles, selectedFiles } from './state.js';
import { renderList } from './render.js';

export async function loadFiles() {
    const res = await fetch('/files');
    const data = await res.json();
    const fileList = Array.isArray(data)
        ? data.map(item => typeof item === 'string' ? item : item.object_name)
        : (data.files || []);
    setAllFiles(fileList);
    filterAndRender();
}

export function filterAndRender() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;

    let filtered = allFiles
        .filter(name => /\.(jpg|jpeg|png)$/i.test(name))
        .filter(name => name.toLowerCase().includes(keyword));

    if (sortType === "asc") filtered.sort((a, b) => a.localeCompare(b));
    else if (sortType === "desc") filtered.sort((a, b) => b.localeCompare(a));

    renderList(filtered);
}
