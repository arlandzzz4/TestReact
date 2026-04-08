import { useState, useRef, useEffect } from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { useFoodSearch } from '../hooks/queries/useDietQuery'

const MEAL_LABELS = { breakfast: '아침', lunch: '점심', dinner: '저녁', snack: '간식' }

export default function SearchModal({ isOpen, mealKey, onClose, onAdd }) {
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [added, setAdded] = useState([])
  const observerRef = useRef(null)

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFoodSearch(searchTerm)

  // 전체 결과 합산
  const results = data?.pages.flat() ?? []

  // 무한 스크롤 감지
  useEffect(() => {
    if (!observerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleSearch = () => {
    if (!query.trim()) return
    setSearchTerm(query.trim())
    setAdded([])
  }

  const handleAdd = (food) => {
    onAdd(mealKey, food)
    setAdded(prev => [...prev, food.foodId])
  }

  const handleClose = () => {
    setQuery('')
    setSearchTerm('')
    setAdded([])
    onClose()
  }

  return (
    <CModal visible={isOpen} onClose={handleClose} size="lg">
      <CModalHeader>
        <div className="iob-search-modal-title">
          음식 검색 <span>→ {MEAL_LABELS[mealKey]}</span>
        </div>
      </CModalHeader>
      <CModalBody>
        <div className="iob-search-input-row">
          <input
            className="iob-search-input"
            placeholder="음식 이름을 입력하세요"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="iob-search-go-btn"
            onClick={handleSearch}
            disabled={isFetching && !isFetchingNextPage}
          >
            {isFetching && !isFetchingNextPage ? '검색 중...' : '검색'}
          </button>
        </div>

        <div className="iob-search-status">
          {!searchTerm
            ? '음식 이름을 검색해보세요'
            : isFetching && !isFetchingNextPage
            ? '검색 중...'
            : `${results.length}개 결과`}
        </div>

        <div className="iob-search-results">
          {results.length === 0 && searchTerm && !isFetching ? (
            <div className="iob-search-empty">검색 결과가 없습니다</div>
          ) : (
            <>
              {results.map(food => {
                const isAdded = added.includes(food.foodId)
                return (
                  <div key={food.foodId} className="iob-search-result-item">
                    <div className="iob-result-info">
                      <div className="iob-result-name">{food.name}</div>
                      <div className="iob-result-detail">{food.unit} · {food.kcal}kcal</div>
                    </div>
                    <button
                      className={`iob-result-add-btn ${isAdded ? 'iob-added' : ''}`}
                      onClick={() => !isAdded && handleAdd(food)}
                      disabled={isAdded}
                    >
                      {isAdded ? '추가됨' : '추가'}
                    </button>
                  </div>
                )
              })}

              {/* 무한 스크롤 감지 영역 */}
              <div ref={observerRef} className="text-center py-2">
                {isFetchingNextPage && <span>불러오는 중...</span>}
                {!hasNextPage && results.length > 0 && (
                  <span className="iob-search-status">마지막 검색 결과입니다</span>
                )}
              </div>
            </>
          )}
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={handleClose}>닫기</CButton>
      </CModalFooter>
    </CModal>
  )
}