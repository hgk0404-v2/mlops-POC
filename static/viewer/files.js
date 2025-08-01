// static/viewer/files.js
// 목록 불러오기 / 검색 / 정렬
import { allFiles, setAllFiles, selectedFiles } from './state.js';
import { renderList } from './render.js';

// "/files" API 호출하여 전체 파일 목록을 불러오고 setAllFiles()로 저장한 뒤 렌더링
// 호출 위치: main.js, 삭제 후 재갱신
export async function loadFiles() {
    const bucket = document.getElementById("bucketSelect").value;
    if (!bucket) {
        console.warn("🚫 버킷이 선택되지 않음. loadFiles 중단.");
        return;
    }

    const res = await fetch(`/files?bucket_name=${encodeURIComponent(bucket)}`);
    if (!res.ok) {
        const errText = await res.text();
        throw new Error("❌ 파일 목록 로딩 실패: " + errText);
    }

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

// 버킷 목록 불러오는 함수 추가
export async function loadBuckets() {
    try {
        const res = await fetch("/buckets");
        const data = await res.json();
        const select = document.getElementById("bucketSelect");

        select.innerHTML = "";
        data.buckets.forEach((bucket, index) => {
            const option = document.createElement("option");
            option.value = bucket;
            option.textContent = bucket;
            select.appendChild(option);
        });
        
        // ✅ 첫 번째 항목을 기본 선택
        if (data.buckets.length > 0) {
            select.value = data.buckets[0];  // 또는: select.selectedIndex = 0;
        }

        console.log("✅ 버킷 목록:", data.buckets);
    } catch (err) {
        console.error("❌ 버킷 목록 불러오기 실패:", err);
    }
}
