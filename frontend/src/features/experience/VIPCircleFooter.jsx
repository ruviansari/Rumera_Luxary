import React, { useState } from 'react';
import { ArrowRight, Sparkles, MessageCircle, ShieldCheck, Mail, Heart, CheckCircle2 } from 'lucide-react';

export default function VIPCircleFooter({ onNavigate = () => {} }) {
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
    <footer className="bg-[#F8F5EE] text-[#1C1B1A] border-t border-[#EAE4D9] relative overflow-hidden select-none">
      {/* VIP Circle Inner Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 relative z-10">
        <div className="rounded-3xl p-8 sm:p-14 bg-white border border-[#EAE4D9] shadow-[0_20px_50px_rgba(40,30,15,0.06)] text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-[#9A7B38] bg-[#C5A059]/12 border border-[#C5A059]/25 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Private Reserve Allocation
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl text-[#1C1B1A] font-normal mb-3">
            Join the Ruméra Inner Circle
          </h3>

          <p className="text-xs sm:text-sm text-[#635F59] max-w-lg mx-auto mb-8 leading-relaxed">
            Subscribers receive first access to serialized seasonal harvests, private vault decants, and invitations to masterclass ateliers.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You are now inscribed in the private registry. Welcome.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E90]" />
                <input
                  type="email"
                  placeholder="Enter your private email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#FAF8F5] border border-[#EAE4D9] focus:border-[#C5A059] text-xs sm:text-sm text-[#1C1B1A] outline-none shadow-sm transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1C1B1A] hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-all shrink-0 cursor-pointer shadow-sm"
              >
                Inscribe
              </button>
            </form>
          )}
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-t border-[#EAE4D9]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/images/rumera_crest_emblem.png" alt="Rumera Emblem" className="w-7 h-7 object-contain" />
              <span className="font-serif text-xl tracking-widest text-[#1C1B1A] font-bold">
                RUMÉRA
              </span>
            </div>
            <p className="text-xs text-[#635F59] max-w-sm leading-relaxed mb-4">
              Maison Ruméra Luxury Atra is India’s premier Haute Parfumerie house, preserving royal Awadh Deg-Bhapka distillation in small serialized batches.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://wa.me/919305988767"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE4D9] text-xs text-[#1C1B1A] hover:border-[#C5A059] shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Concierge</span>
              </a>
              <a
                href="https://instagram.com/rumeraluxury"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE4D9] text-xs text-[#1C1B1A] hover:border-[#C5A059] shadow-xs"
              >
                <svg className="w-3.5 h-3.5 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>@rumeraluxury</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#9A7B38] mb-3">
              Olfactory Vaults
            </h4>
            <ul className="space-y-2 text-xs text-[#635F59]">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-[#1C1B1A] cursor-pointer">Pure Dehn Al Oud</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-[#1C1B1A] cursor-pointer">Kannauj Hydro-Distillates</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-[#1C1B1A] cursor-pointer">Golden Amber & Musk</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-[#1C1B1A] cursor-pointer">Bespoke Gift Coffrets</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#9A7B38] mb-3">
              The House
            </h4>
            <ul className="space-y-2 text-xs text-[#635F59]">
              <li><button onClick={() => onNavigate('owner')} className="hover:text-[#1C1B1A] cursor-pointer">Master Perfumer Profile</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#1C1B1A] cursor-pointer">Kannauj Heritage Stills</button></li>
              <li><button onClick={() => onNavigate('free-sample')} className="hover:text-[#C5A059] font-bold text-[#9A7B38] cursor-pointer">Claim Free Discovery Sample</button></li>
              <li><button onClick={() => onNavigate('order-tracking')} className="hover:text-[#1C1B1A] cursor-pointer">Track Consignment Order</button></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#EAE4D9] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C8477] gap-3">
          <span>© 2026 Maison Ruméra Luxury Atra. All Rights Reserved. Formulated by Er. Rumana Ansari.</span>
          <div className="flex gap-4">
            <span className="hover:text-[#1C1B1A] cursor-pointer" onClick={() => onNavigate('policy')}>Privacy Policy</span>
            <span className="hover:text-[#1C1B1A] cursor-pointer" onClick={() => onNavigate('policy')}>Terms of Service</span>
            <span className="hover:text-[#1C1B1A] cursor-pointer" onClick={() => onNavigate('about')}>Heritage Registry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
