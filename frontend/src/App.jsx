import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Verify from './pages/auth/Verify';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/verify" element={<Verify />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;