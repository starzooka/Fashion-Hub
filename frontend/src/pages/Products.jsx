import { useState, useEffect } from 'react';
import { productAPI } from '../api/services.js';
import ProductCard from '../components/ProductCard.jsx';
import '../styles/products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('');
  const [inStock, setInStock] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Temporary filter states for modal
  const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);
  const [tempSortBy, setTempSortBy] = useState('');
  const [tempInStock, setTempInStock] = useState(false);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [tempSelectedSizes, setTempSelectedSizes] = useState([]);

  const categories = ['Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Footwear'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy, inStock]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts({
        page,
        limit: 12,
      });
      setProducts(response.data.products);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilters = () => {
    setTempPriceRange(priceRange);
    setTempSortBy(sortBy);
    setTempInStock(inStock);
    setTempSelectedCategories(selectedCategories);
    setTempSelectedSizes(selectedSizes);
    setShowFilters(true);
  };

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
    setSortBy(tempSortBy);
    setInStock(tempInStock);
    setSelectedCategories(tempSelectedCategories);
    setSelectedSizes(tempSelectedSizes);
    setShowFilters(false);
  };

  const handleDiscardFilters = () => {
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setSortBy('');
    setInStock(false);
    setSelectedCategories([]);
    setSelectedSizes([]);
  };

  const hasActiveFilters = sortBy || inStock || priceRange[0] !== 0 || priceRange[1] !== 1000 || selectedCategories.length > 0 || selectedSizes.length > 0;

  const filteredProducts = products.filter((product) => {
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const stockMatch = !inStock || product.stock > 0;
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const sizeMatch = selectedSizes.length === 0 || (product.sizes && product.sizes.some(size => selectedSizes.includes(size)));
    return priceMatch && stockMatch && categoryMatch && sizeMatch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="products-page">
      <div className="container">
        {/* Filters Button */}
        <div className="filters-header">
          <button onClick={handleOpenFilters} className="filters-btn">
            🔍 Filters & Sort
          </button>
          {hasActiveFilters && (
            <>
              <button onClick={handleResetFilters} className="reset-filters-btn">
                ✕ Reset All Filters
              </button>
              <span className="active-filters">Active filters applied</span>
            </>
          )}
        </div>

        {/* Filters Modal */}
        {showFilters && (
          <>
            <div className="filter-overlay" onClick={handleDiscardFilters}></div>
            <div className="filter-modal">
              <div className="filter-modal-header">
                <h3>Filters & Sort</h3>
                <button onClick={handleDiscardFilters} className="close-btn">✕</button>
              </div>

              <div className="filter-modal-body">
                <div className="filter-group">
                  <label>Sort By</label>
                  <select
                    value={tempSortBy}
                    onChange={(e) => setTempSortBy(e.target.value)}
                    className="category-select"
                  >
                    <option value="">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Price Range</label>
                  <div className="price-inputs">
                    <div className="price-input-group">
                      <label className="price-input-label">Min</label>
                      <input
                        type="number"
                        min="0"
                        max={tempPriceRange[1]}
                        value={tempPriceRange[0]}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(parseInt(e.target.value) || 0, tempPriceRange[1]));
                          setTempPriceRange([val, tempPriceRange[1]]);
                        }}
                        className="price-number-input"
                      />
                    </div>
                    <span className="price-separator">-</span>
                    <div className="price-input-group">
                      <label className="price-input-label">Max</label>
                      <input
                        type="number"
                        min={tempPriceRange[0]}
                        max="10000"
                        value={tempPriceRange[1]}
                        onChange={(e) => {
                          const val = Math.max(tempPriceRange[0], parseInt(e.target.value) || 0);
                          setTempPriceRange([tempPriceRange[0], val]);
                        }}
                        className="price-number-input"
                      />
                    </div>
                  </div>
                  <div className="price-range">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={tempPriceRange[0]}
                      onChange={(e) => setTempPriceRange([parseInt(e.target.value), Math.max(parseInt(e.target.value), tempPriceRange[1])])}
                      className="range-input"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={tempPriceRange[1]}
                      onChange={(e) => setTempPriceRange([Math.min(tempPriceRange[0], parseInt(e.target.value)), parseInt(e.target.value)])}
                      className="range-input"
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label>Categories</label>
                  <div className="checkbox-grid">
                    {categories.map((category) => (
                      <label key={category} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={tempSelectedCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTempSelectedCategories([...tempSelectedCategories, category]);
                            } else {
                              setTempSelectedCategories(tempSelectedCategories.filter(c => c !== category));
                            }
                          }}
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Sizes</label>
                  <div className="size-grid">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${tempSelectedSizes.includes(size) ? 'active' : ''}`}
                        onClick={() => {
                          if (tempSelectedSizes.includes(size)) {
                            setTempSelectedSizes(tempSelectedSizes.filter(s => s !== size));
                          } else {
                            setTempSelectedSizes([...tempSelectedSizes, size]);
                          }
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={tempInStock}
                      onChange={(e) => setTempInStock(e.target.checked)}
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="filter-modal-footer">
                <button onClick={handleDiscardFilters} className="discard-btn">
                  Discard
                </button>
                <button onClick={handleApplyFilters} className="apply-btn">
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}

        {/* Products Grid */}
        <div className="products-section">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="page-btn"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {Math.ceil(total / 12)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(total / 12)}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="no-products">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
