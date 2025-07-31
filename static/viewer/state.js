// static/viewer/state.js
// 전역 상태 공유
export let allFiles = [];
export let selectedFiles = new Set();

export function setAllFiles(files) {
    allFiles = files;
}

export function resetSelectedFiles() {
    selectedFiles = new Set();
}
