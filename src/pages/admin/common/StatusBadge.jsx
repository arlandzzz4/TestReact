import { CBadge } from '@coreui/react'

const StatusBadge = ({ status }) => {
  let color = 'secondary'; // 기본값 (회색 - 비활성/알 수 없음)

  switch (status) {
    case '반려':
    case '대기':
      color = 'warning'; // 주황색계열 (주의/대기 상태)
      break;
    case '처리완료':
    case '정상':
    case 'N':
      color = 'success'; // 초록색계열 (정상 상태)
      break;
    case '정지':
      color = 'danger'; // 빨간색계열 (문제/위험 상태)
      break;
    case '탈퇴':
      color = 'secondary'; // 회색계열 (탈퇴 상태)
        break;
    default:
      color = 'secondary';
  }
  return (
    <CBadge color={color} shape="pill" className="fs-6 px-3 py-2">
      {status}
    </CBadge>
  );
};

export default StatusBadge;