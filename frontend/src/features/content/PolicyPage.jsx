import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

export default function PolicyPage({ slug = 'about', onNavigate }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getContentPage(slug)
      .then((data) => setPage(data))
      .catch((err) => {
        setPage({
          title: slug.replace('-', ' ').toUpperCase(),
          content: 'Details for this policy are managed dynamically by the administration.'
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', backgroundColor: '#F8F4EC', minHeight: '70vh' }}>
        <RefreshCw size={28} color="#B78B45" style={{ animation: 'spin 1.5s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F4EC', minHeight: '100vh', padding: '64px 0 96px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <button
          onClick={() => onNavigate('home')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#5C6B63', fontSize: '0.85rem', marginBottom: '32px' }}
        >
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </button>

        <div style={{ backgroundColor: '#FFFFFF', padding: '48px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
          <div className="editorial-sub">The Royal Charter & Terms</div>
          <h1 className="editorial-title" style={{ fontSize: '2.6rem', color: '#14231F', marginBottom: '24px' }}>
            {page?.title}
          </h1>

          <div style={{ fontSize: '0.98rem', color: '#3A4842', lineHeight: 1.85, whiteSpace: 'pre-line', borderTop: '1px solid #E5DFC9', paddingTop: '24px' }}>
            {page?.content}
          </div>

          <div style={{ marginTop: '40px', padding: '24px', backgroundColor: '#FCFAF6', borderRadius: '6px', border: '1px solid #E5DFC9', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <ShieldCheck size={28} color="#B78B45" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.88rem', color: '#5C6B63', lineHeight: 1.6 }}>
                For bespoke gifting, custom crystal flacon engraving, or private consultations:
                <div style={{ color: '#14231F', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Email:</span>
                  <a href="mailto:ruviansari144@gmail.com" style={{ color: '#14231F', textDecoration: 'underline' }}>
                    ruviansari144@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <a
              href="tel:+919305988767"
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.84rem', textDecoration: 'none' }}
            >
              <span>Call: +91 9305988767</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
