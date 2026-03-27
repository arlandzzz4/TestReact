import { useState } from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { useFoodSearch, useSaveFavMeal } from '../hooks/useDiet'

export default function FavMealModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [staged, setStaged] = useState([])  // 구성된 식단 임시 목록

  const { data: results = [], isFetching } = useFoodSearch(searchTerm)
  const { mutate: saveFavMeal } = useSaveFavMeal()

  const handleSearch = () => {
    if (!query.trim()) return
    setSearchTerm(query.trim())
  }

  const handleAddFood = (food) => {
    if (staged.some(s => s.name === food.name)) return
    setStaged(prev => [...prev, { name: food.name, kcal: food.kcal }])
  }

  const handleRemoveStaged = (idx) => {
    setStaged(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = () => {
    if (!name.trim()) { alert('식단 이름을 입력해주세요.'); return }
    if (staged.length === 0) { alert('음식을 하나 이상 추가해주세요.'); return }
    saveFavMeal({ name: name.trim(), items: staged })
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setQuery('')
    setSearchTerm('')
    setStaged([])
    onClose()
  }

  const total = staged.reduce((s, i) => s + (parseInt(i.kcal) || 0), 0)

  return (
    <CModal visible={isOpen} onClose={handleClose} size="lg">
      <CModalHeader>
        <div className="search-modal-title">즐겨 먹는 식단 추가</div>
      </CModalHeader>

      <CModalBody>
        {/* 식단 이름 입력 */}
        <div className="fav-name-row mb-3">
          <input
            className="fav-name-input"
            placeholder="식단 이름  예: 다이어트 식단"
            maxLength={20}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* 음식 검색 */}
        <div className="search-input-row mb-1">
          <input
            className="search-input"
            placeholder="음식 이름 검색"
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

        <div className="search-status mb-2">
          {!searchTerm
            ? '음식 이름을 검색해보세요'
            : isFetching
            ? '검색 중...'
            : `${results.length}개 결과`}
        </div>

        {/* 검색 결과 */}
        <div className="search-results" style={{ maxHeight: 180, overflowY: 'auto' }}>
          {results.length === 0 && searchTerm && !isFetching ? (
            <div className="search-empty">검색 결과가 없습니다</div>
          ) : (
            results.map(food => {
              const isAdded = staged.some(s => s.name === food.name)
              return (
                <div key={food.name} className="search-result-item">
                  <div className="result-info">
                    <div className="result-name">{food.name}</div>
                    <div className="result-detail">{food.unit} · {food.kcal}kcal</div>
                  </div>
                  <button
                    className={`result-add-btn ${isAdded ? 'added' : ''}`}
                    onClick={() => !isAdded && handleAddFood(food)}
                    disabled={isAdded}
                  >
                    {isAdded ? '추가됨' : '추가'}
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* 구성된 식단 */}
        <div className="fav-staged mt-2">
          <div className="fav-staged-title">구성된 식단</div>
          {staged.length === 0
            ? <div className="fav-staged-empty">추가된 음식이 없어요</div>
            : staged.map((item, idx) => (
              <div key={idx} className="fav-staged-item">
                <span>{item.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="fav-staged-kcal">{item.kcal}kcal</span>
                  <button className="fav-staged-del" onClick={() => handleRemoveStaged(idx)}>×</button>
                </div>
              </div>
            ))
          }
        </div>
      </CModalBody>

      <CModalFooter>
        <div className="fav-total-text">
          총 <strong>{total}</strong> kcal
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <CButton color="secondary" variant="outline" onClick={handleClose}>취소</CButton>
          <CButton color="primary" onClick={handleSave}>저장</CButton>
        </div>
      </CModalFooter>
    </CModal>
  )
}
