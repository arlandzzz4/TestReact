import React from 'react';

/**
 * 에러 바운더리가 포착한 에러를 보여주는 컴포넌트입니다.
 * @param {Error} error - 발생한 에러 객체
 * @param {Function} resetErrorBoundary - 에러 상태를 초기화하고 재시도하는 함수
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 rounded-lg border border-red-200">
      <h2 className="text-2xl font-bold text-red-600 mb-4">서비스 이용에 불편을 드려 죄송합니다.</h2>
      
      <div className="bg-white p-4 rounded border border-red-100 mb-6 w-full max-w-md overflow-auto">
        <p className="text-sm font-mono text-gray-700">
          {error.message || '알 수 없는 에러가 발생했습니다.'}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          다시 시도
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;