import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/services.js';
import useAuthStore from '../context/authStore.js';
import '../styles/auth.css';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      console.log('VerifyEmail page loaded - token:', token ? 'present' : 'missing', 'email:', email);

      if (!token || !email) {
        console.error('Missing token or email');
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        console.log('Calling checkEmailVerification API...');
        const response = await authAPI.checkEmailVerification({ token, email });
        console.log('Verification successful:', response.data);
        setStatus('success');
        setMessage('Email verified successfully!');
        setUserEmail(email);
        
        // Store verification in localStorage
        localStorage.setItem('verifiedEmail', email);
        localStorage.setItem('emailVerificationToken', token);
        
        console.log('Email verification successful, auto-redirecting to register in 3 seconds');
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate('/register?verified=true');
        }, 3000);
      } catch (error) {
        console.error('Verification error:', error.response?.data || error.message);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="verification-status">
          {status === 'verifying' && (
            <>
              <div className="verification-loader"></div>
              <h2>Verifying Your Email</h2>
              <p>{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="verification-icon success">✓</div>
              <h2>Email Verified!</h2>
              <p>{message}</p>
              <p className="verification-subtext">
                Your email has been successfully verified. You can now continue with your account registration.
              </p>
              
              <div className="verification-actions">
                <button
                  onClick={() => navigate('/register?verified=true')}
                  className="submit-btn"
                >
                  Continue to Registration
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="verification-icon error">✕</div>
              <h2>Verification Failed</h2>
              <p className="error-text">{message}</p>
              
              <div className="verification-actions">
                <button
                  onClick={() => navigate('/resend-verification')}
                  className="submit-btn"
                >
                  Resend Verification Email
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="secondary-btn"
                >
                  Create New Account
                </button>
              </div>

              <p className="verification-hint">
                If you keep experiencing issues,{' '}
                <Link to="/contact" className="link">
                  contact support
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
