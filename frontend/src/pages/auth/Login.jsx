import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-center items-center py-20">
        <div className="w-full max-w-md">
          <form className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Login to AutoServe</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" id="username" type="text" placeholder="Username" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" id="password" type="password" placeholder="******************" />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300" type="button">
                Sign In
              </button>
              <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;