import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="bg-blue-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to AutoServe</h1>
        <p className="text-xl md:text-2xl mb-8">Your trusted automobile service management system</p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/login" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block">Customer Login</Link>
          <Link to="/login" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block">Employee Login</Link>
          <Link to="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block">Sign Up</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;