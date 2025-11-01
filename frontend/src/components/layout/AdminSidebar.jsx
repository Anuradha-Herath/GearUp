import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/employees', label: 'Manage Employees' },
    { path: '/admin/customers', label: 'Manage Customers' },
    { path: '/admin/appointments', label: 'Appointments' },
    { path: '/admin/services', label: 'Manage Services' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  return (
    <aside className="w-64 bg-navbar-color text-white fixed left-0 top-0 h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6 text-primary">Admin Menu</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block p-3 rounded-lg transition-colors ${
                    location.pathname === item.path ? 'bg-primary text-white' : 'hover:bg-primary/20'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;