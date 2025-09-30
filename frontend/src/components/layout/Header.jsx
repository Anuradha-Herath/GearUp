import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">🚗 AutoServe</Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-300">Home</Link>
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition duration-300">Features</a>
          <Link to="/login" className="text-gray-700 hover:text-blue-600 transition duration-300">Login</Link>
          <Link to="/signup" className="text-gray-700 hover:text-blue-600 transition duration-300">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;