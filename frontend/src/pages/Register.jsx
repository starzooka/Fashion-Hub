import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/services.js';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    phone: '',
  });

  // Check if email was just verified from email link
  useEffect(() => {
    const verified = searchParams.get('verified');
    const storedEmail = localStorage.getItem('verifiedEmail');
    
    if (verified === 'true' && storedEmail) {
      setEmailVerified(true);
      setFormData(prev => ({ ...prev, email: storedEmail }));
      setSuccess('Email verified! Complete your registration.');
      setTimeout(() => setSuccess(''), 3000);
    }
  }, [searchParams]);

  // Send verification email
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Please enter an email address');
      return;
    }

    setError('');
    setSuccess('');
    setVerifyingEmail(true);

    try {
      await authAPI.requestEmailVerification({ email: formData.email });
      setSuccess('Verification email sent! Check your inbox and click the link.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setVerifyingEmail(false);
    }
  };

  // Handle form submission (complete registration)
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!emailVerified) {
      setError('Please verify your email first');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authAPI.register(formData);
      setSuccess('Account created successfully!');
      
      // Clear verification data
      localStorage.removeItem('verifiedEmail');
      localStorage.removeItem('emailVerificationToken');
      
      // Redirect to login
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us for a great shopping experience</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={emailVerified ? handleRegister : handleVerifyEmail} className="auth-form">
          
          {/* ===== PHASE 1: EMAIL VERIFICATION ===== */}
          {!emailVerified ? (
            <>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  We'll send you a verification link to confirm your email
                </p>
              </div>

              <button 
                type="submit" 
                disabled={verifyingEmail || !formData.email} 
                className="submit-btn"
              >
                {verifyingEmail ? 'Sending Email...' : 'Verify Email'}
              </button>
            </>
          ) : (
            <>
              {/* ===== PHASE 2: COMPLETE REGISTRATION ===== */}
              <div className="form-group">
                <label>Email Address</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    style={{ flex: 1, opacity: 0.7 }}
                  />
                  <span style={{ color: '#10b981', fontWeight: '700', fontSize: '1.2rem' }}>✓</span>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="submit-btn"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </>
          )}
        </form>

        <div className="auth-footer">
          <p>Already have an account?{' '}
            <Link to="/login" className="link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
