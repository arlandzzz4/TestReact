// feed/PostDetail.jsx
// 게시글 상세 나타나는 공간
// =====================================================
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../scss/community.scss';
import { getPostDetail, getCommentList, insertComment, deleteComment, deletePost, togglePostLike, toggleCommentLike, insertReport } from '../../api/postApi';
import { useAuth } from '@/hooks/useAuth';
import 'react-quill/dist/quill.snow.css';

const CATEGORY_MAP = {
  '01': { label: '자유', bg: '#F0E6D3', color: '#B07D3A' },
  '02': { label: '정보', bg: '#D3E8DF', color: '#2E6B4F' },
  '03': { label: '인원모집', bg: '#D9E4F5', color: '#2D4FA0' },
  '04': { label: '공지사항', bg: '#F7E6EA', color: '#A63A50' },
};

const PostDetail = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const userEmail = user?.email || "";

  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [postLiked, setPostLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState('');
  const [reportTargetId, setReportTargetId] = useState(null);
  const [selectedReason, setSelectedReason] = useState('01');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [clickImg, setClickImg] = useState(null);


  useEffect(() => {
    if (userEmail === "" && isLoggedIn) return; // 로그인했는데 email이 아직 없으면 기다림

    getPostDetail(id, userEmail)
      .then(res => {
        setPost(res.data);
        setPostLiked(res.data.liked);
      })
      .catch(err => console.error('게시글 조회 실패', err));

    getCommentList(id, userEmail)
      .then(res => {
        const allComments = res.data;
        const parentComments = allComments.filter(c => !c.parentCommentId);
        const replies = allComments.filter(c => c.parentCommentId);
        const merged = parentComments.map(c => ({
          ...c,
          replies: replies.filter(r => r.parentCommentId === c.commentId)
        }));
        setComments(merged);
      })
      .catch(err => console.error('댓글 조회 실패', err));
  }, [id, userEmail]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
  };

  if (!post) return <div>로딩 중...</div>;

  const category = CATEGORY_MAP[post.categoryCode] || { label: post.categoryCode, bg: '#eee', color: '#333' };

  const requireLogin = () => {
    alert('로그인 후 이용해주세요.');
    navigate('/login');
  };

  const handlePostLike = () => {
    if (!isLoggedIn) { requireLogin(); return; }
    togglePostLike(post.postId, userEmail)
      .then(res => {
        const liked = res.data;
        setPostLiked(liked);
        setPost(prev => ({ ...prev, likeCount: liked ? prev.likeCount + 1 : prev.likeCount - 1 }));
      })
      .catch(err => console.error('좋아요 실패', err));
  };

  const handleCommentLike = (commentId) => {
    if (!isLoggedIn) { requireLogin(); return; }
    toggleCommentLike(commentId, userEmail)
      .then(res => {
        const liked = res.data;
        setComments(prev => prev.map(c =>
          c.commentId === commentId
            ? { ...c, likeCount: liked ? c.likeCount + 1 : c.likeCount - 1, isLiked: liked }
            : c
        ));
      })
      .catch(err => console.error('댓글 좋아요 실패', err));
  };

  const handleReplyLike = (commentId, replyId) => {
    if (!isLoggedIn) { requireLogin(); return; }
    toggleCommentLike(replyId, userEmail)
      .then(res => {
        const liked = res.data;
        setComments(prev => prev.map(c =>
          c.commentId === commentId
            ? {
              ...c,
              replies: c.replies.map(r =>
                r.commentId === replyId
                  ? { ...r, likeCount: liked ? r.likeCount + 1 : r.likeCount - 1, isLiked: liked }
                  : r
              ),
            }
            : c
        ));
      })
      .catch(err => console.error('대댓글 좋아요 실패', err));
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) { requireLogin(); return; }
    if (!commentInput.trim()) return;
    insertComment({
      commentId: null,
      postId: post.postId,
      userEmail: userEmail,
      parent_comment_id: null,
      content: commentInput,
      createdAt: null,
      updatedAt: null,
      deleteAt: null,
      delYn: 'N',
      lastId: 0,
      size: 10,
    })
      .then(() => {
        return getCommentList(id, userEmail);
      })
      .then(res => {
        const allComments = res.data;
        const parentComments = allComments.filter(c => !c.parentCommentId);
        const replies = allComments.filter(c => c.parentCommentId);
        const merged = parentComments.map(c => ({
          ...c,
          replies: replies.filter(r => r.parentCommentId === c.commentId)
        }));
        setComments(merged);
        setCommentInput('');
      })
      .catch(err => console.error('댓글 등록 실패', err));
  };

  const handleCommentDelete = (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) return;
    deleteComment(commentId)
      .then(() => {
        return getCommentList(id, userEmail);
      })
      .then(res => {
        const allComments = res.data;
        const parentComments = allComments.filter(c => !c.parentCommentId);
        const replies = allComments.filter(c => c.parentCommentId);
        const merged = parentComments.map(c => ({
          ...c,
          replies: replies.filter(r => r.parentCommentId === c.commentId)
        }));
        setComments(merged);
      })
      .catch(err => console.error('댓글 삭제 실패', err));
  };

  const handleReplySubmit = (commentId) => {
    if (!isLoggedIn) { requireLogin(); return; }
    const text = replyInputs[commentId];
    if (!text?.trim()) return;
    insertComment({
      commentId: null,
      postId: post.postId,
      userEmail: userEmail,
      parent_comment_id: commentId,
      content: text,
      createdAt: null,
      updatedAt: null,
      deleteAt: null,
      delYn: 'N',
      lastId: 0,
      size: 10,
    })
      .then(() => {
        return getCommentList(id, userEmail);
      })
      .then(res => {
        const allComments = res.data;
        const parentComments = allComments.filter(c => !c.parentCommentId);
        const replies = allComments.filter(c => c.parentCommentId);
        const merged = parentComments.map(c => ({
          ...c,
          replies: replies.filter(r => r.parentCommentId === c.commentId)
        }));
        setComments(merged);
        setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
        setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
      })
      .catch(err => console.error('대댓글 등록 실패', err));
  };

  const totalCommentCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0);

  const toggleDropdown = (key) => {
    setOpenDropdown(prev => prev === key ? null : key);
  };

  const openReport = (target, targetId) => {
    if (!isLoggedIn) { requireLogin(); return; }
    setReportTarget(target);
    setReportTargetId(targetId);
    setShowReportModal(true);
    setOpenDropdown(null);
  };

  const handleReport = (reasonCode) => {
    const targetCode = reportTarget === 'post' ? '01' : '02';
    const targetId = reportTarget === 'post' ? post.postId : reportTargetId;

    insertReport(targetCode, targetId, userEmail, reasonCode)
      .then(() => {
        const msg =
          reportTarget === 'post' ? '게시글이 신고되었습니다.' :
            reportTarget === 'comment' ? '댓글이 신고되었습니다.' :
              '대댓글이 신고되었습니다.';
        alert(msg);
        setShowReportModal(false);
      })
      .catch(err => console.error('신고 실패', err));
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
          <div className="author-avatar">{post.nickname[0]}</div>
          <div>
            <div className="author-name">{post.nickname}</div>
            <div className="author-date">{formatDate(post.createdAt)}</div>
          </div>
          <div className="post-detail-author-actions">
            <div className="comment-menu-wrap" onClick={e => e.stopPropagation()}>
              <span className="comment-menu-dot" onClick={() => toggleDropdown('post')}>⋮</span>
              {openDropdown === 'post' && (
                <div className="comment-dropdown" style={{ display: 'block' }}>
                  {post.userEmail === userEmail ? (
                    <>
                      <button onClick={() => { setOpenDropdown(null); navigate(`/post/edit/${post.postId}`); }}>글 수정</button>
                      <button onClick={() => {
                        setOpenDropdown(null);
                        if (!post?.postId) { alert('게시글 정보를 불러오는 중입니다.'); return; }
                        if (window.confirm('게시글을 삭제할까요?')) {
                          console.log('postId:', post.postId, 'userEmail:', userEmail);
                          deletePost({ postId: post.postId, userEmail, delYn: 'Y' })
                            .then(() => {
                              alert('삭제되었습니다.');
                              navigate('/feed');
                            })
                            .catch(err => {
                              console.error('삭제 실패', err);
                              alert('삭제에 실패했습니다.');
                            });
                        }
                      }}>글 삭제</button>
                    </>
                  ) : (
                    <button onClick={() => openReport('post', post.postId)}>게시글 신고</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="post-detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="post-detail-images">
            {post.imageUrls.map((url, index) => (
              <img
                onClick={()=>{setClickImg(url)}}
                key={index}
                src={url.startsWith('http')? url : `http://localhost:8080${url}`}
                //src={`http://localhost:8080${url}`} //이거 s3일때를 대비해서 img/어쩌구로 오면 앞에 localhost 붙여주고, 아니면 그냥쓰게끔해야함
                alt={`첨부 이미지 ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', marginBottom: '8px', display: 'block' }}
              />
            ))}
          {/* 사진 크기 맞추고, 클릭하면 커지는형식 */}
          </div>
        )}

        {/* 모달 */}
        {clickImg && (
          <div
            onClick={() => setClickImg(null)}
            style={{
              position: 'fixed', top: 0, left: 0,
              width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 9999
            }}
          >
            <img
              src={clickImg.startsWith('http')? clickImg : `http://localhost:8080${clickImg}`}
              //src={`http://localhost:8080${clickImg}`} ////이거 s3일때를 대비해서 img/어쩌구로 오면 앞에 localhost 붙여주고, 아니면 그냥쓰게끔해야함
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
            />
          </div>
        )}

        <div className="post-detail-reaction">
          <button className={`pd-like-btn ${postLiked ? 'liked' : ''}`} onClick={handlePostLike}>
            {postLiked ? '💚' : '🤍'} 좋아요 · {post.likeCount}
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
            <div className="author-avatar">{user?.nickname?.[0] || '?'}</div>
            <div className="comment-input-inner">
              <textarea
                className="comment-textarea"
                placeholder="댓글을 입력하세요"
                value={commentInput}
                onChange={e => {
                  const val = e.target.value;
                  // [...val]로 한글도 정확히 1글자로 카운트
                  if ([...val].length <= 500) {
                    setCommentInput(val);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCommentSubmit(); }
                }}
              />
              <div className="comment-input-footer">
                <span className="comment-char-count">{[...commentInput].length}/500</span>
                <button className="pd-submit-btn" onClick={handleCommentSubmit}>댓글등록</button>
              </div>
            </div>
          </div>
        )}

        {/* 댓글 목록 */}
        {comments.map(comment => (
          <div key={comment.commentId} className="comment-item">
            <div className="author-avatar">{comment.nickname[0]}</div>
            <div className="comment-body">
              <div className="comment-meta-row">
                <span className="author-name">{comment.nickname}</span>
                <span className="author-date">{formatDate(comment.createdAt)}</span>
                <div className="comment-menu-wrap" onClick={e => e.stopPropagation()}>
                  <span className="comment-menu-dot" onClick={() => toggleDropdown(`comment-${comment.commentId}`)}>⋯</span>
                  {openDropdown === `comment-${comment.commentId}` && (
                    <div className="comment-dropdown" style={{ display: 'block' }}>
                      {comment.userEmail === userEmail ? (
                        <button onClick={() => { setOpenDropdown(null); handleCommentDelete(comment.commentId); }}>댓글 삭제</button>
                      ) : (
                        <button style={{ width: '89px' }} onClick={() => openReport('comment', comment.commentId)}>댓글 신고</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="comment-content">{comment.content}</p>
              <div className="comment-actions">
                <button
                  className={`pd-like-btn sm ${comment.isLiked ? 'liked' : ''}`}
                  onClick={() => handleCommentLike(comment.commentId)}>
                  {comment.isLiked ? '💚' : '🤍'} {comment.likeCount}
                </button>
                <button className="pd-reply-btn" onClick={() => setShowReplyInput(prev => ({ ...prev, [comment.commentId]: !prev[comment.commentId] }))}>
                  ⤶ 댓글 달기
                </button>
              </div>

              {(comment.replies?.length ?? 0) > 0 && (
                <div className="reply-list">
                  {comment.replies.map(reply => (
                    <div key={reply.commentId} className="reply-item">
                      <div className="author-avatar sm">{reply.nickname[0]}</div>
                      <div className="comment-body">
                        <div className="comment-meta-row">
                          <span className="author-name">{reply.nickname}</span>
                          <span className="author-date">{formatDate(reply.createdAt)}</span>
                          <div className="comment-menu-wrap" onClick={e => e.stopPropagation()}>
                            <span className="comment-menu-dot" onClick={() => toggleDropdown(`reply-${reply.commentId}`)}>⋯</span>
                            {openDropdown === `reply-${reply.commentId}` && (
                              <div className="comment-dropdown" style={{ display: 'block' }}>
                                {reply.userEmail === userEmail ? (
                                  <button style={{ width: '89px' }} onClick={() => {
                                    setOpenDropdown(null);
                                    if (window.confirm('댓글을 삭제할까요?')) {
                                      deleteComment(reply.commentId)
                                        .then(() => {
                                          return getCommentList(id, userEmail);
                                        })
                                        .then(res => {
                                          const allComments = res.data;
                                          const parentComments = allComments.filter(c => !c.parentCommentId);
                                          const replies = allComments.filter(c => c.parentCommentId);
                                          const merged = parentComments.map(c => ({
                                            ...c,
                                            replies: replies.filter(r => r.parentCommentId === c.commentId)
                                          }));
                                          setComments(merged);
                                          alert('댓글이 삭제되었습니다.');
                                        })
                                        .catch(err => console.error('대댓글 삭제 실패', err));
                                    }
                                  }}>댓글 삭제
                                  </button>
                                ) : (
                                  <button onClick={() => openReport('reply', reply.commentId)}>댓글 신고</button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="comment-content">{reply.content}</p>
                        <div className="comment-actions">
                          <button
                            className={`pd-like-btn sm ${reply.isLiked ? 'liked' : ''}`}
                            onClick={() => handleReplyLike(comment.commentId, reply.commentId)}
                          >
                            {reply.isLiked ? '💚' : '🤍'} {reply.likeCount}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showReplyInput[comment.commentId] && (
                <div className="reply-input-wrap">
                  <textarea
                    className="comment-textarea sm"
                    placeholder="답글을 입력하세요"
                    value={replyInputs[comment.commentId] || ''}
                    onChange={e => {
                      const val = e.target.value;
                      // [...val]로 한글도 정확히 1글자로 카운트
                      if ([...val].length <= 500) {
                        setReplyInputs(prev => ({ ...prev, [comment.commentId]: val }));
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplySubmit(comment.commentId); }
                    }}
                  />
                  <div className="comment-input-footer">
                    <button className="pd-submit-btn sm " onClick={() => handleReplySubmit(comment.commentId)}>등록</button>
                    <span className="comment-char-count">{[...(replyInputs[comment.commentId] || '')].length}/500</span>
                  </div>
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
            {[
              { code: '01', label: '스팸/광고' },
              { code: '02', label: '욕설/혐오' },
              { code: '03', label: '음란물' },
              { code: '04', label: '허위정보' },
              { code: '05', label: '기타' },
            ].map(reason => (
              <label key={reason.code} className="pd-report-option">
                <input type="radio" name="report" value={reason.code}
                  onChange={() => setSelectedReason(reason.code)} /> {reason.label}
              </label>
            ))}
            <div className="pd-modal-btns">
              <button className="pd-submit-btn" onClick={() => handleReport(selectedReason)}>신고하기</button>
              <button className="pd-cancel-btn" onClick={() => setShowReportModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
