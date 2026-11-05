import React from 'react';
import { Heart, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import ProductCard from '../../components/catalog/ProductCard';

export default function WishlistPage({
  wishlist = [],
  onNavigate,
  onAddToCart,
  onToggleWishlist
}) {
  return (
    <div style={{ backgroundColor: '#F8F4EC', minHeight: '85vh', padding: '48px 0 80px' }}>
      <div className="container">
        <button
          onClick={() => onNavigate('shop')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#5C6B63', fontSize: '0.85rem', marginBottom: '28px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} />
          <span>Return to Collection</span>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div className="editorial-sub" style={{ color: '#B78B45' }}>Private Vault</div>
          <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: '#14231F' }}>
            Your Royal Wishlist
          </h1>
          <p style={{ color: '#5C6B63', fontSize: '0.94rem', maxWidth: '580px', margin: '8px auto 0' }}>
            Handpicked formulations and sacred distillations reserved for your discerning collection.
          </p>
        </div>

        {wishlist && wishlist.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {wishlist.map((item) => {
              const prod = item.product || item;
              return (
                <div key={item.id || prod.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <ProductCard
                    product={prod}
                    onSelect={(slug) => onNavigate('product', { slug })}
                    onQuickAdd={(p) => {
                      const variantId = p.variants?.[0]?.id;
                      if (variantId) onAddToCart(variantId, 1);
                    }}
                    isWishlisted={true}
                    onToggleWishlist={onToggleWishlist}
                  />
                  <button
                    onClick={() => {
                      const variantId = prod.variants?.[0]?.id;
                      if (variantId) onAddToCart(variantId, 1);
                    }}
                    className="btn-gold btn-primary"
                    style={{ marginTop: '10px', padding: '12px', borderRadius: '30px', fontSize: '0.86rem' }}
                  >
                    <ShoppingBag size={15} />
                    <span>Move to Cart</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ maxWidth: '480px', margin: '40px auto', backgroundColor: '#FFFFFF', padding: '48px 32px', borderRadius: '12px', border: '1px solid #E5DFC9', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(183, 139, 69, 0.1)', color: '#B78B45', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Heart size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', marginBottom: '8px' }}>
              Your Wishlist is Empty
            </h3>
            <p style={{ color: '#7E9187', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Explore our master collection and tap the gold heart icon to save formulations to your private atelier archive.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="btn-gold btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.88rem' }}
            >
              <span>Explore The Collection</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

