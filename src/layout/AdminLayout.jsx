import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div className="admin-container flex">
    <aside className="w-64 bg-gray-800 text-white p-4">Admin Sidebar</aside>
    <main className="flex-1 p-6"><Outlet /></main>
  </div>
);

export default AdminLayout;