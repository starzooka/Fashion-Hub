import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/services.js';
import useAuthStore from '../store/authStore.js';
import '../styles/auth.css';

export default function Login() {
  const [credentials, setCredentials] = useState({ adminId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.adminLogin(credentials);
      const { token, user } = response.data;

      // Double check role
      if (user.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }

      // Save token specifically for axios interceptor
      localStorage.setItem('adminToken', token);

      // Update global auth state
      login(user, token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Admin Portal</h1>
          <p>Sign in to manage inventory</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="adminId">Admin ID</label>
            <input
              id="adminId"
              type="text"
              value={credentials.adminId}
              onChange={(e) =>
                setCredentials({ ...credentials, adminId: e.target.value })
              }
              placeholder="Enter Admin ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Enter Password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}