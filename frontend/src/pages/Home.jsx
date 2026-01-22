import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../api/services.js';
import ProductCard from '../components/ProductCard.jsx';
import '../styles/home.css';

export default function Home() {
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeProducts();
  }, []);

  const fetchHomeProducts = async () => {
    try {
      const response = await productAPI.getAllProducts({ limit: 20 });
      const products = response.data.products;
      setCarouselProducts(products.slice(0, 8));
      setBestSellers(products.slice(0, 6));
      setTrending(products.slice(6, 12));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carousel auto-advance
  useEffect(() => {
    if (carouselProducts.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => {
        const maxIndex = Math.max(0, carouselProducts.length - 4);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselProducts.length]);

  const handleCarouselPrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? Math.max(0, carouselProducts.length - 4) : prev - 1));
  };

  const handleCarouselNext = () => {
    setCarouselIndex((prev) => {
      const maxIndex = Math.max(0, carouselProducts.length - 4);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  return (
    <div className="home">
      {/* Carousel Section */}
      <section className="carousel-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Collection</h2>
          </div>

          {!loading && carouselProducts.length > 0 && (
            <div className="carousel-container">
              <button onClick={handleCarouselPrev} className="carousel-btn carousel-btn-prev">
                ❮
              </button>
              
              <div className="carousel-wrapper">
                <div className="carousel-track" style={{
                  transform: `translateX(-${carouselIndex * 25}%)`
                }}>
                  {carouselProducts.map((product) => (
                    <div key={product._id} className="carousel-slide">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleCarouselNext} className="carousel-btn carousel-btn-next">
                ❯
              </button>

              <div className="carousel-dots">
                {Array.from({ length: Math.max(1, carouselProducts.length - 3) }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot ${idx === carouselIndex ? 'active' : ''}`}
                    onClick={() => setCarouselIndex(idx)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="best-sellers-section">
        <div className="container">
          <div className="section-header centered">
            <h2>Best Sellers</h2>
            <p className="lede">Our most loved items by customers</p>
          </div>
          {loading ? (
            <p className="loading">Loading products...</p>
          ) : (
            <div className="products-grid">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <div className="container">
          <div className="section-header centered">
            <h2>Trending Now</h2>
            <p className="lede">What's popular this season</p>
          </div>
          {loading ? (
            <p className="loading">Loading products...</p>
          ) : (
            <div className="products-grid">
              {trending.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Explore More Section */}
      <section className="explore-section">
        <div className="container">
          <div className="explore-content">
            <h2>Explore More</h2>
            <p>Discover our complete collection and find your perfect style.</p>
            <button 
              onClick={() => navigate('/products')} 
              className="explore-btn"
            >
              Browse All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
