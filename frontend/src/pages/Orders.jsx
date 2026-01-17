import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/services.js';
import useAuthStore from '../context/authStore.js';
import '../styles/orders.css';

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      shipped: '#20c997',
      delivered: '#28a745',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return <div className="container loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet</p>
            <button onClick={() => navigate('/products')} className="shop-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">Order #{order._id.substring(0, 8)}</div>
                  <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                    {order.status.toUpperCase()}
                  </div>
                </div>

                <div className="order-info">
                  <div className="info-row">
                    <span>Order Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row">
                    <span>Total Amount:</span>
                    <span className="amount">₹{order.totalPrice}</span>
                  </div>
                  <div className="info-row">
                    <span>Payment Method:</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length}):</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.product.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <button onClick={() => navigate(`/orders/${order._id}`)} className="view-order-btn">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
