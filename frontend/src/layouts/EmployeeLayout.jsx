import React from 'react';
import EmployeeNavbar from '../components/layout/EmployeeNavbar';
import EmployeeSidebar from '../components/layout/EmployeeSidebar';
import EmployeeFooter from '../components/layout/EmployeeFooter';

const EmployeeLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <EmployeeNavbar />
      <div className="flex flex-1">
        <EmployeeSidebar />
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
      <EmployeeFooter />
    </div>
  );
};

export default EmployeeLayout;