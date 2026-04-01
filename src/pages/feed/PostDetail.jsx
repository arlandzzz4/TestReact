// feed/PostDetail.jsx
// 게시글 상세 나타나는 공간
// =====================================================
// 📌 [파일 1] 개발 테스트용 - 로그인 기능 완성 전까지 사용
// isLoggedIn = false → 로그인 전 화면 테스트
// isLoggedIn = true  → 로그인 후 화면 테스트
// =====================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ [2번] 라우터 이동용
import '../../scss/community.scss';

const CATEGORY_MAP = {
  '01': { label: '자유',     bg: '#F0E6D3', color: '#B07D3A' },
  '02': { label: '정보',     bg: '#D3E8DF', color: '#2E6B4F' },
  '03': { label: '인원모집', bg: '#D9E4F5', color: '#2D4FA0' },
  '04': { label: '공지사항', bg: '#F5D6DA', color: '#8B2C3A' },
};

const DUMMY_POST = {
  id: 1,
  title: '오늘 첫 헬스 등록했습니다 💪',
  content: `드디어 헬스장 등록했습니다! 3개월 목표로 열심히 해보려고요.\n같이 운동하시는 분들 팁 공유해주시면 감사하겠습니다.\n처음이라 뭐부터 시작해야 할지 잘 모르겠네요ㅠ`,
  author: '홍길동',
  date: '2026.03.10 16:42',
  category: '01',
  likes: 13,
  isMine: true,
};

const DUMMY_COMMENTS = [
  {
    id: 1,
    author: '홍길동',
    date: '2026.03.10 16:42',
    content: '댓글 댓글댓글댓글댓글 댓글댓글댓글댓글댓글댓글댓글.\n댓글댓글 댓글댓글댓글댓글댓글댓글.',
    likes: 2,
    isLiked: false,
    isMine: false,
    replies: [
      {
        id: 11,
        author: '홍길동',
        date: '2026.03.10 16:42',
        content: '댓글 댓글댓글댓글댓글 댓글댓글댓글댓글댓글.',
        likes: 0,
        isLiked: false,
        isMine: true,
      },
    ],
  },
];

// ✅ 여기서 false ↔ true 바꿔서 테스트
const isLoggedIn = true;       // 로그인 전: false / 로그인 후: true
const currentUser = '홍길동';   // 나중에 user?.nickname으로 교체

// ✅ [8번] 시간:분 까지만 포맷하는 함수
const formatDate = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const hh   = String(now.getHours()).padStart(2, '0');
  const min  = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
};

