// static/viewer/delete.js
import { selectedFiles } from './state.js';
import { loadFiles } from './files.js';

export async function handleBulkDelete() {
    console.log("🔔 deleteSelected 클릭됨");

    if (selectedFiles.size === 0) {
        alert("선택된 파일이 없습니다.");
        return;
    }

    const confirmMsg =
        `다음 ${selectedFiles.size}개 파일을 삭제할까요?\n\n` +
        [...selectedFiles].join('\n');
    if (!confirm(confirmMsg)) return;

    for (const name of selectedFiles)
        await fetch(`/delete?image_name=${encodeURIComponent(name)}`, { method: 'DELETE' });

    selectedFiles.clear();
    loadFiles();
}
