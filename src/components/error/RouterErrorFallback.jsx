import React from 'react';
import { useRouteError } from 'react-router-dom';

const RouterErrorFallback = () => {
  const error = useRouteError();
  console.error("Router Error Caught:", error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-gray-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">앗! 오류가 발생했습니다.</h1>
      <p className="text-gray-600 mb-6">페이지를 처리하는 중 문제가 발생했습니다.</p>
      <div className="bg-red-100 text-red-800 p-4 rounded mb-6 max-w-lg overflow-auto text-left text-sm">
        {error?.statusText || error?.message || "알 수 없는 에러"}
      </div>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default RouterErrorFallback;