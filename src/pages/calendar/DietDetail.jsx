import { useState } from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import SearchModal from '../../components/SearchModal'
import FavMealModal from '../../components/FavMealModal'
import { useSaveDiet, useSaveWeight, useFavMeals, useDeleteFavMeal } from '../../hooks/useDiet'

const MEAL_KEYS = ['breakfast', 'lunch', 'dinner', 'snack']
const MEAL_LABELS = { breakfast: '아침', lunch: '점심', dinner: '저녁', snack: '간식' }

const totalKcal = (meals) =>
  Object.values(meals).flat().reduce((s, i) => s + (parseInt(i.kcal) || 0), 0)

export default function DietDetail({ dateKey, initialData, prevWeight, onBack }) {
  const [meals, setMeals] = useState(
    initialData?.meals ?? { breakfast: [], lunch: [], dinner: [], snack: [] }
  )
  const [weight, setWeight] = useState(initialData?.weight ?? '')
  const [searchModal, setSearchModal] = useState({ open: false, mealKey: 'breakfast' })
  const [favModalOpen, setFavModalOpen] = useState(false)
  const [mealPickModal, setMealPickModal] = useState({ open: false, favId: null })

  const { mutate: saveDiet } = useSaveDiet()
  const { mutate: saveWeight } = useSaveWeight()

  // 🔥 핵심 수정 부분
  const { data: favMealsData } = useFavMeals()
  const favMeals = favMealsData?.data || []   // 배열 보장

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

  const handleSaveWeight = () => saveWeight({ dateKey, weight })

  const handleBack = () => {
    const hasMeal = Object.values(meals).some(arr => arr.length > 0)
    if (hasMeal || weight) saveDiet({ dateKey, meals, weight })
    onBack()
  }

  const handleFavUse = (mealKey) => {
    const fav = favMeals.find(f => f.id === mealPickModal.favId)
    if (!fav) return

    setMeals(prev => ({
      ...prev,
      [mealKey]: [...prev[mealKey], ...(fav.items || [])],
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
    <div className="detail-wrap">
      <div className="detail-header">
        <button className="back-btn" onClick={handleBack}>← 캘린더로</button>
        <div className="detail-date">
          <em>{y}.</em>{String(m).padStart(2,'0')}.{String(d).padStart(2,'0')}
        </div>
      </div>

      <div className="detail-body">
        {/* 끼니 */}
        <div className="meal-grid">
          {MEAL_KEYS.map(key => (
            <div key={key} className="meal-card">
              <div className="meal-title">{MEAL_LABELS[key]}</div>

              <div className="meal-items">
                {(meals[key] || []).map((item, idx) => (
                  <div key={idx} className="meal-item">
                    <span>{item.name}</span>
                    <span>{item.kcal}kcal</span>
                    <button onClick={() => handleDeleteFood(key, idx)}>×</button>
                  </div>
                ))}
              </div>

              <button onClick={() => setSearchModal({ open: true, mealKey: key })}>
                + 식단 추가
              </button>
            </div>
          ))}
        </div>

        {/* 오른쪽 */}
        <div className="right-panel">
          <div>
            <div>당일 섭취 칼로리</div>
            <div>{total} kcal</div>
          </div>

          <div>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
            <button onClick={handleSaveWeight}>저장</button>
          </div>

          {/* 즐겨찾기 */}
          <div>
            <button onClick={() => setFavModalOpen(true)}>+ 추가</button>

            {favMeals.length === 0 ? (
              <div>없음</div>
            ) : (
              favMeals.map(fav => (
                <div key={fav.id}>
                  <div>{fav.name}</div>

                  <div>
                    {(fav.items || []).map(i => i.name).join(', ')}
                  </div>

                  <button onClick={() => setMealPickModal({ open: true, favId: fav.id })}>
                    추가
                  </button>

                  <button onClick={() => deleteFavMeal(fav.id)}>삭제</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={searchModal.open}
        mealKey={searchModal.mealKey}
        onClose={() => setSearchModal(prev => ({ ...prev, open: false }))}
        onAdd={handleAddFood}
      />

      <FavMealModal
        isOpen={favModalOpen}
        onClose={() => setFavModalOpen(false)}
      />

      <CModal visible={mealPickModal.open}>
        <CModalBody>
          {MEAL_KEYS.map(key => (
            <button key={key} onClick={() => handleFavUse(key)}>
              {MEAL_LABELS[key]}
            </button>
          ))}
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setMealPickModal({ open: false, favId: null })}>
            취소
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}