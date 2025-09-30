const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">🚗 AutoServe</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#home" className="text-gray-700 hover:text-blue-600 transition duration-300">Home</a>
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition duration-300">Features</a>
          <a href="#login" className="text-gray-700 hover:text-blue-600 transition duration-300">Login</a>
          <a href="#signup" className="text-gray-700 hover:text-blue-600 transition duration-300">Sign Up</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;