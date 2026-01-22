import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Products', path: '/dashboard', icon: '📦' },
    { name: 'Orders', path: '/orders', icon: '🛍️' },
    { name: 'Customers', path: '/customers', icon: '👥' },
    { name: 'Analytics', path: '/analytics', icon: '📈' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">⚡</div>
        <h2>Admin<span className="text-primary">Panel</span></h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-item ${location.pathname === item.path && item.name === 'Dashboard' ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="pro-card">
          <p>Admin Support</p>
          <small>v1.0.0</small>
        </div>
      </div>
    </aside>
  );
}