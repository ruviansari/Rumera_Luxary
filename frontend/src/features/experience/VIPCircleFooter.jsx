import React, { useState } from 'react';
import { ArrowRight, Sparkles, MessageCircle, ShieldCheck, Mail, Heart, CheckCircle2 } from 'lucide-react';

export default function VIPCircleFooter({ onNavigate = null }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4500);
  };

  return (
    <footer className="bg-[#050807] text-[#FAF7F0] border-t border-[#D4AF37]/25 relative overflow-hidden">
      {/* VIP Circle Inner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#0C1512] to-[#070C0A] border border-[#D4AF37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-[#E8CA89] bg-[#D4AF37]/15 border border-[#D4AF37]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Private Reserve Allocation
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF7F0] font-normal mb-3">
            Join the Ruméra Inner Circle
          </h3>

          <p className="text-xs sm:text-sm text-[#8E9B94] max-w-lg mx-auto mb-8 leading-relaxed">
            Receive private allocations of seasonal hydro-distillations, invitations to olfactory tastings,
            and exclusive invitations before flacons enter the public vault.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10B981]/15 border border-[#10B981] text-[#A7F3D0] text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Welcome to the Inner Circle. Private invitation dispatched to your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for private invitations..."
                className="flex-1 px-4 py-3 rounded-full bg-[#070D0B] border border-[#D4AF37]/35 text-xs sm:text-sm text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37] placeholder-[#666]"
              />
              <button
                type="submit"
                className="py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B78B45] text-[#0A0E0C] hover:shadow-[0_4px_18px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-6 mt-6 text-[11px] text-[#A0A0A0]">
            <span>• 100% Non-Alcoholic Formulations</span>
            <span>• Complimentary Pan-India Courier</span>
            <span>• Serialized Authenticity Seals</span>
          </div>
        </div>

        {/* Navigation & Brand Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-t border-[#D4AF37]/15">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/images/rumera_crest_emblem.png" alt="Rumera Emblem" className="w-7 h-7 object-contain" />
              <span className="font-serif text-xl tracking-widest text-[#FAF7F0] font-bold">
                RUMÉRA
              </span>
            </div>
            <p className="text-xs text-[#8E9B94] max-w-sm leading-relaxed mb-4">
              Maison Ruméra Luxury Atra is India’s premier Haute Parfumerie house, preserving royal Awadh Deg-Bhapka distillation in small serialized batches.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/919305988767"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14231F] border border-[#D4AF37]/30 text-xs text-[#E8CA89] hover:border-[#D4AF37]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                WhatsApp Atelier Concierge
              </a>
              <a
                href="https://instagram.com/rumeraluxury"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14231F] border border-[#D4AF37]/30 text-xs text-[#E8CA89] hover:border-[#D4AF37]"
              >
                <svg className="w-3.5 h-3.5 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                @rumeraluxury
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3">
              Olfactory Vaults
            </h4>
            <ul className="space-y-2 text-xs text-[#8E9B94]">
              <li><button onClick={() => onNavigate ? onNavigate('shop') : null} className="hover:text-[#FAF7F0]">Pure Dehn Al Oud</button></li>
              <li><button onClick={() => onNavigate ? onNavigate('shop') : null} className="hover:text-[#FAF7F0]">Kannauj Hydro-Distillates</button></li>
              <li><button onClick={() => onNavigate ? onNavigate('shop') : null} className="hover:text-[#FAF7F0]">Golden Amber & Musk</button></li>
              <li><button onClick={() => onNavigate ? onNavigate('shop') : null} className="hover:text-[#FAF7F0]">Bespoke Gift Coffrets</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3">
              The House
            </h4>
            <ul className="space-y-2 text-xs text-[#8E9B94]">
              <li><button onClick={() => onNavigate ? onNavigate('owner') : null} className="hover:text-[#FAF7F0]">Master Perfumer Profile</button></li>
              <li><button onClick={() => onNavigate ? onNavigate('about') : null} className="hover:text-[#FAF7F0]">Kannauj Heritage Stills</button></li>
              <li><button onClick={() => onNavigate ? onNavigate('free-sample') : null} className="hover:text-[#FAF7F0] text-[#D4AF37]">Complimentary Discovery Sample</button></li>
              <li><button onClick={() => onNavigate ? onNavigate('order-tracking') : null} className="hover:text-[#FAF7F0]">Track Consignment Order</button></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#666] gap-3">
          <span>© 2026 Maison Ruméra Luxury Atra. All Rights Reserved. Master formulation by Er. Rumana Ansari.</span>
          <div className="flex gap-4">
            <span className="hover:text-[#8E9B94] cursor-pointer" onClick={() => onNavigate ? onNavigate('policy') : null}>Privacy Policy</span>
            <span className="hover:text-[#8E9B94] cursor-pointer" onClick={() => onNavigate ? onNavigate('policy') : null}>Terms of Service</span>
            <span className="hover:text-[#8E9B94] cursor-pointer" onClick={() => onNavigate ? onNavigate('about') : null}>Heritage Registry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
