// static/viewer/state.js
// 전역 상태 공유
export let allFiles = []; // 서버에서 받아온 전체 파일 목록을 저장하는 전역 변수
export let selectedFiles = new Set(); // 체크박스 등으로 사용자가 선택한 파일 조합

export function setAllFiles(files) { // allFiles 값을 업데이트함
    allFiles = files;
}

export function resetSelectedFiles() { // 선택된 파일 Set을 비움
    selectedFiles = new Set();
}
