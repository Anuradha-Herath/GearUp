import React, { useState } from 'react';
import ConfirmOrders from '../../components/employee/ConfirmOrders';
import ManageOrders from '../../components/employee/ManageOrders';
import OrderHistory from '../../components/employee/OrderHistory';
import CustomerDetails from '../../components/employee/CustomerDetails';
import VehicleRecords from '../../components/employee/VehicleRecords';
import ServiceList from '../../components/employee/ServiceList';
import ScheduleAppointments from '../../components/employee/ScheduleAppointments';
import FeedBacks from '../../components/employee/FeedBacks'; // Added

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('confirm');

  const tabs = [
    { id: 'confirm', label: 'Confirm Orders', icon: '🧩' },
    { id: 'manage', label: 'Manage Orders', icon: '⚙️' },
    { id: 'history', label: 'Order History', icon: '🧾' },
    { id: 'customers', label: 'Customers', icon: '👤' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
    { id: 'services', label: 'Services', icon: '🧰' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'appointments', label: 'Feedback', icon: '💬' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'confirm':
        return <ConfirmOrders />;
      case 'manage':
        return <ManageOrders />;
      case 'history':
        return <OrderHistory />;
      case 'customers':
        return <CustomerDetails />;
      case 'vehicles':
        return <VehicleRecords />;
      case 'services':
        return <ServiceList />;
      case 'schedule':
        return <ScheduleAppointments />;
      case 'appointments': // Added
        return <FeedBacks />;
      default:
        return <ConfirmOrders />;
        
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <div className="bg-background-dark text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-300 mt-1">Manage orders, customers, and services</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-primary hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;