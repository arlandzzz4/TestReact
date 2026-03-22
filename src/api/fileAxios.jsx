import { instance } from './axios'; // 기존에 토큰 인터셉터가 있는 인스턴스

export const uploadFile = async (formData) => {
  return await instance.post('/api/common/upload', formData, {
    // 대용량 파일 업로드 시 진행률을 보고 싶다면 추가 (옵션)
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    },
  });
};

/**
 * 다중 파일 업로드 함수
 * @param {File[] | FileList} fileList - 업로드할 파일들의 배열 또는 리스트
 */
export const uploadFileList = async (fileList) => {
  const formData = new FormData();

  // ★ 핵심: 같은 키 이름('files')으로 반복문을 돌려 append 합니다.
  // 백엔드의 @RequestPart("files") 이름과 일치해야 합니다.
  Array.from(fileList).forEach((file) => {
    formData.append('files', file); 
  });

  return await instance.post('/api/common/uploadList', formData, {
    // 전체 파일들에 대한 통합 진행률 표시
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    },
  });
};

/**
 * 단일 파일 삭제 함수
 * @param {string} filename - S3에 저장된 파일명 (확장자 포함)
 */
export const deleteFile = async (filename) => {
  // 1. @DeleteMapping에 맞춰 instance.delete 사용
  // 2. URL 경로에 변수를 넣기 위해 `(백틱) 사용
  // 3. 삭제 요청은 보통 본문(body)이 필요 없으므로 formData는 제거
  return await instance.delete(`/api/common/delete/${encodeURIComponent(filename)}`);
};