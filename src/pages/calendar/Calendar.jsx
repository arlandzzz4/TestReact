import { useState } from 'react'
import { useDietByMonth, useSaveExercise } from '../../hooks/useDiet'
import DietDetail from './DietDetail'
import '../../scss/calendar.scss'
import { useAuthStore } from '../../store/useAuthStore'

const dayKey = (y, m, d) => `${y}-${m}-${d}`
const hasMealData = (data) =>
  data && Object.values(data.meals ?? {}).some(arr => arr.length > 0)
const totalKcal = (meals) =>
  Object.values(meals ?? {}).flat().reduce((s, i) => s + (parseInt(i.kcal) || 0), 0)
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const now = new Date()
const TODAY = { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() }

export default function CalendarPage() {
  const [year, setYear]       = useState(TODAY.y)
  const [month, setMonth]     = useState(TODAY.m)
  const [detailKey, setDetailKey] = useState(null)

  // 임시 테스트용 — 로그인 연결 후 ?? 이하 제거
  const user = useAuthStore((state) => state.user) ?? {
    email: 'test@test.com',
    nickname: '테스트유저',
    password: 'password',
    providerCode: '01',
    userStatusCode: '01',
    roleCode: 'USER',
    termsAgreedYn: 'Y'
  }

  const { data: dietData = {} } = useDietByMonth(year, month, user)
  const { mutate: saveExercise } = useSaveExercise()

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const firstDay    = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const prevDays    = new Date(year, month - 1, 0).getDate()
  const totalCells  = (firstDay + daysInMonth) <= 35 ? 35 : 42

  const openDetail = (day) => setDetailKey(dayKey(year, month, day))
  const handleBack = () => setDetailKey(null)

  const getPrevWeight = (dk) => {
    const [y, m, d] = dk.split('-').map(Number)
    return dietData[dayKey(y, m, d - 1)]?.weight ?? ''
  }

  if (detailKey) {
    return (
      <DietDetail
        dateKey={detailKey}
        initialData={dietData[detailKey]}
        prevWeight={getPrevWeight(detailKey)}
        user={user}
        onBack={handleBack}
      />
    )
  }

  return (
    <div className="iob-main">
      <div className="iob-month-nav">
        <button className="iob-month-nav-btn" onClick={prevMonth}>‹</button>
        <div className="iob-month-title">
          <em>{year}</em>.{String(month).padStart(2, '0')}
        </div>
        <button className="iob-month-nav-btn" onClick={nextMonth}>›</button>
      </div>

      <div className="iob-calendar-wrap">
        <div className="iob-cal-header">
          {DAYS.map(d => (
            <div key={d} className="iob-cal-header-cell">{d}</div>
          ))}
        </div>

        <div className="iob-cal-grid">
          {Array.from({ length: totalCells }, (_, i) => {
            const day     = i - firstDay + 1
            const isOther = day < 1 || day > daysInMonth
            const isWeekend = i % 7 === 0 || i % 7 === 6
            const isToday = !isOther && year === TODAY.y && month === TODAY.m && day === TODAY.d
            const dk      = isOther ? null : dayKey(year, month, day)
            const data    = dk ? dietData[dk] : null
            const hasMeal = hasMealData(data)
            const kcal    = hasMeal ? totalKcal(data.meals) : (data?.calorieIntake ?? 0)
            const isChecked = data?.exerciseYn ?? false

            const dispDay = isOther
              ? day < 1 ? prevDays + day : day - daysInMonth
              : day

            const cellClass = [
              'iob-cal-cell',
              isWeekend ? 'iob-weekend' : '',
              isOther   ? 'iob-other-month' : '',
              isToday   ? 'iob-today' : '',
              (hasMeal || data?.dietLoggedYn) ? 'iob-has-data' : '',
            ].filter(Boolean).join(' ')

            return (
              <div key={i} className={cellClass}>
                <div className="iob-cell-top">
                  {isToday
                    ? <div className="iob-today-badge">{dispDay}</div>
                    : <div className="iob-cell-num">{dispDay}</div>
                  }
                  {!isOther && (
                    <label className={`iob-exercise-check ${isChecked ? 'iob-checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          e.stopPropagation()
                          saveExercise({
                            dateKey: dk,
                            checked: e.target.checked,
                            userEmail: user?.email
                          })
                        }}
                      />
                      <span className="iob-exercise-label">운동</span>
                    </label>
                  )}
                </div>

                {(data?.dietLoggedYn || data?.weight) && (
                  <div className="iob-data-row">
                    {data?.weight && (
                      <div className="iob-pill iob-pill-weight">{data.weight}kg</div>
                    )}
                    {kcal > 0 && (
                      <div className="iob-pill iob-pill-meal">{kcal}kcal</div>
                    )}
                  </div>
                )}

                {!isOther && (
                  <button
                    className={`iob-diet-btn ${(hasMeal || data?.dietLoggedYn) ? 'iob-filled' : ''}`}
                    onClick={() => openDetail(day)}
                  >
                    {(hasMeal || data?.dietLoggedYn) ? '식단 ✓' : '식단 +'}
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