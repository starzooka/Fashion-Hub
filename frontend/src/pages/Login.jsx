import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/services.js';
import useAuthStore from '../context/authStore.js';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      setLoading(true);
      const response = await authAPI.login(formData);
      setUser(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 403) {
        setErrors({
          submit: error.response?.data?.message || 'Please verify your email',
          unverified: true,
          email: formData.email,
        });
      } else {
        setErrors({
          submit: error.response?.data?.message || 'Login failed',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {errors.submit && (
            <div className="error-message">
              {errors.submit}
              {errors.unverified && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                  <Link
                    to="/resend-verification"
                    style={{
                      color: 'inherit',
                      textDecoration: 'underline',
                      fontWeight: '600',
                    }}
                  >
                    Resend verification email
                  </Link>
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
