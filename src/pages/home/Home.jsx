// src/pages/home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">메인 페이지</h1>
      <Link to="/login" className="text-blue-500 underline">
        로그인 페이지로 이동하기
      </Link>
    </div>
  );
};

export default Home;