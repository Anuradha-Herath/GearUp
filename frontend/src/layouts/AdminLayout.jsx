import React from 'react';
import AdminNavbar from '../components/layout/AdminNavbar';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminFooter from '../components/layout/AdminFooter';

const AdminLayout = ({ children }) => {
  console.log('AdminLayout rendering with children:', children);
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-white ml-64">
          {children}
        </main>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;