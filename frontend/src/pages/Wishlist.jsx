import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore.js';
import '../styles/products.css';

export default function Wishlist() {
  const [wishlistItems] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="products-page">
      <div className="container">
        <h1>My Wishlist</h1>
        
        {!user ? (
          <div className="no-products">
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              ✓ Please log in to view your wishlist
            </p>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Create an account or sign in to save your favorite items.
            </p>
            <button 
              onClick={() => navigate('/login')} 
              className="page-btn"
              style={{ marginTop: '1rem' }}
            >
              Go to Login
            </button>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="products-grid">
            {/* Wishlist items will be displayed here */}
          </div>
        ) : (
          <div className="no-products">
            <p>Your wishlist is empty</p>
            <button 
              onClick={() => navigate('/products')} 
              className="page-btn"
              style={{ marginTop: '1rem' }}
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
