import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from '../../services/authService';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const verificationCode = searchParams.get('code');

  useEffect(() => {
    const verifyAccount = async () => {
      if (!verificationCode) {
        setStatus('error');
        setMessage('Invalid verification link. No verification code provided.');
        return;
      }

      try {
        const response = await authService.verifyEmail(verificationCode);
        setStatus('success');
        setMessage(response.message || 'Your account has been verified successfully!');
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyAccount();
  }, [verificationCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo/Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {status === 'verifying' && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              )}
              {status === 'success' && (
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status === 'error' && (
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {status === 'verifying' && 'Verifying Your Account...'}
              {status === 'success' && 'Verification Successful!'}
              {status === 'error' && 'Verification Failed'}
            </h2>
          </div>

          {/* Message */}
          <div className={`p-4 rounded-lg mb-6 ${
            status === 'success' ? 'bg-green-50 text-green-800' :
            status === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            <p className="text-center">{message}</p>
          </div>

          {/* Action Buttons */}
          {status === 'success' && (
            <Link
              to="/login"
              className="w-full block text-center bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Link
                to="/signup"
                className="w-full block text-center bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Sign Up Again
              </Link>
              <Link
                to="/"
                className="w-full block text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Go to Home
              </Link>
            </div>
          )}

          {status === 'verifying' && (
            <div className="text-center text-gray-600">
              <p className="text-sm">Please wait while we verify your account...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;