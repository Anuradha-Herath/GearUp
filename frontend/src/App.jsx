import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AutoCareLandingPage from './pages/customer/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AutoCareLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App