// CalcPage.jsx
// IOB — 칼로리 · 목표 계산기
// React + CoreUI (@coreui/react ^5)
//
// 의존성:
//   npm install @coreui/react @coreui/icons @coreui/icons-react
//   (CoreUI CSS는 앱 엔트리에서 import '@coreui/coreui/dist/css/coreui.min.css')

import { useState, useCallback } from 'react'
import {
  CCard, CCardBody, CCardTitle,
  CFormLabel, CFormInput, CButton,
  CAlert, CBadge,
  CRow, CCol,
  CButtonGroup,
  CListGroup, CListGroupItem,
} from '@coreui/react'

/* ─────────────────────────────
   상수
───────────────────────────── */
const ACT_OPTIONS = [
  { label: '거의 안 움직임',         factor: 1.2 },
  { label: '가볍게 운동 주 1–3회',   factor: 1.375 },
  { label: '보통 운동 주 3–5회',     factor: 1.55 },
  { label: '격렬한 운동 주 6–7회',   factor: 1.725 },
  { label: '매우 격렬 / 운동선수',   factor: 1.9 },
]

/* ─────────────────────────────
   초기 폼 상태
───────────────────────────── */
const INIT_FORM = { age: '', height: '', weight: '', goal: '', deficit: '' }
const INIT_ERRORS = { gender: '', age: '', height: '', weight: '', goal: '', deficit: '', activity: '' }

