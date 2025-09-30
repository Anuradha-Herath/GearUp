import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-center items-center py-20">
        <div className="w-full max-w-md">
          <form className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Forgot Password</h2>
            <p className="text-center text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" id="email" type="email" placeholder="Email" />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300" type="button">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;