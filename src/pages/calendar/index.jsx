import { useState } from 'react'
import { useDietByMonth, useSaveExercise } from '../../hooks/useDiet'
import DietDetail from './DietDetail'
import '../../scss/calendar.scss'

// 날짜 키 생성
const dayKey = (y, m, d) => `${y}-${m}-${d}`

// 식단 데이터 존재 여부
const hasMealData = (data) =>
  data && Object.values(data.meals ?? {}).some(arr => arr.length > 0)

// 총 칼로리
const totalKcal = (meals) =>
  Object.values(meals ?? {}).flat().reduce((s, i) => s + (parseInt(i.kcal) || 0), 0)

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const today = new Date()
const TODAY = {
  y: today.getFullYear(),
  m: today.getMonth() + 1,
  d: today.getDate(),
}

export default function CalendarPage() {
  const [year, setYear] = useState(TODAY.y)
  const [month, setMonth] = useState(TODAY.m)
  const [detailKey, setDetailKey] = useState(null) // null이면 캘린더, 값 있으면 식단 상세

  const { data: dietData = {} } = useDietByMonth(year, month)
  const { mutate: saveExercise } = useSaveExercise()

  // 월 이동
  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  // 캘린더 날짜 계산
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const prevDays = new Date(year, month - 1, 0).getDate()
  const totalCells = (firstDay + daysInMonth) <= 35 ? 35 : 42

  // 식단 상세로 이동
  const openDetail = (day) => setDetailKey(dayKey(year, month, day))

  // 뒤로가기
  const handleBack = () => setDetailKey(null)

  // 전일 체중 가져오기
  const getPrevWeight = (dateKey) => {
    const [y, m, d] = dateKey.split('-').map(Number)
    const prevKey = dayKey(y, m, d - 1)
    return dietData[prevKey]?.weight ?? ''
  }

  // 식단 상세 뷰
  if (detailKey) {
    return (
      <DietDetail
        dateKey={detailKey}
        initialData={dietData[detailKey]}
        prevWeight={getPrevWeight(detailKey)}
        onBack={handleBack}
      />
    )
  }

  // 캘린더 뷰
  return (
    <div className="iob-main">
      {/* 월 네비게이션 */}
      <div className="month-nav">
        <button className="month-nav-btn" onClick={prevMonth}>‹</button>
        <div className="month-title">
          <em>{year}</em>.{String(month).padStart(2, '0')}
        </div>
        <button className="month-nav-btn" onClick={nextMonth}>›</button>
      </div>

      {/* 캘린더 */}
      <div className="calendar-wrap">
        {/* 요일 헤더 */}
        <div className="cal-header">
          {DAYS.map(d => (
            <div key={d} className="cal-header-cell">{d}</div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="cal-grid">
          {Array.from({ length: totalCells }, (_, i) => {
            const day = i - firstDay + 1
            const isOther = day < 1 || day > daysInMonth
            const isWeekend = i % 7 === 0 || i % 7 === 6
            const isToday = !isOther && year === TODAY.y && month === TODAY.m && day === TODAY.d
            const dk = isOther ? null : dayKey(year, month, day)
            const data = dk ? dietData[dk] : null
            const hasMeal = hasMealData(data)
            const kcal = hasMeal ? totalKcal(data.meals) : 0
            const isChecked = data?.exercise ?? false

            const dispDay = isOther
              ? day < 1 ? prevDays + day : day - daysInMonth
              : day

            let cellClass = 'cal-cell'
            if (isWeekend) cellClass += ' weekend'
            if (isOther)   cellClass += ' other-month'
            if (isToday)   cellClass += ' today'
            if (hasMeal)   cellClass += ' has-data'

            return (
              <div key={i} className={cellClass}>
                {/* 날짜 + 운동 체크박스 */}
                <div className="cell-top">
                  {isToday
                    ? <div className="today-badge">{dispDay}</div>
                    : <div className="cell-num">{dispDay}</div>
                  }
                  {!isOther && (
                    <label className={`exercise-check ${isChecked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          e.stopPropagation()
                          saveExercise({ dateKey: dk, checked: e.target.checked })
                        }}
                      />
                      <span className="exercise-label">운동</span>
                    </label>
                  )}
                </div>

                {/* 데이터 필 */}
                {(hasMeal || data?.weight) && (
                  <div className="data-row">
                    {data?.weight && (
                      <div className="pill pill-weight">{data.weight}kg</div>
                    )}
                    {kcal > 0 && (
                      <div className="pill pill-meal">{kcal}kcal</div>
                    )}
                  </div>
                )}

                {/* 식단 버튼 */}
                {!isOther && (
                  <button
                    className={`diet-btn ${hasMeal ? 'filled' : ''}`}
                    onClick={() => openDetail(day)}
                  >
                    {hasMeal ? '식단 ✓' : '식단 +'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
