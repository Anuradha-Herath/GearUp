import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import DashboardRedirect from './components/DashboardRedirect';
import LandingPage from './pages/LandingPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
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
import AdminDashboard from './pages/admin/adminDashboard';
import ServiceProgress from './pages/customer/ServiceProgress';
import MyBookings from './pages/customer/MyBookings';
import MyVehicles from './pages/customer/MyVehicles';
import Services from './pages/customer/Services';
import ServiceDetailsWrapper from './pages/ServiceDetailsWrapper';
import FeedbackForm from './pages/customer/FeedbackForm';
import MyFeedbacks from './pages/customer/Feedbacks';
import EmployeeFeedbacks from './pages/employee/Feedbacks';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/service/:serviceId" element={<ServiceDetailsWrapper />} />
        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify" element={<Verify />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <EmployeeLayout><EmployeeDashboard /></EmployeeLayout>
          </ProtectedRoute>
        } />
        <Route path="/employee/manage-orders" element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <EmployeeLayout><ManageOrders /></EmployeeLayout>
          </ProtectedRoute>
        } />
        <Route path="/employee/history" element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <EmployeeLayout><History /></EmployeeLayout>
          </ProtectedRoute>
        } />
        <Route path="/employee/customers" element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <EmployeeLayout><Customers /></EmployeeLayout>
          </ProtectedRoute>
        } />
        <Route path="/employee/services" element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <EmployeeLayout><EmployeeServices /></EmployeeLayout>
          </ProtectedRoute>
        } />
        <Route path="/employee/schedule" element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <EmployeeLayout><Schedule /></EmployeeLayout>
          </ProtectedRoute>
        } />
        <Route path="/employee/feedbacks" element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <EmployeeLayout><EmployeeFeedbacks /></EmployeeLayout>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/employees" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><ManageEmployees /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><ManageCustomers /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/appointments" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><ManageAppointments /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/services" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><ManageServices /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><Reports /></AdminLayout>
          </ProtectedRoute>
        } />
        
        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerLayout><CustomerDashboard /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer/services" element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerLayout><Services /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer/my-vehicles" element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerLayout><MyVehicles /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer/book-appointment" element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerLayout><BookAppointment /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer/my-bookings" element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerLayout><MyBookings /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer/service-progress" element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerLayout><ServiceProgress /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer/feedback-form" element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerLayout><FeedbackForm /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer/feedbacks" element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerLayout><MyFeedbacks /></CustomerLayout>
          </ProtectedRoute>
        } />

        {/* Dashboard redirect route */}
        <Route path="/dashboard" element={<DashboardRedirect />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;