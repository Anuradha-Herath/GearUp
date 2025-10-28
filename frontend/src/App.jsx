import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminDashboard from './pages/admin/adminDashboard';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageAppointments from './pages/admin/ManageAppointments';
import Reports from './pages/admin/Reports';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import BookAppointment from './pages/customer/BookAppointment';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ServiceProgress from './pages/customer/ServiceProgress';
import MyBookings from './pages/customer/MyBookings';
import Services from './pages/customer/Services';
import ServiceDetailsWrapper from './pages/ServiceDetailsWrapper';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/service/:serviceId" element={<ServiceDetailsWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/employees" element={<AdminLayout><ManageEmployees /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><ManageCustomers /></AdminLayout>} />
        <Route path="/admin/appointments" element={<AdminLayout><ManageAppointments /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
        <Route path="/customer/dashboard" element={<CustomerLayout><CustomerDashboard /></CustomerLayout>} />
        <Route path="/customer/services" element={<CustomerLayout><Services /></CustomerLayout>} />
        <Route path="/customer/book-appointment" element={<CustomerLayout><BookAppointment /></CustomerLayout>} />
        <Route path="/customer/my-bookings" element={<CustomerLayout><MyBookings /></CustomerLayout>} />
        <Route path="/customer/service-progress" element={<CustomerLayout><ServiceProgress /></CustomerLayout>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;