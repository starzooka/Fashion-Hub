import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import '../styles/layout.css';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-content">
          <Link to="/dashboard" className="logo">
            <h1>Admin Portal</h1>
          </Link>

          <div className="header-actions">
            <span className="admin-name">👤 {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}
