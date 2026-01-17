import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore.js';
import '../styles/header.css';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>FashionHub</h1>
          </Link>

          <nav className="nav">
            <Link to="/products" className="nav-link">
              Products
            </Link>
            <Link to="/products?category=tops" className="nav-link">
              Tops
            </Link>
            <Link to="/products?category=bottoms" className="nav-link">
              Bottoms
            </Link>
            <Link to="/products?category=accessories" className="nav-link">
              Accessories
            </Link>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="nav-link">
              🛒 Cart
            </Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-name">{user?.name}</span>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <Link to="/orders" className="nav-link">
                  Orders
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
