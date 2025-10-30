import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const EmployeeSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/employee/dashboard', label: 'Confirm Orders', icon: '✅' },
    { path: '/employee/manage-orders', label: 'Manage Orders', icon: '⚙️' },
    { path: '/employee/history', label: 'History', icon: '📋' },
    { path: '/employee/customers', label: 'Customers', icon: '👥' },
    { path: '/employee/services', label: 'Services', icon: '🔧' },
    { path: '/employee/schedule', label: 'Schedule', icon: '📅' },
  ];

  return (
    <aside className="w-64 bg-navbar-color text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6 text-primary">Employee Menu</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path ? 'bg-primary text-white' : 'hover:bg-primary/20'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
