import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../api/services.js';
import useAuthStore from '../context/authStore.js';
import '../styles/cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchCart();
    }
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      await cartAPI.updateCartItem(itemId, { quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCheckout = async () => {
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      alert('Please fill all address fields');
      return;
    }

    try {
      await orderAPI.createOrder({
        shippingAddress: address,
        paymentMethod: 'card',
      });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order');
    }
  };

  if (loading) {
    return <div className="container loading">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h1>Your Cart is Empty</h1>
            <p>Start shopping to add items to your cart</p>
            <button onClick={() => navigate('/products')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const shipping_cost = 50;
  const total = subtotal + tax + shipping_cost;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-grid">
          <div className="cart-items">
            <div className="items-list">
              {cart.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <img src={item.product.images[0]} alt={item.product.name} />
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-variant">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="item-price">₹{item.price}</p>
                  </div>
                  <div className="item-quantity">
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    <p>₹{item.price * item.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>₹{tax}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>₹{shipping_cost}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={() => setShowCheckout(!showCheckout)}
              className="checkout-btn"
            >
              {showCheckout ? 'Hide Checkout' : 'Proceed to Checkout'}
            </button>

            {showCheckout && (
              <div className="checkout-form">
                <h3>Shipping Address</h3>
                <input
                  type="text"
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                />
                <button onClick={handleCheckout} className="place-order-btn">
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
