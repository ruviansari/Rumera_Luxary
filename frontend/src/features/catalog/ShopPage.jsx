import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Search, RefreshCw, X } from 'lucide-react';
import ProductCard from '../../components/catalog/ProductCard';
import { api } from '../../services/api';

export default function ShopPage({ initialParams = {}, onSelectProduct, onQuickAdd, wishlist = [], onToggleWishlist }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter States
  const [search, setSearch] = useState(initialParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || '');
  const [fragranceFamily, setFragranceFamily] = useState('');
  const [ordering, setOrdering] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    // Load Categories
    api.getCategories().then((data) => setCategories(data)).catch(console.error);
  }, []);

  // Sync with incoming navigation params (e.g. from Header search or Category links)
  useEffect(() => {
    if (initialParams.search !== undefined) {
      setSearch(initialParams.search);
    }
    if (initialParams.category !== undefined) {
      setSelectedCategory(initialParams.category);
    }
  }, [initialParams.search, initialParams.category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (fragranceFamily) params.fragrance_family = fragranceFamily;
      if (ordering) params.ordering = ordering;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;

      const data = await api.getProducts(params);
      if (data.results) {
        setProducts(data.results);
        setTotalCount(data.count || data.results.length);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalCount(data.length);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, fragranceFamily, ordering]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setFragranceFamily('');
    setOrdering('newest');
    setMinPrice('');
    setMaxPrice('');
    api.getProducts().then((res) => setProducts(res.results || []));
  };

  return (
    <div style={{ backgroundColor: '#F8F4EC', minHeight: '100vh', padding: '48px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="editorial-sub">The Royal Dispensary</div>
          <h1 className="editorial-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
            The Complete Atra Collection
          </h1>
          <p style={{ color: '#5C6B63', fontSize: '0.92rem', marginTop: '6px' }}>
            Pure attars, wild vintage Dehn Al Oud, and fine Extrait concentrations distilled in India.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar" style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="btn-secondary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px' }}
          >
            <SlidersHorizontal size={16} color="#B78B45" />
            <span>{mobileFiltersOpen ? 'Hide Filters' : 'Filter & Sort Catalog'}</span>
            {(selectedCategory || fragranceFamily || minPrice || maxPrice || search) && (
              <span className="badge-gold" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>Active</span>
            )}
          </button>
        </div>

        {/* Filter Bar Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px', alignItems: 'flex-start' }} className="shop-grid-layout">
          {/* Left Column: Filter Sidebar */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }} className={`filters-sidebar ${mobileFiltersOpen ? 'mobile-show' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #EBE4D5', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#14231F' }}>
                <SlidersHorizontal size={17} color="#B78B45" />
                <span>Filters & Curations</span>
              </div>
              <button onClick={handleResetFilters} style={{ fontSize: '0.74rem', color: '#963832', fontWeight: 600 }}>
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#14231F', marginBottom: '12px' }}>
                Olfactory Categories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                  />
                  <span>All Categories ({totalCount})</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(cat.slug)}
                    />
                    <span>{cat.name} ({cat.product_count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fragrance Family Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#14231F', marginBottom: '12px' }}>
                Fragrance Accord
              </h4>
              <select
                value={fragranceFamily}
                onChange={(e) => setFragranceFamily(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #D8D0BC', borderRadius: '4px', backgroundColor: '#FCFAF6', color: '#14231F' }}
              >
                <option value="">All Accords</option>
                <option value="Oud">Agarwood / Dehn Al Oud</option>
                <option value="Floral">Noble Floral / Rose</option>
                <option value="Amber">Warm Amber & Saffron</option>
                <option value="Musk">Royal Botanical Musk</option>
                <option value="Woody">Sandalwood & Leather</option>
              </select>
            </div>

            {/* Price Filter */}
            <form onSubmit={handlePriceApply} style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#14231F', marginBottom: '12px' }}>
                Price Range (INR)
              </h4>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: '50%', padding: '6px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '50%', padding: '6px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                />
              </div>
              <button type="submit" className="btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '0.78rem' }}>
                Apply Range
              </button>
            </form>
          </div>

          {/* Right Column: Search bar, Sort & Product Grid */}
          <div>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E5DFC9', marginBottom: '24px' }}>
              {/* Search Box */}
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
                <input
                  type="text"
                  placeholder="Search attars, notes, SKUs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
                  <Search size={15} />
                </button>
              </form>

              {/* Sort Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#5C6B63', whiteSpace: 'nowrap' }}>Sort by:</span>
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #D8D0BC', borderRadius: '4px', backgroundColor: '#FCFAF6', fontSize: '0.85rem', color: '#14231F' }}
                >
                  <option value="newest">Newest Releases</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Active Search & Filter Indicator Bar */}
            {(search || selectedCategory) && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', backgroundColor: '#FAF8F4', borderRadius: '8px', border: '1px solid #B78B45', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#14231F' }}>
                  {search && (
                    <span>
                      Results for: <strong style={{ color: '#B78B45', fontSize: '0.92rem' }}>"{search}"</strong>
                    </span>
                  )}
                  {selectedCategory && (
                    <span style={{ fontSize: '0.78rem', color: '#5C6B63', backgroundColor: 'rgba(183,139,69,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                      Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                    </span>
                  )}
                  <span style={{ fontSize: '0.76rem', color: '#7E9187' }}>({totalCount} creations found)</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#963832', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  <X size={13} />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '72px 0' }}>
                <RefreshCw size={28} color="#B78B45" style={{ animation: 'spin 1.5s linear infinite' }} />
                <p style={{ marginTop: '12px', color: '#5C6B63', fontSize: '0.88rem' }}>Unveiling artisanal formulations...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 20px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5DFC9' }}>
                <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(183, 139, 69, 0.12)', marginBottom: '14px' }}>
                  <Search size={28} color="#B78B45" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', marginBottom: '8px' }}>
                  No matching attars found
                </h3>
                <p style={{ color: '#5C6B63', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Try adjusting your filter criteria or search keyword.
                </p>
                <button onClick={handleResetFilters} className="btn-primary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="products-responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                {products.map((product) => {
                  const isWishlisted = wishlist.some(item => (item.product?.id || item.product_id || item.id) === product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(slug) => onSelectProduct(slug)}
                      onQuickAdd={onQuickAdd}
                      isWishlisted={isWishlisted}
                      onToggleWishlist={onToggleWishlist}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .mobile-filter-bar { display: none; }
        @media (max-width: 860px) {
          .mobile-filter-bar { display: block; }
          .shop-grid-layout { grid-template-columns: 1fr !important; gap: 20px !important; }
          .filters-sidebar { display: none; }
          .filters-sidebar.mobile-show { display: block !important; margin-bottom: 24px; }
        }
        @media (max-width: 580px) {
          .products-responsive-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 380px) {
          .products-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
