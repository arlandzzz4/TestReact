import { useState } from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { useFoodSearch } from '../hooks/useDiet'

const MEAL_LABELS = { breakfast: '아침', lunch: '점심', dinner: '저녁', snack: '간식' }

export default function SearchModal({ isOpen, mealKey, onClose, onAdd }) {
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [added, setAdded] = useState([])

  const { data: results = [], isFetching } = useFoodSearch(searchTerm)

  const handleSearch = () => {
    if (!query.trim()) return
    setSearchTerm(query.trim())
    setAdded([])
  }

  const handleAdd = (food) => {
    onAdd(mealKey, food)
    setAdded(prev => [...prev, food.name])
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
        <div className="search-modal-title">
          음식 검색 <span>→ {MEAL_LABELS[mealKey]}</span>
        </div>
      </CModalHeader>
      <CModalBody>
        <div className="search-input-row mb-2">
          <input
            className="search-input"
            placeholder="음식 이름을 입력하세요"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="search-go-btn"
            onClick={handleSearch}
            disabled={isFetching}
          >
            {isFetching ? '검색 중...' : '검색'}
          </button>
        </div>

        <div className="search-status">
          {!searchTerm
            ? '음식 이름을 검색해보세요'
            : isFetching
            ? '검색 중...'
            : `${results.length}개 결과`}
        </div>

        <div className="search-results">
          {results.length === 0 && searchTerm && !isFetching ? (
            <div className="search-empty">검색 결과가 없습니다</div>
          ) : (
            results.map((food) => {
              const isAdded = added.includes(food.name)
              return (
                <div key={food.name} className="search-result-item">
                  <div className="result-info">
                    <div className="result-name">{food.name}</div>
                    <div className="result-detail">{food.unit} · {food.kcal}kcal</div>
                  </div>
                  <button
                    className={`result-add-btn ${isAdded ? 'added' : ''}`}
                    onClick={() => !isAdded && handleAdd(food)}
                    disabled={isAdded}
                  >
                    {isAdded ? '추가됨' : '추가'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={handleClose}>닫기</CButton>
      </CModalFooter>
    </CModal>
  )
}
