import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore.js';
import '../styles/header.css';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (query.length === 0) {
      navigate('/products');
      return;
    }
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="logo">
              <h1>FashionHub</h1>
            </Link>
          </div>

          <div className="header-center">
            <nav className="nav">
              <Link to="/products" className="nav-link">
                Explore
              </Link>
              <Link to="/cart" className="nav-link">
                Cart
              </Link>
              <Link to="/wishlist" className="nav-link">
                Wishlist
              </Link>
            </nav>

            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="header-actions">
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
                <Link to="/login" className="nav-link ghost-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link primary-link">
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
