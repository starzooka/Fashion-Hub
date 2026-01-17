import { Link } from 'react-router-dom';
import '../styles/productCard.css';

export default function ProductCard({ product }) {
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image"
        />
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
        {product.stock === 0 && <span className="out-of-stock">Out of Stock</span>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="product-category">
          <span className="category-badge">{product.category}</span>
        </div>

        <div className="product-rating">
          <span className="stars">⭐ {product.rating.toFixed(1)}</span>
          <span className="reviews">({product.reviews} reviews)</span>
        </div>

        <div className="product-price">
          {product.discountPrice ? (
            <>
              <span className="original-price">₹{product.price}</span>
              <span className="sale-price">₹{product.discountPrice}</span>
            </>
          ) : (
            <span className="price">₹{product.price}</span>
          )}
        </div>

        <Link to={`/product/${product._id}`} className="view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}