const PostDetail = () => {
  const navigate = useNavigate(); // ✅ [2번, 6번] 라우터 이동용
  
  const [post, setPost] = useState(DUMMY_POST);
  const [postLiked, setPostLiked] = useState(false);
  const [comments, setComments] = useState(DUMMY_COMMENTS);
  const [commentInput, setCommentInput] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  const category = CATEGORY_MAP[post.category] || { label: post.category, bg: '#eee', color: '#333' };

  const requireLogin = () => {
    alert('로그인 후 이용해주세요.');
    navigate('/login'); // ✅ [2번] 로그인 페이지로 이동
  };

  const handlePostLike = () => {
    if (!isLoggedIn) { requireLogin(); return; }
    setPostLiked(!postLiked);
    setPost(prev => ({ ...prev, likes: postLiked ? prev.likes - 1 : prev.likes + 1 }));
  };

  const handleCommentLike = (commentId) => {
    if (!isLoggedIn) { requireLogin(); return; }
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked }
        : c
    ));
  };

  const handleReplyLike = (commentId, replyId) => {
    if (!isLoggedIn) { requireLogin(); return; }
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? {
            ...c,
            replies: c.replies.map(r =>
              r.id === replyId
                ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked }
                : r
            ),
          }
        : c
    ));
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) { requireLogin(); return; }
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now(),
      author: currentUser,
      date: formatDate(),
      content: commentInput,
      likes: 0,
      isLiked: false,
      isMine: true,
      replies: [],
    };
    setComments(prev => [...prev, newComment]);
    setCommentInput('');
  };

  const handleCommentDelete = (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) return;
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleReplySubmit = (commentId) => {
    if (!isLoggedIn) { requireLogin(); return; }
    const text = replyInputs[commentId];
    if (!text?.trim()) return;
    const newReply = {
      id: Date.now(),
      author: currentUser,
      date: formatDate(),
      content: text,
      likes: 0,
      isLiked: false,
      isMine: true,
    };
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
    ));
    setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
    setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
  };

  const totalCommentCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  const toggleDropdown = (key) => {
    setOpenDropdown(prev => prev === key ? null : key);
  };

  const openReport = (target) => {
    if (!isLoggedIn) { requireLogin(); return; }
    setReportTarget(target);
    setShowReportModal(true);
    setOpenDropdown(null);
  };

  const handleReport = () => {
    const msg =
      reportTarget === 'post'    ? '게시글이 신고되었습니다.' :
      reportTarget === 'comment' ? '댓글이 신고되었습니다.'   :
                                   '대댓글이 신고되었습니다.';
    alert(msg);
    setShowReportModal(false);
  };

  return (
    <div className="post-detail-wrap" onClick={() => setOpenDropdown(null)}>

      {/* 게시글 본문 */}
      <div className="post-detail-card">
        <div className="post-detail-tag-row">
          <span className="post-detail-category" style={{ backgroundColor: category.bg, color: category.color }}>
            {category.label}
          </span>
        </div>

        <h2 className="post-detail-title">{post.title}</h2>

        <div className="post-detail-author-row">
          <div className="author-avatar">{post.author[0]}</div>
          <div>
            <div className="author-name">{post.author}</div>
            <div className="author-date">{post.date}</div>
          </div>
          <div className="post-detail-author-actions">
            <div className="comment-menu-wrap" onClick={e => e.stopPropagation()}>
              <span className="comment-menu-dot" onClick={() => toggleDropdown('post')}>⋮</span>
              {openDropdown === 'post' && (
                <div className="comment-dropdown" style={{ display: 'block' }}>
                  {post.isMine ? (
                    <>
                      <button onClick={() => { setOpenDropdown(null); navigate(`/post/edit/${post.id}`); }}>글 수정</button>
                      <button onClick={() => { setOpenDropdown(null); window.confirm('게시글을 삭제할까요?') && alert('삭제되었습니다.'); }}>글 삭제</button>
                    </>
                  ) : (
                    <button onClick={() => openReport('post')}>글 신고</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="post-detail-content">{post.content}</div>

        <div className="post-detail-reaction">
          <button className={`pd-like-btn ${postLiked ? 'liked' : ''}`} onClick={handlePostLike}>
            {postLiked ? '💚' : '🤍'} 좋아요 · {post.likes}
          </button>
          <span className="pd-comment-stat">💬 댓글 · {totalCommentCount}</span>
        </div>
      </div>

      {/* 댓글 영역 */}
      <div className="post-detail-card comment-section">
        <h4 className="comment-section-title">댓글 {totalCommentCount}</h4>

        {/* ✅ 로그인한 유저만 댓글 입력창 보임 */}
        {isLoggedIn && (
          <div className="comment-input-wrap">
            <div className="author-avatar">{currentUser[0]}</div>
            <div className="comment-input-inner">
              <textarea
                className="comment-textarea"
                placeholder="댓글을 입력하세요"
                value={commentInput}
                maxLength={500}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCommentSubmit(); }
                }}
              />
              <div className="comment-input-footer">
                <span className="comment-char-count">{commentInput.length}/500</span>
                <button className="pd-submit-btn" onClick={handleCommentSubmit}>댓글등록</button>
              </div>
            </div>
          </div>
        )}

        {/* 댓글 목록 */}
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="author-avatar">{comment.author[0]}</div>
            <div className="comment-body">
              <div className="comment-meta-row">
                <span className="author-name">{comment.author}</span>
                <span className="author-date">{comment.date}</span>
                <div className="comment-menu-wrap" onClick={e => e.stopPropagation()}>
                  <span className="comment-menu-dot" onClick={() => toggleDropdown(`comment-${comment.id}`)}>⋯</span>
                  {openDropdown === `comment-${comment.id}` && (
                    <div className="comment-dropdown" style={{ display: 'block' }}>
                      {comment.isMine ? (
                        <button onClick={() => { setOpenDropdown(null); handleCommentDelete(comment.id); }}>댓글 삭제</button>
                      ) : (
                        <button style={{width: '89px'}} onClick={() => openReport('comment')}>댓글 신고</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="comment-content">{comment.content}</p>
              <div className="comment-actions">
                <button
                  className={`pd-like-btn sm ${comment.isLiked ? 'liked' : ''}`}
                  onClick={() => handleCommentLike(comment.id)}
                >
                  {comment.isLiked ? '💚' : '🤍'} {comment.likes}
                </button>
                <button className="pd-reply-btn"
                  onClick={() => setShowReplyInput(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}>
                  ⤶ 댓글 달기
                </button>
              </div>

              {comment.replies.length > 0 && (
                <div className="reply-list">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="reply-item">
                      <div className="author-avatar sm">{reply.author[0]}</div>
                      <div className="comment-body">
                        <div className="comment-meta-row">
                          <span className="author-name">{reply.author}</span>
                          <span className="author-date">{reply.date}</span>
                          <div className="comment-menu-wrap" onClick={e => e.stopPropagation()}>
                            <span className="comment-menu-dot" onClick={() => toggleDropdown(`reply-${reply.id}`)}>⋯</span>
                            {openDropdown === `reply-${reply.id}` && (
                              <div className="comment-dropdown" style={{ display: 'block' }}>
                                {reply.isMine ? (
                                    <button style={{width: '89px'}} onClick={() => {
                                        setOpenDropdown(null);
                                        if (window.confirm('댓글을 삭제할까요?')) {
                                            setComments(prev => prev.map(c =>
                                                c.id === comment.id
                                                    ? { ...c, replies: c.replies.filter(r => r.id !== reply.id) }
                                                    : c
                                            ));
                                            alert('댓글이 삭제되었습니다.');
                                        }
                                        }}>댓글 삭제
                                    </button>
                                ) : (
                                  <button onClick={() => openReport('reply')}>댓글 신고</button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="comment-content">{reply.content}</p>
                        <div className="comment-actions">
                          <button
                            className={`pd-like-btn sm ${reply.isLiked ? 'liked' : ''}`}
                            onClick={() => handleReplyLike(comment.id, reply.id)}
                          >
                            {reply.isLiked ? '💚' : '🤍'} {reply.likes}
                          </button>
                          <button className="pd-reply-btn"
                            onClick={() => setShowReplyInput(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}>
                            ⤶ 댓글 달기
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showReplyInput[comment.id] && (
                <div className="reply-input-wrap">
                  <textarea
                    className="comment-textarea sm"
                    placeholder="답글을 입력하세요"
                    value={replyInputs[comment.id] || ''}
                    onChange={e => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplySubmit(comment.id); }
                    }}
                  />
                  <button className="pd-submit-btn sm" onClick={() => handleReplySubmit(comment.id)}>등록</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 신고 모달 */}
      {showReportModal && (
        <div className="pd-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="pd-modal" onClick={e => e.stopPropagation()}>
            <h5 className="pd-modal-title">신고 사유를 선택해주세요</h5>
            {['스팸/광고', '욕설/혐오', '음란물', '개인정보 노출', '기타'].map(reason => (
              <label key={reason} className="pd-report-option">
                <input type="radio" name="report" value={reason} /> {reason}
              </label>
            ))}
            <div className="pd-modal-btns">
              <button className="pd-submit-btn" onClick={handleReport}>신고하기</button>
              <button className="pd-cancel-btn" onClick={() => setShowReportModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
