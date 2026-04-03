import { useState } from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import SearchModal from '../../components/SearchModal'
import FavMealModal from '../../components/FavMealModal'
import { useSaveDiet, useSaveWeight, useFavMeals, useDeleteFavMeal } from '../../hooks/useDiet'
import '../../scss/calendar.scss'

const MEAL_KEYS = ['breakfast', 'lunch', 'dinner', 'snack']
const MEAL_LABELS = { breakfast: '아침', lunch: '점심', dinner: '저녁', snack: '간식' }

const totalKcal = (meals) =>
  Object.values(meals).flat().reduce((s, i) => s + (parseInt(i.kcal) || 0), 0)

export default function DietDetail({ dateKey, initialData, prevWeight, userEmail, onBack }) {
  const [meals, setMeals] = useState(
    initialData?.meals ?? { breakfast: [], lunch: [], dinner: [], snack: [] }
  )
  const [weight, setWeight] = useState(initialData?.weight ?? '')
  const [searchModal, setSearchModal] = useState({ open: false, mealKey: 'breakfast' })
  const [favModalOpen, setFavModalOpen] = useState(false)
  const [mealPickModal, setMealPickModal] = useState({ open: false, favId: null })

  const { mutate: saveDiet } = useSaveDiet()
  const { mutate: saveWeight } = useSaveWeight()
  const { data: favMealsData } = useFavMeals()
  const favMeals = Array.isArray(favMealsData) ? favMealsData : []
  const { mutate: deleteFavMeal } = useDeleteFavMeal()

  const [y, m, d] = dateKey.split('-')

  const handleAddFood = (mealKey, food) => {
    setMeals(prev => ({
      ...prev,
      [mealKey]: [...prev[mealKey], { name: food.name, kcal: food.kcal }],
    }))
  }

  const handleDeleteFood = (mealKey, idx) => {
    setMeals(prev => ({
      ...prev,
      [mealKey]: prev[mealKey].filter((_, i) => i !== idx),
    }))
  }

  const handleSaveWeight = () => saveWeight({ dateKey, weight, userEmail: userEmail})

  const handleBack = () => {
    const hasMeal = Object.values(meals).some(arr => arr.length > 0)
    if (hasMeal || weight) saveDiet({ dateKey, meals, weight, userEmail: userEmail})
    onBack()
  }

  const handleFavUse = (mealKey) => {
    const fav = favMeals.find(f => f.id === mealPickModal.favId)
    if (!fav) return
    setMeals(prev => ({
      ...prev,
      [mealKey]: [...prev[mealKey], ...fav.items],
    }))
    setMealPickModal({ open: false, favId: null })
  }

  const total = totalKcal(meals)
  const mealCount = Object.values(meals).filter(a => a.length > 0).length

  const weightChange = () => {
    const cur = parseFloat(weight)
    const prev = parseFloat(prevWeight)
    if (isNaN(cur) || isNaN(prev)) return { text: '—', cls: 'same' }
    const diff = (cur - prev).toFixed(1)
    if (diff > 0) return { text: `+${diff}kg`, cls: 'up' }
    if (diff < 0) return { text: `${diff}kg`, cls: 'down' }
    return { text: '변화 없음', cls: 'same' }
  }
  const wc = weightChange()

  return (
    <div className="iob-detail-wrap">
      <div className="iob-detail-header">
        <button className="iob-back-btn" onClick={handleBack}>← 캘린더로</button>
        <div className="iob-detail-date">
          <em>{y}.</em>{String(m).padStart(2,'0')}.{String(d).padStart(2,'0')}
        </div>
      </div>

      <div className="iob-detail-body">
        {/* 끼니 그리드 */}
        <div className="iob-meal-grid">
          {MEAL_KEYS.map(key => (
            <div key={key} className="iob-meal-card">
              <div className="iob-meal-title">{MEAL_LABELS[key]}</div>
              <div className="iob-meal-items">
                {meals[key].map((item, idx) => (
                  <div key={idx} className="iob-meal-item">
                    <span className="iob-meal-item-name">{item.name}</span>
                    <span className="iob-meal-item-kcal">{item.kcal}kcal</span>
                    <button className="iob-meal-item-del" onClick={() => handleDeleteFood(key, idx)}>×</button>
                  </div>
                ))}
              </div>
              <button className="iob-meal-add-btn" onClick={() => setSearchModal({ open: true, mealKey: key })}>
                + 식단 추가
              </button>
            </div>
          ))}
        </div>

        {/* 오른쪽 패널 */}
        <div className="iob-right-panel">
          <div className="iob-stat-card">
            <div className="iob-stat-label">당일 섭취 칼로리</div>
            <div className="iob-stat-value">{total}<span>kcal</span></div>
            <div className="iob-stat-sub">{mealCount > 0 ? `${mealCount}끼 기록됨` : '아직 기록 없음'}</div>
          </div>

          <div className="iob-weight-card">
            <div className="iob-weight-label">당일 체중</div>
            <div className="iob-weight-input-row">
              <input
                className="iob-weight-input"
                type="number"
                placeholder="kg 입력"
                step="0.1"
                min="0"
                value={weight}
                onChange={e => setWeight(e.target.value)}
              />
              <button className="iob-weight-save-btn" onClick={handleSaveWeight}>저장</button>
            </div>
            <div className="iob-change-row">
              <div className="iob-change-label">전일 체중 변화</div>
              <div className={`iob-change-val ${wc.cls}`}>{wc.text}</div>
            </div>
          </div>

          {/* 즐겨 먹는 식단 */}
          <div className="iob-fav-card">
            <div className="iob-fav-card-header">
              <div className="iob-fav-card-title">즐겨 먹는 식단</div>
              <button className="iob-fav-open-btn" onClick={() => setFavModalOpen(true)}>+ 추가</button>
            </div>
            <div className="iob-fav-list">
              {favMeals.length === 0 ? (
                <div className="iob-fav-empty">저장된 식단이 없어요</div>
              ) : (
                favMeals.map(fav => (
                  <div key={fav.id} className="iob-fav-item">
                    <div className="iob-fav-item-left">
                      <div className="iob-fav-item-name">{fav.name}</div>
                      <div className="iob-fav-item-detail">
                        {fav.items.map(i => i.name).join(', ')} · 총{' '}
                        {fav.items.reduce((s, i) => s + (parseInt(i.kcal) || 0), 0)}kcal
                      </div>
                    </div>
                    <div className="iob-fav-item-right">
                      <button className="iob-fav-use-btn" onClick={() => setMealPickModal({ open: true, favId: fav.id })}>추가</button>
                      <button className="iob-fav-del-btn" onClick={() => deleteFavMeal(fav.id)}>×</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 음식 검색 모달 */}
      <SearchModal
        isOpen={searchModal.open}
        mealKey={searchModal.mealKey}
        onClose={() => setSearchModal(prev => ({ ...prev, open: false }))}
        onAdd={handleAddFood}
      />

      {/* 즐겨찾기 저장 모달 */}
      <FavMealModal isOpen={favModalOpen} onClose={() => setFavModalOpen(false)} />

      {/* 끼니 선택 모달 */}
      <CModal
        visible={mealPickModal.open}
        onClose={() => setMealPickModal({ open: false, favId: null })}
        size="sm"
      >
        <CModalHeader>
          <div className="iob-search-modal-title">어느 끼니에 추가할까요?</div>
        </CModalHeader>
        <CModalBody>
          <div className="iob-meal-select-grid">
            {MEAL_KEYS.map(key => (
              <button key={key} className="iob-meal-select-btn" onClick={() => handleFavUse(key)}>
                {MEAL_LABELS[key]}
              </button>
            ))}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setMealPickModal({ open: false, favId: null })}>
            취소
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}
