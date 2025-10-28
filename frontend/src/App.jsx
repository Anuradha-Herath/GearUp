import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import AdminDashboard from './pages/admin/adminDashboard';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageAppointments from './pages/admin/ManageAppointments';
import Reports from './pages/admin/Reports';
import AdminLayout from './layouts/AdminLayout';


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/service/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/employees" element={<AdminLayout><ManageEmployees /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><ManageCustomers /></AdminLayout>} />
        <Route path="/admin/appointments" element={<AdminLayout><ManageAppointments /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />

      </Routes>
    </AuthProvider>
  );
}

export default App;