/* ─────────────────────────────
   CalcPage
───────────────────────────── */
export default function CalcPage() {
  const [form, setForm]       = useState(INIT_FORM)
  const [gender, setGender]   = useState(null)      // 'male' | 'female' | null
  const [actIdx, setActIdx]   = useState(-1)
  const [errors, setErrors]   = useState(INIT_ERRORS)
  const [result, setResult]   = useState(null)       // 계산 결과 또는 null

  /* 입력 변경 */
  const handleChange = useCallback((field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }, [])

  /* 유효성 검사 → 에러 객체 반환 */
  const validate = useCallback(() => {
    const errs = { ...INIT_ERRORS }
    let ok = true

    if (!gender) { errs.gender = '성별을 선택해주세요'; ok = false }

    const numCheck = (field, label, min, max) => {
      const v = parseFloat(form[field])
      if (!form[field] || isNaN(v)) { errs[field] = `${label}을(를) 입력해주세요`; ok = false }
      else if (v < min || v > max)  { errs[field] = `${min}–${max} 사이로 입력해주세요`; ok = false }
    }
    numCheck('age',     '나이',           10,  100)
    numCheck('height',  '키',            100,  250)
    numCheck('weight',  '현재 체중',      20,  300)
    numCheck('goal',    '목표 체중',      20,  300)
    numCheck('deficit', '일일 칼로리 적자', 100, 1500)

    if (actIdx < 0) { errs.activity = '활동 수준을 선택해주세요'; ok = false }

    // 목표 > 현재 체중 검사
    if (!errs.weight && !errs.goal) {
      const wt   = parseFloat(form.weight)
      const goal = parseFloat(form.goal)
      if (goal >= wt) { errs.goal = '목표 체중은 현재 체중보다 낮아야 합니다'; ok = false }
    }

    return { errs, ok }
  }, [form, gender, actIdx])

  /* 계산 실행 */
  const handleCalc = useCallback(() => {
    const { errs, ok } = validate()
    setErrors(errs)
    if (!ok) { setResult(null); return }

    const age    = parseFloat(form.age)
    const h      = parseFloat(form.height)
    const wt     = parseFloat(form.weight)
    const goal   = parseFloat(form.goal)
    const def    = parseFloat(form.deficit)

    const bmr = gender === 'male'
      ? 88.36 + 13.4 * wt + 4.8 * h - 5.7 * age
      : 447.6  + 9.25 * wt + 3.1 * h - 4.33 * age

    const tdee   = bmr * ACT_OPTIONS[actIdx].factor
    const intake = tdee - def
    const diff   = wt - goal
    const days   = Math.round((diff * 7700) / def)
    const weeks  = Math.round(days / 7)

    setResult({ bmr, tdee, intake, diff, days, weeks, def })
  }, [form, gender, actIdx, validate])

  /* ── 에러 유무 확인 ── */
  const hasAnyError = Object.values(errors).some(Boolean)

  return (
    <div style={{ background: '#f0ede6', minHeight: '100vh' }}>

      {/* ── 페이지 헤더 ── */}
      <div style={{
        padding: '36px 48px 28px',
        background: '#f0ede6',
        borderBottom: '1px solid #e4e0d8',
      }}>
        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(20px, 3vw, 26px)',
          fontWeight: 900,
          color: '#1a1a18',
          marginBottom: 4,
        }}>
          칼로리 · 목표 계산기
        </h1>
        <p style={{ fontSize: 13, color: '#a8a59e', margin: 0 }}>
          BMR, TDEE를 계산하고 목표 체중까지 예상 기간을 확인하세요
        </p>
        <div style={{ marginTop: 18 }}>
          <CBadge
            color="success"
            shape="rounded-pill"
            style={{ fontSize: 12, padding: '6px 16px', background: '#2d5c1e' }}
          >
            BMR · TDEE · 목표 시뮬레이터
          </CBadge>
        </div>
      </div>

      {/* ── 본문 ── */}
      <div style={{ padding: '32px 48px', maxWidth: 980 }}>
        <CRow className="g-4">

          {/* ────────── 좌: 입력 카드 ────────── */}
          <CCol md={6}>
            <CCard style={{ border: '1px solid #e4e0d8', borderRadius: 12 }}>
              <CCardBody style={{ padding: 28 }}>
                <CCardTitle
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: 13, fontWeight: 700,
                    color: '#a8a59e', textTransform: 'uppercase',
                    letterSpacing: 1, marginBottom: 20,
                  }}
                >
                  신체 정보 입력
                </CCardTitle>

                {/* 성별 */}
                <div className="mb-3">
                  <CFormLabel style={labelStyle}>성별</CFormLabel>
                  <CButtonGroup className="w-100">
                    <CButton
                      variant={gender === 'male' ? undefined : 'outline'}
                      color="success"
                      onClick={() => { setGender('male'); setErrors(p => ({ ...p, gender: '' })) }}
                      style={genderBtnStyle(gender === 'male')}
                    >
                      남성
                    </CButton>
                    <CButton
                      variant={gender === 'female' ? undefined : 'outline'}
                      color="success"
                      onClick={() => { setGender('female'); setErrors(p => ({ ...p, gender: '' })) }}
                      style={genderBtnStyle(gender === 'female')}
                    >
                      여성
                    </CButton>
                  </CButtonGroup>
                  {errors.gender && <ErrorMsg>{errors.gender}</ErrorMsg>}
                </div>

                {/* 나이 / 키 / 현재 체중 / 목표 체중 */}
                <CRow className="g-3 mb-2">
                  {[
                    { field: 'age',    label: '나이',     unit: '세',  placeholder: '예) 28',  min: 10,  max: 100 },
                    { field: 'height', label: '키',       unit: 'cm',  placeholder: '예) 175', min: 100, max: 250 },
                    { field: 'weight', label: '현재 체중', unit: 'kg', placeholder: '예) 80',  min: 20,  max: 300 },
                    { field: 'goal',   label: '목표 체중', unit: 'kg', placeholder: '예) 70',  min: 20,  max: 300 },
                  ].map(({ field, label, unit, placeholder }) => (
                    <CCol xs={6} key={field}>
                      <CFormLabel style={labelStyle}>{label}</CFormLabel>
                      <div style={inputWrapStyle(!!errors[field])}>
                        <CFormInput
                          type="number"
                          placeholder={placeholder}
                          value={form[field]}
                          onChange={handleChange(field)}
                          invalid={!!errors[field]}
                          style={inputStyle}
                        />
                        <span style={unitStyle}>{unit}</span>
                      </div>
                      {errors[field] && <ErrorMsg>{errors[field]}</ErrorMsg>}
                    </CCol>
                  ))}
                </CRow>

                <hr style={{ borderColor: '#e4e0d8', margin: '18px 0' }} />

                {/* 활동 수준 */}
                <div className="mb-3">
                  <p style={{ ...sectionLabelStyle, marginBottom: 10 }}>활동 수준</p>
                  <CListGroup flush style={{ borderRadius: 8 }}>
                    {ACT_OPTIONS.map((opt, i) => (
                      <CListGroupItem
                        key={i}
                        onClick={() => { setActIdx(i); setErrors(p => ({ ...p, activity: '' })) }}
                        style={{
                          cursor: 'pointer',
                          background: actIdx === i ? '#e8f0e0' : '#f0ede6',
                          borderColor: actIdx === i ? '#2d5c1e' : '#e4e0d8',
                          color: actIdx === i ? '#2d5c1e' : '#5a5850',
                          fontWeight: actIdx === i ? 600 : 400,
                          fontSize: 13,
                          padding: '10px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all .15s',
                        }}
                      >
                        <span>{opt.label}</span>
                        <span style={{ fontSize: 11, color: '#a8a59e' }}>× {opt.factor}</span>
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                  {errors.activity && <ErrorMsg>{errors.activity}</ErrorMsg>}
                </div>

                <hr style={{ borderColor: '#e4e0d8', margin: '18px 0' }} />

                {/* 목표 시뮬레이터 */}
                <p style={sectionLabelStyle}>목표 시뮬레이터</p>
                <div className="mb-1">
                  <CFormLabel style={labelStyle}>일일 칼로리 적자</CFormLabel>
                  <div style={inputWrapStyle(!!errors.deficit)}>
                    <CFormInput
                      type="number"
                      placeholder="예) 500"
                      value={form.deficit}
                      onChange={handleChange('deficit')}
                      invalid={!!errors.deficit}
                      style={inputStyle}
                    />
                    <span style={unitStyle}>kcal</span>
                  </div>
                  {errors.deficit
                    ? <ErrorMsg>{errors.deficit}</ErrorMsg>
                    : <p style={{ fontSize: 11, color: '#a8a59e', marginTop: 4 }}>권장 범위: 300–700 kcal</p>
                  }
                </div>

                {/* 전체 에러 배너 */}
                {hasAnyError && (
                  <CAlert color="danger" style={{ fontSize: 12, padding: '10px 13px', marginBottom: 10 }}>
                    ⚠ 필수 항목이 누락되었습니다. 확인해주세요.
                  </CAlert>
                )}

                {/* 계산 버튼 */}
                <CButton
                  color="success"
                  shape="rounded-pill"
                  className="w-100"
                  onClick={handleCalc}
                  style={{
                    background: '#2d5c1e',
                    color: 'white',
                    border: 'none',
                    padding: '13px',
                    fontSize: 14,
                    fontWeight: 600,
                    marginTop: 6,
                  }}
                >
                  계산하기
                </CButton>

              </CCardBody>
            </CCard>
          </CCol>

          {/* ────────── 우: 결과 카드 ────────── */}
          <CCol md={6}>
            {result ? (
              <CCard
                style={{
                  border: '1px solid #d0e0c0',
                  borderRadius: 12,
                  background: '#e8f0e0',
                  animation: 'fadeUp .35s both',
                }}
              >
                <CCardBody style={{ padding: 24 }}>
                  <p style={sectionLabelStyle}>계산 결과</p>

                  {/* 상단 3칸 */}
                  <CRow className="g-2 mb-3">
                    {[
                      { label: 'BMR',    value: Math.round(result.bmr).toLocaleString(),  unit: 'kcal / 일', color: '#2d5c1e' },
                      { label: 'TDEE',   value: Math.round(result.tdee).toLocaleString(), unit: 'kcal / 일', color: '#2d5c1e' },
                      { label: '목표까지', value: result.days.toLocaleString(),            unit: '일 예상',   color: '#1a6a5a' },
                    ].map(({ label, value, unit, color }) => (
                      <CCol xs={4} key={label}>
                        <div style={{
                          background: '#fff',
                          borderRadius: 8,
                          padding: 16,
                          textAlign: 'center',
                        }}>
                          <p style={{ fontSize: 10, color: '#a8a59e', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 5 }}>{label}</p>
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 26, fontWeight: 700, color, margin: 0, lineHeight: 1 }}>{value}</p>
                          <p style={{ fontSize: 10, color: '#a8a59e', marginTop: 4 }}>{unit}</p>
                        </div>
                      </CCol>
                    ))}
                  </CRow>

                  {/* 상세 행 */}
                  {[
                    { label: '권장 일일 섭취량',  value: `${Math.round(result.intake).toLocaleString()} kcal/일`, color: '#2d5c1e' },
                    { label: '예상 달성 기간',    value: `약 ${result.weeks}주 (${result.days}일)`,               color: '#1a6a5a' },
                    { label: '감량 목표',         value: `${result.diff}kg 감량`,                                  color: '#2d5c1e' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '9px 0', borderBottom: '1px solid #d0e0c0', fontSize: 13,
                    }}>
                      <span style={{ color: '#1e3e12' }}>{label}</span>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 700, color }}>{value}</span>
                    </div>
                  ))}

                  {/* 공식 */}
                  <p style={{
                    fontSize: 11, color: '#2d5c1e',
                    marginTop: 12, paddingTop: 12,
                    borderTop: '1px solid #d0e0c0',
                    lineHeight: 1.7,
                  }}>
                    {result.diff}kg × 7,700 kcal = {(result.diff * 7700).toLocaleString()} kcal ÷ {result.def} ={' '}
                    <strong>{result.days}일</strong>
                    <br />
                    Mifflin-St Jeor 공식 · 체중 1kg = 7,700 kcal 기준
                  </p>

                </CCardBody>
              </CCard>
            ) : (
              /* 빈 상태 */
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                minHeight: 320, color: '#a8a59e', gap: 10, textAlign: 'center',
              }}>
                <span style={{ fontSize: 40 }}>🧮</span>
                <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  왼쪽 정보를 입력하고<br />계산하기를 눌러주세요
                </p>
              </div>
            )}
          </CCol>

        </CRow>
      </div>

      {/* fadeUp 애니메이션 */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────
   스타일 헬퍼
───────────────────────────── */
const labelStyle = {
  fontSize: 11, fontWeight: 600, color: '#a8a59e',
  letterSpacing: .6, textTransform: 'uppercase',
  marginBottom: 5, display: 'block',
}

const sectionLabelStyle = {
  fontSize: 11, fontWeight: 700,
  letterSpacing: 1.2, textTransform: 'uppercase',
  color: '#a8a59e', marginBottom: 10,
}

const inputWrapStyle = (hasErr) => ({
  display: 'flex', alignItems: 'center',
  background: hasErr ? '#fdecea' : '#f0ede6',
  border: `1px solid ${hasErr ? '#c0392b' : '#e4e0d8'}`,
  borderRadius: 8, overflow: 'hidden',
  transition: 'border-color .15s',
})

const inputStyle = {
  flex: 1, border: 'none', background: 'transparent',
  padding: '10px 13px', fontSize: 14,
  color: '#1a1a18', outline: 'none', boxShadow: 'none',
}

const unitStyle = {
  padding: '10px 12px', fontSize: 12, color: '#a8a59e',
  borderLeft: '1px solid #e4e0d8', whiteSpace: 'nowrap', flexShrink: 0,
}

const genderBtnStyle = (active) => ({
  background: active ? '#2d5c1e' : '#f0ede6',
  color: active ? '#fff' : '#5a5850',
  border: `1px solid ${active ? '#2d5c1e' : '#e4e0d8'}`,
  fontWeight: active ? 600 : 400,
  fontSize: 13,
  transition: 'all .15s',
})

/* 인라인 에러 메시지 */
function ErrorMsg({ children }) {
  return (
    <p style={{ fontSize: 11, color: '#c0392b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
      ⚠ {children}
    </p>
  )
}
