import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Verify from './pages/auth/Verify';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ManageOrders from './pages/employee/ManageOrders';
import History from './pages/employee/History';
import Customers from './pages/employee/Customers';
import EmployeeServices from './pages/employee/Services';
import Schedule from './pages/employee/Schedule';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManageServices from './pages/admin/ManageServices';
import Reports from './pages/admin/Reports';
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import CustomerLayout from './layouts/CustomerLayout';
import BookAppointment from './pages/customer/BookAppointment';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ServiceProgress from './pages/customer/ServiceProgress';
import MyBookings from './pages/customer/MyBookings';
import MyVehicles from './pages/customer/MyVehicles';
import Services from './pages/customer/Services';
import ServiceDetailsWrapper from './pages/ServiceDetailsWrapper';
import FeedbackForm from './pages/customer/FeedbackForm';
import MyFeedbacks from './pages/customer/Feedbacks';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/service/:serviceId" element={<ServiceDetailsWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/verify" element={<Verify />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeLayout><EmployeeDashboard /></EmployeeLayout>} />
        <Route path="/employee/manage-orders" element={<EmployeeLayout><ManageOrders /></EmployeeLayout>} />
        <Route path="/employee/history" element={<EmployeeLayout><History /></EmployeeLayout>} />
        <Route path="/employee/customers" element={<EmployeeLayout><Customers /></EmployeeLayout>} />
        <Route path="/employee/services" element={<EmployeeLayout><EmployeeServices /></EmployeeLayout>} />
        <Route path="/employee/schedule" element={<EmployeeLayout><Schedule /></EmployeeLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/employees" element={<AdminLayout><ManageEmployees /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><ManageCustomers /></AdminLayout>} />
        <Route path="/admin/appointments" element={<AdminLayout><ManageAppointments /></AdminLayout>} />
        <Route path="/admin/services" element={<AdminLayout><ManageServices /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
        
        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<CustomerLayout><CustomerDashboard /></CustomerLayout>} />
        <Route path="/customer/services" element={<CustomerLayout><Services /></CustomerLayout>} />
        <Route path="/customer/my-vehicles" element={<CustomerLayout><MyVehicles /></CustomerLayout>} />
        <Route path="/customer/book-appointment" element={<CustomerLayout><BookAppointment /></CustomerLayout>} />
        <Route path="/customer/my-bookings" element={<CustomerLayout><MyBookings /></CustomerLayout>} />
        <Route path="/customer/service-progress" element={<CustomerLayout><ServiceProgress /></CustomerLayout>} />
        <Route path="/customer/feedback-form" element={<CustomerLayout><FeedbackForm /></CustomerLayout>} />
        <Route path="/customer/feedbacks" element={<CustomerLayout><MyFeedbacks /></CustomerLayout>} />
      </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;