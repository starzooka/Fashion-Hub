import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../api/services.js';
import ProductCard from '../components/ProductCard.jsx';
import '../styles/home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { key: 'tops', icon: '👕', title: 'Tops', description: 'Tees, knits, and shirts' },
    { key: 'bottoms', icon: '👖', title: 'Bottoms', description: 'Denim, chinos, and skirts' },
    { key: 'outerwear', icon: '🧥', title: 'Outerwear', description: 'Light layers and jackets' },
    { key: 'accessories', icon: '🎒', title: 'Accessories', description: 'Bags, belts, and more' },
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAllProducts({ limit: 8 });
      setFeatured(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Fresh drop • Weekly</p>
            <h1>Wear the future—built for everyday comfort.</h1>
            <p className="lede">
              Curated essentials with breathable fabrics, modular layers, and silhouettes that move with you.
            </p>
            <div className="hero-pills">
              <span>Free shipping over $75</span>
              <span>Easy 30-day returns</span>
            </div>
            <div className="hero-actions">
              <button onClick={() => navigate('/products')} className="cta-btn">
                Shop the drop
              </button>
              <button onClick={() => navigate('/products?category=outerwear')} className="ghost-btn">
                Explore layers
              </button>
            </div>
            <div className="hero-meta">
              <div>
                <strong>4000+</strong>
                <span>Happy customers</span>
              </div>
              <div>
                <strong>48h</strong>
                <span>Dispatch window</span>
              </div>
              <div>
                <strong>4.9★</strong>
                <span>Quality rated</span>
              </div>
            </div>
          </div>
          <div className="hero-panel">
            <div className="panel-tag">Monochrome capsule</div>
            <div className="panel-body">
              <h3>Layer light, move freely.</h3>
              <p>Breathable knits, weather-ready shells, and modular accessories.</p>
              <ul>
                <li>Featherweight shell jacket</li>
                <li>Structured everyday tote</li>
                <li>Seamless ribbed base layer</li>
              </ul>
              <button onClick={() => navigate('/products?sort=new')}>View lookbook</button>
            </div>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Shop smarter</p>
              <h2>Dialed-in categories</h2>
              <p className="lede">Versatile builds to layer, lounge, and live in.</p>
            </div>
            <button className="ghost-btn" onClick={() => navigate('/products')}>
              Browse all
            </button>
          </div>
          <div className="category-grid">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="category-card"
                onClick={() => navigate(`/products?category=${cat.key}`)}
              >
                <div className="category-icon">{cat.icon}</div>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <div className="section-header centered">
            <div>
              <p className="eyebrow">Editor’s picks</p>
              <h2>Featured products</h2>
              <p className="lede">Built to last, styled to move.</p>
            </div>
          </div>
          {loading ? (
            <p className="loading">Loading products...</p>
          ) : (
            <div className="products-grid">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="view-all">
            <button onClick={() => navigate('/products')} className="view-all-btn">
              View All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
