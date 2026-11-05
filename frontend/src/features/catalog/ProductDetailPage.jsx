import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, Droplets, Clock, Truck, ArrowLeft, RefreshCw, CheckCircle, Heart, Star, Plus, Check, Sparkles, Feather, Award, Crown } from 'lucide-react';
import { api } from '../../services/api';
import ProductCard from '../../components/catalog/ProductCard';

const BESPOKE_PRODUCT_IMAGES = {
  'royal-quadrumvirate-gift-coffret': '/images/showcase/royal_trio_collection.jpg',
  'gulab-e-khas-ruh-gulab': '/images/showcase/artisanal_gold_cage_front.jpg',
  'rooh-al-assam-vintage': '/images/showcase/royal_emerald_flacon.jpg',
  'rumera-white-oud-extrait': '/images/rumera_white_oud_hero.jpg',
  'kashmir-shamama-tul-amber': '/images/showcase/royal_amber_flacon.jpg',
  'musk-al-sultani-white-musk': '/images/showcase/artisanal_gold_cage_angle.jpg',
  'oud-imperial-extrait-de-parfum': '/images/showcase/royal_amber_flacon.jpg',
};

export default function ProductDetailPage({ slug, onBack, onAddToCart, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewsData, setReviewsData] = useState({ results: [], average_rating: 5.0, review_count: 0 });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', city: '', rating: 5, headline: '', comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const loadReviews = () => {
    api.getProductReviews(slug)
      .then(setReviewsData)
      .catch(console.warn);
  };

  useEffect(() => {
    setLoading(true);
    api.getProductDetail(slug)
      .then((data) => {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        const bespoke = BESPOKE_PRODUCT_IMAGES[slug];
        if (bespoke) {
          setActiveImage(bespoke);
        } else if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0].image_url);
        } else if (data.primary_image) {
          setActiveImage(data.primary_image);
        }

        api.getWishlist()
          .then((res) => {
            const list = res.results || res || [];
            const exists = list.some(item => (item.product?.id || item.product_id || item.id) === data.id);
            setIsWishlisted(exists);
          })
          .catch(() => {});
      })
      .catch((err) => {
        setError(err.message || 'Product not found.');
      })
      .finally(() => setLoading(false));

    loadReviews();

    api.getProducts()
      .then((res) => {
        const list = res.results || res || [];
        setRelatedProducts(list.filter(p => p.slug !== slug).slice(0, 3));
      })
      .catch(() => {});
  }, [slug]);

  const handleToggleWishlist = async () => {
    if (!product) return;
    try {
      const res = await api.toggleWishlist(product.id);
      setIsWishlisted(res.is_wishlisted);
    } catch (e) {
      alert(e.message || "Failed to update wishlist.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    setReviewSubmitting(true);
    try {
      await api.submitProductReview(slug, reviewForm);
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewSuccess(false);
        setShowReviewModal(false);
        setReviewForm({ name: '', city: '', rating: 5, headline: '', comment: '' });
        loadReviews();
      }, 1500);
    } catch (err) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '90px 20px', backgroundColor: '#F8F4EC', minHeight: '75vh' }}>
        <RefreshCw size={26} color="#B78B45" style={{ animation: 'spin 1.5s linear infinite' }} />
        <p style={{ marginTop: '14px', color: '#5C6B63', fontSize: '0.88rem', letterSpacing: '0.04em' }}>
          Decanting fragrance profile...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#F8F4EC', minHeight: '75vh' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#14231F', marginBottom: '10px' }}>
          {error || 'Creation Not Found'}
        </h2>
        <button onClick={onBack} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
          Return to Collection
        </button>
      </div>
    );
  }

  const inStock = selectedVariant ? selectedVariant.stock_quantity > 0 : false;
  const isLowStock = selectedVariant && selectedVariant.stock_quantity > 0 && selectedVariant.stock_quantity <= selectedVariant.low_stock_threshold;

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;
    onAddToCart(selectedVariant.id, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const scrollToReviews = () => {
    const el = document.getElementById('connoisseur-reviews-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#F8F4EC', minHeight: '100vh', padding: '20px 0 64px' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

        {/* 1. Sleek Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={onBack}
            className="back-to-shop-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#14231F',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8D0BC',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={13} />
            <span>Back to Collection</span>
          </button>

          <div style={{ fontSize: '0.72rem', color: '#7E9187', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ cursor: 'pointer', color: '#B78B45' }} onClick={() => onNavigate('home')}>The House</span>
            <span>/</span>
            <span style={{ cursor: 'pointer', color: '#B78B45' }} onClick={onBack}>Collection</span>
            <span>/</span>
            <span style={{ color: '#14231F', fontWeight: 600 }}>{product.name}</span>
          </div>
        </div>

        {/* 2. COMPACT HERO SECTION (Buy Box + Flacon Image — Fully Visible on 1 Screen) */}
        <div
          className="product-hero-compact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            gap: '32px',
            alignItems: 'start',
            marginBottom: '36px',
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '14px',
            border: '1px solid #E5DFC9',
            boxShadow: '0 8px 30px rgba(20, 35, 31, 0.04)'
          }}
        >
          {/* Left Column: Compact Visual Frame */}
          <div>
            <div
              style={{
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #E8E2D5',
                backgroundColor: '#FAF8F4',
                height: '350px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={activeImage || 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=800&q=85'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {product.is_featured && (
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge-gold" style={{ padding: '4px 10px', fontSize: '0.64rem', letterSpacing: '0.1em' }}>
                    👑 Rare Reserve
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image_url)}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: activeImage === img.image_url ? '2px solid #B78B45' : '1px solid #E5DFC9',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* 3 Micro Seal Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '12px' }}>
              <div style={{ padding: '8px 4px', backgroundColor: '#FAF8F4', borderRadius: '6px', border: '1px solid #EAE5D8', textAlign: 'center' }}>
                <Droplets size={14} color="#B78B45" style={{ margin: '0 auto 3px' }} />
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#14231F' }}>Alcohol Free</div>
                <div style={{ fontSize: '0.58rem', color: '#7E9187' }}>100% Pure</div>
              </div>
              <div style={{ padding: '8px 4px', backgroundColor: '#FAF8F4', borderRadius: '6px', border: '1px solid #EAE5D8', textAlign: 'center' }}>
                <Award size={14} color="#B78B45" style={{ margin: '0 auto 3px' }} />
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#14231F' }}>Hydro-Distilled</div>
                <div style={{ fontSize: '0.58rem', color: '#7E9187' }}>Copper Deg</div>
              </div>
              <div style={{ padding: '8px 4px', backgroundColor: '#FAF8F4', borderRadius: '6px', border: '1px solid #EAE5D8', textAlign: 'center' }}>
                <Truck size={14} color="#B78B45" style={{ margin: '0 auto 3px' }} />
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#14231F' }}>Free Express</div>
                <div style={{ fontSize: '0.58rem', color: '#7E9187' }}>Pan-India</div>
              </div>
            </div>
          </div>

          {/* Right Column: Compact & Regal Buy Box */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B78B45', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Crown size={12} color="#D4AF37" />
                <span>{product.category?.name || 'Haute Parfumerie'}</span>
              </span>
              <span style={{ fontSize: '0.66rem', color: '#8A9992', letterSpacing: '0.06em', fontFamily: 'monospace' }}>
                SKU: {selectedVariant ? selectedVariant.sku : product.sku}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.55rem, 2.3vw, 2.05rem)', color: '#14231F', lineHeight: 1.2, fontWeight: 600, margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.82rem', color: '#687870', fontStyle: 'italic' }}>
                {product.concentration || 'Pure Artisanal Perfume Oil Extract'}
              </div>

              <div
                onClick={scrollToReviews}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', backgroundColor: '#FAF8F4', padding: '3px 10px', borderRadius: '14px', border: '1px solid #ECE7DC' }}
                title="Click to view connoisseur appraisals"
              >
                <div style={{ display: 'flex', color: '#D4AF37' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#14231F' }}>
                  {reviewsData.average_rating || 5.0}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#8F6627', fontWeight: 600 }}>
                  • {reviewsData.review_count || reviewsData.results?.length || 1} Appraisals
                </span>
              </div>
            </div>

            {/* Regal Pricing Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: '#FAF8F4',
                borderRadius: '8px',
                border: '1px solid #EBE5D8',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '1.85rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#14231F', letterSpacing: '-0.02em' }}>
                  ₹{selectedVariant ? Number(selectedVariant.price).toLocaleString('en-IN') : '0'}
                </span>
                {selectedVariant?.compare_at_price && (
                  <>
                    <span style={{ fontSize: '1.05rem', color: '#9AA7A0', textDecoration: 'line-through' }}>
                      ₹{Number(selectedVariant.compare_at_price).toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.66rem', color: '#8F6627', backgroundColor: 'rgba(183, 139, 69, 0.14)', border: '1px solid rgba(183, 139, 69, 0.35)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Save ₹{Number(selectedVariant.compare_at_price - selectedVariant.price).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#1E5E41', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Truck size={13} color="#1E5E41" />
                <span>Complimentary Express Courier</span>
              </div>
            </div>

            {/* Volume Size Selection */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#14231F' }}>
                    Reserve Presentation & Flacon:
                  </label>
                  <span style={{ fontSize: '0.66rem', color: '#8A9992' }}>100% Non-Alcoholic</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        style={{
                          padding: '9px 16px',
                          borderRadius: '8px',
                          border: isSelected ? '1.5px solid #D4AF37' : '1px solid #DCD6C7',
                          backgroundColor: isSelected ? '#12221D' : '#FFFFFF',
                          color: isSelected ? '#FAF7F0' : '#14231F',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 4px 14px rgba(18, 34, 29, 0.25), 0 0 10px rgba(212, 175, 55, 0.3)' : '0 1px 4px rgba(0,0,0,0.03)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        {isSelected && <Crown size={12} color="#D4AF37" />}
                        <span>{v.volume_size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Availability */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
              {inStock ? (
                <>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#25D366', boxShadow: '0 0 8px #25D366' }}></span>
                  <span style={{ color: '#1B4D36', fontWeight: 600 }}>
                    {isLowStock
                      ? `⚡ Only ${selectedVariant.stock_quantity} reserve flacons remaining in this batch`
                      : 'In Stock • Hand-Bottled & Sealed for Immediate Dispatch'}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D9534F' }}></span>
                  <span style={{ color: '#D9534F', fontWeight: 600 }}>Currently Reserved / Out of Stock</span>
                </>
              )}
            </div>

            {/* Acquisition Action Bar (Stepper + CTA + Wishlist) */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', alignItems: 'center' }}>
              {/* Tactile Luxury Stepper */}
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #D4AF37', borderRadius: '28px', backgroundColor: '#FAF8F4', height: '46px', padding: '0 4px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '32px', height: '100%', color: '#14231F', fontSize: '1.1rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Decrease"
                >
                  -
                </button>
                <span style={{ padding: '0 8px', fontSize: '0.94rem', fontWeight: 800, minWidth: '24px', textAlign: 'center', color: '#14231F', fontFamily: 'var(--font-serif)' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '32px', height: '100%', color: '#14231F', fontSize: '1.1rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Increase"
                >
                  +
                </button>
              </div>

              {/* Royal Crown Gold CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="royal-acquire-btn"
                style={{
                  flex: 1,
                  height: '46px',
                  padding: '0 24px',
                  fontSize: '0.84rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  borderRadius: '28px',
                  background: 'linear-gradient(135deg, #C59B4E 0%, #E8CA89 35%, #B78B45 70%, #9C7232 100%)',
                  color: '#0B1613',
                  border: '1px solid #F0D495',
                  boxShadow: '0 8px 24px rgba(183, 139, 69, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.75)',
                  cursor: inStock ? 'pointer' : 'not-allowed',
                  opacity: inStock ? 1 : 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '9px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Crown size={16} color="#0B1613" />
                <span>{inStock ? 'Acquire Flacon' : 'Sold Out'}</span>
              </button>

              {/* Royal Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                title={isWishlisted ? "In Your Royal Wishlist" : "Save to Royal Wishlist"}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: isWishlisted ? '2px solid #D4AF37' : '1.5px solid #D8D0BC',
                  backgroundColor: isWishlisted ? 'rgba(183, 139, 69, 0.16)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <Heart size={18} color="#B78B45" fill={isWishlisted ? "#D4AF37" : "none"} />
              </button>
            </div>

            {/* Added Notice Feedback */}
            {addedNotice && (
              <div style={{ padding: '10px 16px', backgroundColor: '#14231F', color: '#B78B45', border: '1px solid #B78B45', borderRadius: '6px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
                <CheckCircle size={16} color="#B78B45" />
                <span>Flacon added to your Olfactory Cart.</span>
              </div>
            )}

            {/* Reassurance Certificate Card */}
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#FCFAF6',
                borderRadius: '8px',
                border: '1px solid rgba(183, 139, 69, 0.35)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                boxShadow: 'inset 0 1px 3px rgba(183, 139, 69, 0.05)'
              }}
            >
              <Award size={24} color="#B78B45" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.74rem', color: '#4A5B53', lineHeight: 1.5 }}>
                <strong style={{ color: '#14231F', letterSpacing: '0.02em' }}>Maison Ruméra Royal Guarantee:</strong> Formulated & signed by Master Perfumer Er. Rumana Ansari. Hydro-distilled in Kannauj copper degs with zero synthetic adulteration.
              </div>
            </div>
          </div>
        </div>

        {/* 3. THE OLFACTORY ARCHITECTURE (Notes Pyramid — Compact Full Width) */}
        {(product.top_notes || product.heart_notes || product.base_notes) && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '28px 24px', border: '1px solid #E5DFC9', marginBottom: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto 22px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#B78B45', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                <Droplets size={13} />
                <span>Deconstructed Olfactory Symphony</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#14231F', margin: 0 }}>
                The Olfactory Architecture
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {product.top_notes && (
                <div style={{ backgroundColor: '#FAF8F4', borderRadius: '8px', padding: '18px', border: '1px solid #EAE5D8', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#B78B45' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B78B45', fontWeight: 700 }}>
                      Top Opening
                    </span>
                    <span style={{ fontSize: '0.62rem', backgroundColor: 'rgba(183, 139, 69, 0.15)', color: '#8F6627', padding: '2px 6px', borderRadius: '8px', fontWeight: 600 }}>
                      15 - 45 Mins
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#2F3E37', lineHeight: 1.5, fontWeight: 500 }}>
                    {product.top_notes}
                  </div>
                </div>
              )}

              {product.heart_notes && (
                <div style={{ backgroundColor: '#FAF8F4', borderRadius: '8px', padding: '18px', border: '1px solid #EAE5D8', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#1D332D' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1D332D', fontWeight: 700 }}>
                      Heart Accord
                    </span>
                    <span style={{ fontSize: '0.62rem', backgroundColor: 'rgba(29, 51, 45, 0.12)', color: '#1D332D', padding: '2px 6px', borderRadius: '8px', fontWeight: 600 }}>
                      2 - 6 Hours
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#2F3E37', lineHeight: 1.5, fontWeight: 500 }}>
                    {product.heart_notes}
                  </div>
                </div>
              )}

              {product.base_notes && (
                <div style={{ backgroundColor: '#FAF8F4', borderRadius: '8px', padding: '18px', border: '1px solid #EAE5D8', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#0D1714' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0D1714', fontWeight: 700 }}>
                      Lingering Base
                    </span>
                    <span style={{ fontSize: '0.62rem', backgroundColor: 'rgba(13, 23, 20, 0.12)', color: '#0D1714', padding: '2px 6px', borderRadius: '8px', fontWeight: 600 }}>
                      12 - 36+ Hours
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#2F3E37', lineHeight: 1.5, fontWeight: 500 }}>
                    {product.base_notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. ARTISANAL STORY & RITUAL (2-Column Balanced Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '24px', border: '1px solid #E5DFC9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B78B45', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              <Feather size={14} />
              <span>Master Distiller's Journal</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#14231F', marginBottom: '10px' }}>
              Artisanal Profile & Heritage
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#4A5B53', lineHeight: 1.7, whiteSpace: 'pre-line', margin: 0 }}>
              {product.description}
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '24px', border: '1px solid #E5DFC9', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B78B45', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                <Clock size={14} />
                <span>The Royal Anointment</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#14231F', marginBottom: '8px' }}>
                Application Ritual
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#5C6B63', lineHeight: 1.6, margin: 0 }}>
                {product.usage_instructions || "Using the glass wand, dab a drop onto pulse points: inner wrists, collar bones, and neck. Touch wrists together gently without rubbing to preserve the delicate top notes."}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #EFEAE0', paddingTop: '14px' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#14231F', fontWeight: 700, marginBottom: '4px' }}>
                Botanical Ingredients & Purity:
              </div>
              <p style={{ fontSize: '0.78rem', color: '#7E9187', lineHeight: 1.5, margin: 0 }}>
                {product.ingredients || "100% Pure Natural Attar. Steam-distilled floral rooh, wild Assam agarwood extract, aged ambergris tincture, and sacred Mysore sandalwood. 0% alcohol and synthetic fixatives."}
              </p>
            </div>
          </div>
        </div>

        {/* 5. CONNOISSEUR REVIEWS & APPRAISALS (Compact Full Width) */}
        <div id="connoisseur-reviews-section" style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '28px 24px', border: '1px solid #E5DFC9', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px', borderBottom: '1px solid #EFEAE0', paddingBottom: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#B78B45', fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                <Sparkles size={13} />
                <span>Patron Registry</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#14231F', margin: 0 }}>
                Connoisseur Reviews & Appraisals
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <div style={{ display: 'flex', color: '#D4AF37' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <span style={{ fontSize: '0.95rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#14231F' }}>
                  {reviewsData.average_rating || 5.0} / 5.0
                </span>
                <span style={{ fontSize: '0.74rem', color: '#7E9187' }}>
                  ({reviewsData.review_count || reviewsData.results?.length || 1} appraisals)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="btn-gold btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.76rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Plus size={14} />
              <span>Leave Review</span>
            </button>
          </div>

          {reviewsData.results && reviewsData.results.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {reviewsData.results.map((rev) => (
                <div key={rev.id} style={{ backgroundColor: '#FAF8F4', borderRadius: '8px', padding: '18px', border: '1px solid #EAE5D8', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#14231F' }}>{rev.name}</span>
                      {rev.city && (
                        <span style={{ fontSize: '0.68rem', color: '#7E9187', backgroundColor: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', border: '1px solid #E5DFC9' }}>
                          📍 {rev.city}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', color: '#D4AF37' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} fill={s <= rev.rating ? "#D4AF37" : "none"} color="#D4AF37" />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', color: '#2A684C', fontWeight: 600, marginBottom: '6px' }}>
                    <Check size={11} />
                    <span>Verified Royal Patron</span>
                  </div>

                  {rev.headline && (
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.94rem', color: '#14231F', fontWeight: 600, marginBottom: '6px' }}>
                      "{rev.headline}"
                    </div>
                  )}

                  <p style={{ fontSize: '0.8rem', color: '#5C6B63', lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#FAF8F4', borderRadius: '8px', border: '1px solid #EAE5D8' }}>
              <p style={{ color: '#7E9187', fontSize: '0.84rem', margin: '0 0 12px' }}>
                Be the first royal patron to review this exquisite formulation.
              </p>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="btn-secondary"
                style={{ padding: '6px 16px', fontSize: '0.76rem' }}
              >
                Submit First Appraisal
              </button>
            </div>
          )}
        </div>

        {/* 6. CURATED PAIRINGS (Compact Related Flacons) */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ color: '#B78B45', fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                Curated Pairings
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', margin: 0 }}>
                You May Also Admire
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={(slug) => onNavigate('product', { slug })}
                  onQuickAdd={(varId) => onAddToCart(varId, 1)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          </div>
        )}

        {/* Review Submission Modal */}
        {showReviewModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(10, 20, 17, 0.82)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #B78B45', maxWidth: '480px', width: '100%', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div className="editorial-sub" style={{ color: '#B78B45', marginBottom: '2px', fontSize: '0.68rem' }}>Patron Appraisal</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#14231F', margin: 0 }}>
                    Review {product.name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#8E9B94', padding: '2px 6px' }}
                >
                  ×
                </button>
              </div>

              {reviewSuccess ? (
                <div style={{ padding: '20px', backgroundColor: 'rgba(42, 104, 76, 0.12)', color: '#1B4D36', borderRadius: '8px', textAlign: 'center' }}>
                  <CheckCircle size={30} style={{ margin: '0 auto 8px', color: '#2A684C' }} />
                  <h4 style={{ margin: 0, fontSize: '0.98rem' }}>Review Recorded</h4>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px', color: '#5C6B63' }}>
                    Your evaluation has been added to the master olfactory registry.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#14231F', marginBottom: '3px' }}>Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder="e.g. Tariq Al-Mansoor"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#14231F', marginBottom: '3px' }}>City / Country</label>
                      <input
                        type="text"
                        value={reviewForm.city}
                        onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                        placeholder="e.g. Dubai, UAE"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#14231F', marginBottom: '3px' }}>Rating *</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                        >
                          <Star size={20} fill={star <= reviewForm.rating ? '#D4AF37' : 'none'} color="#D4AF37" />
                        </button>
                      ))}
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B78B45', marginLeft: '6px' }}>{reviewForm.rating} Stars</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#14231F', marginBottom: '3px' }}>Review Headline</label>
                    <input
                      type="text"
                      value={reviewForm.headline}
                      onChange={(e) => setReviewForm({ ...reviewForm, headline: e.target.value })}
                      placeholder="e.g. Magnificent longevity and regal sillage"
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#14231F', marginBottom: '3px' }}>Olfactory Impressions *</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Describe the projection, sillage, dry-down, and emotional character..."
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      style={{ padding: '7px 14px', border: '1px solid #D8D0BC', borderRadius: '20px', background: 'transparent', cursor: 'pointer', fontSize: '0.78rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="btn-gold btn-primary"
                      style={{ padding: '7px 18px', fontSize: '0.78rem', cursor: reviewSubmitting ? 'not-allowed' : 'pointer' }}
                    >
                      {reviewSubmitting ? 'Recording...' : 'Publish Appraisal'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .royal-acquire-btn {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .royal-acquire-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 12px 30px rgba(183, 139, 69, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.9) !important;
          filter: brightness(1.06);
        }
        .royal-acquire-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .back-to-shop-btn:hover {
          background-color: #14231F !important;
          color: #FAF7F0 !important;
          border-color: #14231F !important;
          transform: translateX(-2px);
        }

        @media (max-width: 820px) {
          .product-hero-compact-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
