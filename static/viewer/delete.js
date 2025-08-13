// static/viewer/delete.js
import { loadFiles } from './files.js';

// ✅ 체크된 체크박스를 DOM에서 직접 수집해 일괄 삭제
export async function handleBulkDelete() {
    console.log('🗑️ 선택 삭제 클릭');

    // 현재 버킷
    const bucket = document.getElementById('bucketSelect')?.value || '';
    if (!bucket) {
        alert('버킷을 선택해주세요.');
        return;
    }

    // #fileList 영역 안의 체크된 항목만 모음
    const checked = Array.from(
        document.querySelectorAll('#fileList input[type="checkbox"]:checked')
    );

    if (checked.length === 0) {
        alert('선택된 파일이 없습니다.');
        return;
    }

    // 각 체크박스에 data-name이 있어야 함 (render.js에서 넣습니다)
    const names = checked
        .map(c => c.dataset.name || c.value) // 혹시 value를 쓰는 구조면 대체
        .filter(Boolean);

    const ok = confirm(`다음 ${names.length}개 파일을 삭제할까요?\n\n${names.join('\n')}`);
    if (!ok) return;

    // 병렬 삭제
    await Promise.all(
        names.map(name =>
        fetch(
            `/delete?image_name=${encodeURIComponent(name)}&bucket_name=${encodeURIComponent(bucket)}`,
            { method: 'DELETE' }
        )
        )
    );

    // 선택 해제 후 목록 재로딩
    checked.forEach(c => (c.checked = false));
    await loadFiles(); // loadFiles 내부에서 렌더를 수행한다면 이것만으로 충분
}
