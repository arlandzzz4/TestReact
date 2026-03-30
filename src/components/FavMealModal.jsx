import { useState } from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { useFoodSearch, useSaveFavMeal } from '../hooks/useDiet'

export default function FavMealModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [staged, setStaged] = useState([])

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
        <div className="iob-search-modal-title">즐겨 먹는 식단 추가</div>
      </CModalHeader>

      <CModalBody>
        {/* 식단 이름 입력 */}
        <input
          className="iob-fav-name-input"
          placeholder="식단 이름  예: 다이어트 식단"
          maxLength={20}
          value={name}
          onChange={e => setName(e.target.value)}
        />

        {/* 음식 검색 */}
        <div className="iob-search-input-row">
          <input
            className="iob-search-input"
            placeholder="음식 이름 검색"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="iob-search-go-btn"
            onClick={handleSearch}
            disabled={isFetching}
          >
            {isFetching ? '검색 중...' : '검색'}
          </button>
        </div>

        <div className="iob-search-status">
          {!searchTerm
            ? '음식 이름을 검색해보세요'
            : isFetching
            ? '검색 중...'
            : `${results.length}개 결과`}
        </div>

        {/* 검색 결과 */}
        <div className="iob-search-results" style={{ maxHeight: 160 }}>
          {results.length === 0 && searchTerm && !isFetching ? (
            <div className="iob-search-empty">검색 결과가 없습니다</div>
          ) : (
            results.map(food => {
              const isAdded = staged.some(s => s.name === food.name)
              return (
                <div key={food.name} className="iob-search-result-item">
                  <div className="iob-result-info">
                    <div className="iob-result-name">{food.name}</div>
                    <div className="iob-result-detail">{food.unit} · {food.kcal}kcal</div>
                  </div>
                  <button
                    className={`iob-result-add-btn ${isAdded ? 'iob-added' : ''}`}
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
        <div className="iob-fav-staged">
          <div className="iob-fav-staged-title">구성된 식단</div>
          {staged.length === 0 ? (
            <div className="iob-fav-staged-empty">추가된 음식이 없어요</div>
          ) : (
            staged.map((item, idx) => (
              <div key={idx} className="iob-fav-staged-item">
                <span>{item.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="iob-fav-staged-kcal">{item.kcal}kcal</span>
                  <button className="iob-fav-staged-del" onClick={() => handleRemoveStaged(idx)}>×</button>
                </div>
              </div>
            ))
          )}
        </div>
      </CModalBody>

      <CModalFooter>
        <div className="iob-fav-total-text">
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
