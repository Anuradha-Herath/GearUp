import React from 'react';

const EmployeeFooter = () => {
  return (
    <footer className="bg-navbar-color text-gray-300 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} GearUp. All rights reserved. | Employee Portal</p>
        </div>
      </div>
    </footer>
  );
};

export default EmployeeFooter;
