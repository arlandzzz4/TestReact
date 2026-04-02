//WritePost.jsx
//유저가 글쓰기를 통해 포스트를 작성. react-quill 이용
// 추후에 카테고리를 코드 형식으로 DB에 전달하는 코드 있어야 함. 지금은 하드코딩 형식으로 작성해놓음
// 지금은 테스트용도라 로그인 없이 글쓰기 페이지 접근 가능 ==> 유저 아이디 받는 코드가 없음. 추가 필요
//지금은 사용자 로컬의 url로 이미지가 들어감 -> DB에 그대로 전송 시 깨짐(사용자 로컬의 URl값을 다른 컴퓨터에서 읽을 수 없으니 ㅇㅇ)
//      => S3에서 어떻게 처리할지 알아보고 생각할것

// 이미지 처리 흐름 아이디어1)
// 사용자가 이미지 선택 → 브라우저 메모리에만 임시 저장 (미리보기용)
// → 등록 버튼 클릭
// → /api/common/uploadList 로 이미지 업로드 → S3 URL 반환
// → 글 내용 + S3 URL 함께 DB 저장 API 호출
// api에 전달 시 유저 이메일 , 카테고리 id, 제목, 컨텐츠, 작성시간 이렇게 보내줘야 함

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill'; // 보통 React에서는 ReactQuill 이름으로 가져옵니다.
import 'react-quill/dist/quill.snow.css';
import { CContainer, CButton, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilX } from '@coreui/icons';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import { instance } from '@/api/axios';
import '../../scss/WritePost.scss'; // SCSS 파일 import
import { useParams } from 'react-router-dom';

