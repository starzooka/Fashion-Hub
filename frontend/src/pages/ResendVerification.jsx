import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/services.js';
import '../styles/auth.css';

export default function ResendVerification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await authAPI.resendVerificationEmail({ email });
      setSent(true);
      setMessage('Verification email sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="verification-pending">
            <div className="verification-icon">✉️</div>
            <h2>Email Sent</h2>
            <p className="verification-message">
              We've sent a new verification link to <strong>{email}</strong>
            </p>
            <p className="verification-subtext">
              Check your email and click the link to verify your account. The link will expire in 24 hours.
            </p>
            
            <div className="verification-actions">
              <button
                onClick={() => navigate('/login')}
                className="submit-btn"
              >
                Go to Login
              </button>
            </div>

            <p className="verification-hint">
              Check your spam folder if you don't see the email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Resend Verification Email</h2>
          <p>Enter your email to receive verification link</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending...' : 'Send Verification Email'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/login" className="link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
