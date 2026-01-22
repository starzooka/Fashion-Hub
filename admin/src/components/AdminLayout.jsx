import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import Sidebar from './Sidebar.jsx';
import '../styles/layout.css';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="main-content-wrapper">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-search">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search inventory, orders..." />
          </div>

          <div className="header-actions">
            <button className="icon-btn">🔔</button>
            <div className="user-profile" onClick={handleLogout} title="Click to Logout">
              <div className="avatar">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="user-info">
                <span className="name">{user?.name}</span>
                <span className="role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}