export default function WritePost() {
  const navigate = useNavigate();
  const { id } = useParams();   // ← 추가 (게시글 수정 시, [수정완료]버튼)
  const isEditMode = !!id;      // ← 추가 (게시글 수정 시, [수정완료]버튼)
  const CATEGORY_COLORS = {
    '자유': { bg: '#F0E6D3', color: '#B07D3A' },
    '정보': { bg: '#D3E8DF', color: '#2E6B4F' },
    '인원모집': { bg: '#D9E4F5', color: '#2D4FA0' },
  }
  const [showModal, setShowModal] = useState(false); //모달창 표시
  const [isDirty, setIsDirty] = useState(false) //변경 추적
  const [category, setCategory] = useState('자유');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]); //이미지용
  const MaxImages = 3; //최대 3장까지만 첨부 가능

  const modules = { //react-quill 상단 툴바 기능
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ size: ['small', false, 'large', 'huge'] }]
      ]
    }
  }

  useEffect(() => { //입력 감지 - 취소/뒤로가기 모달창을 위함
    if (title || content) {
      setIsDirty(true)
    }
  }, [title, content])

  const handleLeave = () => {
    if (isDirty) {
      setShowModal(true)
    } else {
      navigate(-1)
    }
  }

  const validateForm = () => { // 필수입력요소(제목,본문) 입력확인
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = '필수 입력 요소입니다.';
    }
    // ReactQuill의 빈 값은 <p><br></p> 형태로 들어옵니다.
    if (!content.trim() || content === '<p><br></p>') {
      newErrors.content = '필수 입력 요소입니다.';
    }
    return newErrors;
  };

  //@@@@@@@@@@테스트용 유저 이메일 하드코딩. 추후 로그인 시 이 값을 전달하도록 수정 필요 @@@@@@@@@@@@@
  const user = "arlandzzz4@gmail.com";

  // 카테고리 이름을 서버에서 요구하는 코드(01, 02, 03)로 변환하는 함수
  const getCategoryId = (name) => {
    switch (name) {
      case '자유':
        return '01';
      case '정보':
        return '02';
      case '인원모집':
        return '03';
      default:
        return '01'; // 기본값으로 '자유' 설정
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 브라우저 새로고침 방지
    const formErrors = validateForm();
    const categoryCode = getCategoryId(category);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});

    try {
      // 1. 게시글 먼저 등록 → post_id 반환
      const response = await instance.post('/api/postwrite/create', {
        userEmail: user,
        categoryCode: categoryCode,
        title: title,
        content: content
      });

      const postId = response.data; // 반환된 post_id

      // 2. 이미지가 있으면 post_id와 함께 업로드
      if (images.length > 0) {
        const formData = new FormData();
        formData.append('postId', postId);
        images.forEach((img) => {
          formData.append('file', img.file);
        });

        await instance.post('/api/common/uploadList', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      console.log('게시글 등록 성공:', response.data);
      alert('게시글이 성공적으로 등록되었습니다.');
      navigate(-1); // 이전 페이지로 돌아가기
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);

    // 10MB 초과 파일 체크
    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`10MB 이하의 이미지만 첨부 가능합니다.`);
      return;
    }

    if (images.length + files.length > MaxImages) {
      alert(`이미지는 최대 ${MaxImages}장까지 첨부 가능합니다.`);
      return;
    }

    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = ''; // 같은 파일 재선택 가능하도록 초기화
  };

  const handleImageRemove = (id) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview); // 메모리 해제
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <>
      {/* ── 상단 헤더 바 ── */}
      <div className="d-flex align-items-center justify-content-center position-relative py-3 border-bottom mb-4 write-post-header">
        <CButton
          color="link"
          className="text-dark position-absolute start-0 ms-4"
          onClick={handleLeave}
        >
          <CIcon icon={cilArrowLeft} size="lg" />
        </CButton>
        {/* 원래 <h5 className="m-0 fw-bold" >게시글 작성</h5> */}
        {/* 수정 후 */}
        <h5 className="m-0 fw-bold">{isEditMode ? '게시글 수정' : '게시글 작성'}</h5>
      </div>
      {/* ── 에디터 및 본문 영역 ── */}
      <div className="d-flex justify-content-center mb-5 write-post-container">
        <div className="write-post-inner">
          <form onSubmit={handleSubmit}>
            {/* ── 카테고리 선택 영역 ── */}
            <p className="form-section-title  mt-3">카테고리 <span className="required-star">*</span></p>
            <div className="d-flex gap-2 mb-3">
              {['자유', '정보', '인원모집'].map((cat) => (
                <CButton
                  key={cat}
                  className="category-btn"
                  color="light"
                  style={{
                    backgroundColor: category === cat ? CATEGORY_COLORS[cat].bg : '',
                    color: category === cat ? CATEGORY_COLORS[cat].color : '',
                    border: category === cat ? `1px solid ${CATEGORY_COLORS[cat].color}` : '',
                  }}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </CButton>
              ))}
            </div>

            <div className="custom-quill-editor">
              <hr />
              <p className="form-section-title">제목 <span className="required-star">*</span></p>
              <CFormInput className="post-input" type='text' placeholder='제목 입력' value={title} onChange={(e) => setTitle(e.target.value)} />
              {errors.title && <div className="error-message">{errors.title}</div>}

              <hr />
              <p className="form-section-title">본문 <span className="required-star">*</span></p>
              <ReactQuill className="post-editor" modules={modules} value={content} onChange={setContent} />
              {errors.content && <div className="error-message">{errors.content}</div>}
            </div>

            {/* 3. JSX - 하단 버튼 영역 위에 삽입 */}
            <hr />
            <p className="form-section-title">
              이미지 첨부 <span className="image-limit-info">최대 3장 · JPG, PNG · 각 10MB 이하</span>
            </p>

            <div className="image-upload-area">
              {/* 추가 버튼 - 최대 개수 미만일 때만 표시 */}
              {images.length < MaxImages && (
                <label className="image-add-btn">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleImageAdd}
                  />
                  <span className="image-add-icon">+</span>
                  <span className="image-add-text">사진 추가</span>
                </label>
              )}

              {/* 미리보기 썸네일 */}
              {images.map((img) => (
                <div key={img.id} className="image-preview-item">
                  <img src={img.preview} alt="첨부 이미지" className="image-preview-thumb" />
                  <button
                    type="button"
                    className="image-remove-btn"
                    onClick={() => handleImageRemove(img.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* ── 하단 버튼 영역 ── */}
            <div className="d-flex justify-content-center gap-2 mt-4">
              <CButton className="form-cancel-btn" onClick={handleLeave}>
                취소
              </CButton>
              {/* 원래 
            <CButton
              type="submit"
              className="form-submit-btn"
            >
              등록
            </CButton> */}
              <CButton type="submit" className="form-submit-btn">
                {isEditMode ? '수정완료' : '등록'}
              </CButton>
            </div>
          </form>
        </div>
      </div>
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        alignment="center"   // 수직 중앙
      >
        <CModalHeader>
          {/* 제목을 body로 옮기고 헤더는 닫기 버튼만 남김 */}
        </CModalHeader>
        <CModalBody className="text-center pt-4">
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3 modal-warning-icon"
          >
            <CIcon icon={cilX} size="xl" />
          </div>
          <h5 className="fw-bold mb-2 text-danger">잠깐!</h5>
          <p className="mb-0">
            작성 중인 내용이 저장되지 않습니다
            <br />
            이대로 나가시겠습니까?
          </p>
        </CModalBody>
        <CModalFooter className="justify-content-center">
          <CButton
            color="green"
            className="text-white modal-action-btn"
            onClick={() => setShowModal(false)}
          >
            계속 작성
          </CButton>
          <CButton
            className="text-white modal-action-btn modal-exit-btn"
            onClick={() => {
              setShowModal(false)
              navigate(-1)
            }}
          >
            나가기
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}