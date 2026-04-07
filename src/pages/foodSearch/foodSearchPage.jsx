// src/pages/foodSearch/foodSearchPage.jsx
// - DefaultLayout 안에서 렌더링 → AppHeader/AppSidebar 별도 추가 불필요
// - 로그인 여부 무관하게 접근 가능 (AuthGuard 밖에 위치)

import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchFood } from '../../api/diet'
import {
  CContainer,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

// ── API 호출 ───────────────────────────────────────────────
// GET /api/calendar/food/search?q=검색어
const fetchFoods = (keyword) => searchFood(keyword)


// ── 영양정보 상세 패널 ─────────────────────────────────────
const NutritionDetail = ({ food, amount, onAmountChange }) => {
  // servingSize 기준으로 비율 계산 (없으면 100g 기준)
  const base = food.servingSize ? Number(food.servingSize) : 100
  const ratio = amount / base
  const calc = (val) => (val != null ? (Number(val) * ratio).toFixed(1) : '-')

  return (
    <CCard className="border-0 shadow-sm">
      <CCardBody className="p-4">
        {/* 음식명 */}
        <h5 className="fw-bold mb-0">{food.name}</h5>
        <small className="text-medium-emphasis">공공데이터 식품영양성분 DB</small>

        <hr />

        {/* 섭취량 입력 */}
        <CRow className="align-items-center mb-3">
          <CCol>
            <span className="text-medium-emphasis">섭취량</span>
          </CCol>
          <CCol xs="auto">
            <CInputGroup style={{ width: 140 }}>
              <CFormInput
                type="number"
                min={1}
                value={amount}
                onChange={(e) => onAmountChange(Number(e.target.value))}
                className="text-end fw-semibold"
              />
              <span className="input-group-text bg-body-secondary">g</span>
            </CInputGroup>
          </CCol>
        </CRow>

        {/* 칼로리 */}
        <div className="mb-3">
          <span
            className="d-block fw-bold"
            style={{ fontSize: '2.4rem', color: '#2d6a4f' }}
          >
            {calc(food.kcal)}
          </span>
          <small className="text-medium-emphasis">
            kcal · {amount}g 기준
          </small>
        </div>

        {/* 3대 영양소 */}
        <CRow className="g-2 mb-2">
          {[
            { label: '단백질', key: 'protein' },
            { label: '탄수화물', key: 'carbs' },
            { label: '지방', key: 'fat' },
          ].map(({ label, key }) => (
            <CCol key={key} xs={4}>
              <div
                className="text-center p-2 rounded"
                style={{ background: '#f5f5f0' }}
              >
                <div className="text-medium-emphasis" style={{ fontSize: '0.72rem' }}>
                  {label}
                </div>
                <div className="fw-bold" style={{ fontSize: '1.1rem' }}>
                  {calc(food[key])}
                </div>
                <div className="text-medium-emphasis" style={{ fontSize: '0.72rem' }}>
                  g
                </div>
              </div>
            </CCol>
          ))}
        </CRow>

        {/* 1회 제공량 */}
        <CRow className="py-2 border-top align-items-center">
          <CCol><span className="text-medium-emphasis">1회 제공량</span></CCol>
          <CCol xs="auto">
            <span className="fw-semibold">{food.unit}</span>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

// ── 메인 페이지 ────────────────────────────────────────────
const FoodSearchPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [amount, setAmount] = useState(100)

  const { data: foods = [], isFetching, isError } = useQuery({
    queryKey: ['foodSearch', keyword],
    queryFn: () => fetchFoods(keyword),
    enabled: keyword.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  })

  const handleSearch = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setKeyword(trimmed)
    setSelectedFood(null)
    setAmount(100)
  }, [inputValue])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleSelect = (food) => {
    setSelectedFood(food)
    // 선택한 음식의 1회 제공량(servingSize)으로 초기값 설정
    setAmount(food.servingSize ? Number(food.servingSize) : 100)
  }

  return (
    <CContainer fluid className="px-4 py-4">
      {/* 페이지 헤더 */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">음식 영양성분 검색</h2>
        <p className="text-medium-emphasis">
          공공데이터 식품영양성분 DB에서 음식을 검색하고 영양 정보를 확인하세요
        </p>
      </div>

      {/* 검색창 */}
      <CInputGroup className="mb-4" style={{ maxWidth: 860 }}>
        <CFormInput
          placeholder="음식명을 입력하세요   예) 닭 · 현미밥 · 고구마"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          size="lg"
        />
        <CButton
          color="secondary"
          onClick={handleSearch}
          disabled={isFetching}
          style={{ minWidth: 80 }}
        >
          {isFetching
            ? <CSpinner size="sm" />
            : <><CIcon icon={cilSearch} /> 검색</>
          }
        </CButton>
      </CInputGroup>

      {/* 에러 */}
      {isError && (
        <CAlert color="danger" className="mb-4">
          검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </CAlert>
      )}

      {/* 검색 전 초기 화면 */}
      {!keyword && (
        <div className="text-center py-5 text-medium-emphasis">
          <div style={{ fontSize: '3rem' }}>🥗</div>
          <p className="mt-3 mb-1">음식명을 검색하면 영양성분 정보가 표시됩니다</p>
          <small>예) 닭 · 현미밥 · 고구마 · 계란</small>
        </div>
      )}

      {/* 검색 결과 */}
      {keyword && !isFetching && !isError && (
        <CRow className="g-3">
          {/* 좌측: 결과 목록 */}
          <CCol xs={12} md={5} lg={4}>
            <CCard className="border-0 shadow-sm">
              <CCardBody className="p-0">
                <div className="d-flex justify-content-between px-3 py-2 border-bottom">
                  <small className="text-medium-emphasis fw-semibold">검색 결과</small>
                  <small className="text-medium-emphasis">{foods.length}건</small>
                </div>

                {foods.length === 0 ? (
                  <div className="text-center py-5 text-medium-emphasis">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  <CListGroup flush>
                    {foods.map((food) => {
                      const isSelected = selectedFood?.foodId === food.foodId
                      return (
                        <CListGroupItem
                          key={food.foodId}
                          action
                          onClick={() => handleSelect(food)}
                          className="d-flex justify-content-between align-items-center py-3 px-3"
                          style={{
                            borderLeft: isSelected ? '3px solid #2d6a4f' : '3px solid transparent',
                            background: isSelected ? '#eef3ee' : '',
                            cursor: 'pointer',
                          }}
                        >
                          <div>
                            <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                              {food.name}
                            </div>
                            <small className="text-medium-emphasis">{food.unit}당</small>
                          </div>
                          <span
                            className="fw-bold ms-2"
                            style={{ color: '#2d6a4f', whiteSpace: 'nowrap' }}
                          >
                            {food.kcal} <small className="fw-normal">kcal</small>
                          </span>
                        </CListGroupItem>
                      )
                    })}
                  </CListGroup>
                )}
              </CCardBody>
            </CCard>
          </CCol>

          {/* 우측: 영양정보 상세 */}
          <CCol xs={12} md={7} lg={8}>
            {selectedFood ? (
              <NutritionDetail
                food={selectedFood}
                amount={amount}
                onAmountChange={setAmount}
              />
            ) : (
              foods.length > 0 && (
                <div className="text-center text-medium-emphasis py-5">
                  좌측 목록에서 음식을 선택하면 영양정보가 표시됩니다.
                </div>
              )
            )}
          </CCol>
        </CRow>
      )}
    </CContainer>
  )
}

export default FoodSearchPage
