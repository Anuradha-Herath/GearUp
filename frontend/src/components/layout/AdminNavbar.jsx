import React from 'react';

const AdminNavbar = () => {
  return (
    <nav className="bg-navbar-color p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Admin Panel - AutoServe</h1>
        <div className="text-white">
          <span>Welcome, Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;