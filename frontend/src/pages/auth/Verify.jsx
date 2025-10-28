import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authService from '../../services/authService';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking'); // checking | success | error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const ranRef = useRef(false); // prevent double-run in React StrictMode

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setStatus('error');
      setMessage('Missing verification code.');
      return;
    }

    const verify = async () => {
      if (ranRef.current) return; // guard against double call
      ranRef.current = true;
      try {
        const res = await authService.verifyEmail(code);
        // Treat HTTP 200 or explicit success flag as success
        if (res?.status === 'success' || res?.ok === true) {
          setStatus('success');
          setMessage(res.message || 'Your account has been verified.');
        } else {
          setStatus('error');
          setMessage(res?.message || 'Invalid or expired verification link.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verification failed.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background-light to-primary/5 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        {status === 'checking' && (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 mx-auto border-4 border-primary border-t-transparent rounded-full mb-4" />
            <p className="text-gray-700">Verifying your account...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-3 text-green-600">✓</div>
            <h2 className="text-xl font-semibold mb-2">Account verified</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-3 text-red-600">✕</div>
            <h2 className="text-xl font-semibold mb-2">Verification failed</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
              >
                Create new account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
