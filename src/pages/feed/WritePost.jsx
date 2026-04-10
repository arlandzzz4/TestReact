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

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CContainer, CButton, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilX } from '@coreui/icons';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import '../../scss/WritePost.scss';
import '../../scss/style.scss';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { createPost, uploadPostImages, getPostDetail, updatePost, deletePostImage } from '@/api/postApi';

export default function WritePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const CATEGORY_COLORS = {
    '자유': { bg: '#F0E6D3', color: '#B07D3A' },
    '정보': { bg: '#D3E8DF', color: '#2E6B4F' },
    '인원모집': { bg: '#D9E4F5', color: '#2D4FA0' },
    '공지사항': { bg: '#F7E6EA', color: '#A63A50' },
  }
  const [showModal, setShowModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false)
  const [category, setCategory] = useState('자유');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState([]);
  const MaxImages = 3;
  const { user, isAdmin } = useAuth();
  const quillRef = useRef(null);

  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ size: ['small', false, 'large', 'huge'] }]
      ]
    }
  }

  useEffect(() => {
    if (!isEditMode) return;
    getPostDetail(id)
      .then(res => {
        const post = res.data;
        setTitle(post.title);
        setContent(post.content);
        const categoryMap = { '01': '자유', '02': '정보', '03': '인원모집', '04': '공지사항' };
        setCategory(categoryMap[post.categoryCode] || '자유');
        // 기존 이미지 불러오기
        if (post.imageUrls && post.imageUrls.length > 0) {
          const existingImages = post.imageUrls.map((url) => ({
            id: Date.now() + Math.random(),
            preview: `http://localhost:8080${url}`,
            isExisting: true,
            url: url,
          }));
          setImages(existingImages);
        }
      })
      .catch(err => console.error('게시글 불러오기 실패', err));
  }, [isEditMode, id]);

  const handleLeave = () => {
    if (isDirty) {
      setShowModal(true)
    } else {
      navigate(-1)
    }
  }

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = '필수 입력 요소입니다.';
    }
    if (!content.trim() || content === '<p><br></p>') {
      newErrors.content = '필수 입력 요소입니다.';
    }
    return newErrors;
  };

  const getCategoryId = (name) => {
    switch (name) {
      case '자유': return '01';
      case '정보': return '02';
      case '인원모집': return '03';
      case '공지사항': return '04';
      default: return '01';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    const categoryCode = getCategoryId(category);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});

    try {
      if (isEditMode) {
        await updatePost(id, {
          categoryCode: categoryCode,
          title: title,
          content: content
        });
        // 삭제할 기존 이미지 처리
        for (const url of deletedImageUrls) {
          const fileName = url.split('/').pop(); // URL에서 파일명만 추출
          await deletePostImage(fileName);
        }
        // 새로 추가한 이미지 업로드
        const newImages = images.filter(img => !img.isExisting);
        if (newImages.length > 0) {
          const formData = new FormData();
          formData.append('postId', Number(id));
          newImages.forEach((img) => {
            formData.append('file', img.file);
          });
          await uploadPostImages(formData);
        }
        alert('게시글이 수정되었습니다.');
        navigate(`/post/${id}`);
      } else {
        const postId = await createPost({
          userEmail: user?.email,
          categoryCode: categoryCode,
          title: title,
          content: content
        });
        if (images.length > 0) {
          const formData = new FormData();
          formData.append('postId', Number(postId));
          images.forEach((img) => {
            formData.append('file', img.file);
          });
          await uploadPostImages(formData);
        }
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate(-1);
      }
    } catch (error) {
      console.error('게시글 처리 실패:', error);
      alert('오류! 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
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
    e.target.value = '';
  };

  const handleImageRemove = (id) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) {
        if (removed.isExisting) {
          // 기존 이미지면 삭제 목록에 추가
          setDeletedImageUrls(d => [...d, removed.url]);
        } else {
          // 새 이미지면 미리보기 URL 해제
          URL.revokeObjectURL(removed.preview);
        }
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <>
      {/* ── 상단 헤더 바 ── */}
      <div className="d-flex align-items-center justify-content-center position-relative py-3 border-bottom mb-4 write-post-header"
        style={isEditMode ? { marginTop: '-24px' } : { marginTop: '0px' }}>
        <CButton
          color="link"
          className="text-dark position-absolute start-0 ms-4"
          onClick={handleLeave}
        >
          <CIcon icon={cilArrowLeft} size="lg" />
        </CButton>
        <h5 className="m-0 fw-bold">{isEditMode ? '게시글 수정' : '게시글 작성'}</h5>
      </div>

      {/* ── 에디터 및 본문 영역 ── */}
      <div className="d-flex justify-content-center mb-5 write-post-container">
        <div className="write-post-inner">
          <form onSubmit={handleSubmit}>
            {/* ── 카테고리 선택 영역 ── */}
            <p className="form-section-title mt-3">카테고리 <span className="required-star">*</span></p>
            <div className="d-flex gap-2 mb-3">
              {(isAdmin ? ['자유', '정보', '인원모집', '공지사항'] : ['자유', '정보', '인원모집']).map((cat) => (
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
              <CFormInput
                className="post-input"
                type='text'
                placeholder='제목 입력'
                value={title}
                onChange={(e) => {
                  const val = e.target.value;
                  // [...val]로 한글도 정확히 1글자로 카운트
                  if ([...val].length <= 50) {
                    setTitle(val);
                    setIsDirty(true);
                  }
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999' }}>
                {[...title].length}/50
              </div>
              {errors.title && <div className="error-message">{errors.title}</div>}

              <hr />
              <p className="form-section-title">본문 <span className="required-star">*</span></p>
              <ReactQuill
                ref={quillRef}
                className="post-editor"
                modules={modules}
                value={content}
                onChange={(val, delta, source, editor) => {
                  // HTML 제거 후 순수 텍스트만 추출해서 카운트 (이모티콘 대응 Array.from 사용)
                  const textOnly = editor.getText().trim();
                  const maxLength = 10000;

                  if (textOnly.length > maxLength) {
                    // 10000자 초과 시 에디터 내용을 직접 잘라냄
                    const quill = quillRef.current.getEditor();
                    quill.deleteText(maxLength, textOnly.length);
                  } else {
                    setContent(val);
                    setIsDirty(true); // 내용 변경 시 dirty 상태 활성화
                  }
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999' }}>
                {/* 실시간 순수 글자수 표시 */}
                {quillRef.current ? quillRef.current.getEditor().getText().trim().length : 0}/10000
              </div>
              {errors.content && <div className="error-message">{errors.content}</div>}
            </div>

            <hr />
            <p className="form-section-title">
              이미지 첨부 <span className="image-limit-info">최대 3장 · JPG, PNG · 각 10MB 이하</span>
            </p>

            <div className="image-upload-area">
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

            <div className="d-flex justify-content-center gap-2 mt-4">
              <CButton className="form-cancel-btn" onClick={handleLeave}>
                취소
              </CButton>
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
        alignment="center"
      >
        <CModalHeader></CModalHeader>
        <CModalBody className="text-center pt-4">
          <div className="d-inline-flex align-items-center justify-content-center mb-3 modal-warning-icon">
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