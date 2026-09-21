import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Receipt, BarChart3, Bell,
  Scan, Cpu, Camera, Image,
  Search, MapPin, ShoppingCart, Sparkles,
  Mic, ShieldCheck, Lock, ArrowRight,
  Boxes,
} from 'lucide-react';

/* ── Scroll-reveal wrapper ─────────────────────────────────── */
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); io.unobserve(el); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ── Lazy image with fallback ──────────────────────────────── */
const LazyImg = ({ src, alt, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-warmwhite/60 ${className}`}>
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {error && (
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
          <Package className="w-6 h-6 text-slate/60" />
        </div>
      )}
    </div>
  );
};

/* ── Section label badge ───────────────────────────────────── */
const Label = ({ n, text }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-mutedgreen dark:bg-mutedgreen text-white dark:text-[#101411] text-[11px] font-bold tracking-wide">{n}</span>
    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-mutedgreen/80 dark:text-mutedgreen">{text}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════ */
const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <div className={`bg-warmwhite dark:bg-charcoal text-navy dark:text-slate transition-colors duration-300`}>

      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=1800&q=80"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f6f1ea] dark:from-[#101411] via-[#f6f1ea]/92 dark:via-[#101411]/92 to-[#f6f1ea]/30 dark:to-[#101411]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f6f1ea] dark:from-[#101411] via-transparent to-[#f6f1ea]/40 dark:to-[#101411]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-mutedgreen dark:text-mutedgreen mb-6">ShopGenie Features</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-navy dark:text-white max-w-3xl">
              Everything local retail needs,{' '}
              <span className="text-mutedgreen dark:text-mutedgreen">in one place.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-lg text-[#5a5a5a] dark:text-slate max-w-xl leading-relaxed">
              From smart inventory to AI-powered product discovery — ShopGenie gives shop owners and customers the tools they actually need.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/register?role=owner')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-mutedgreen dark:bg-mutedgreen text-white dark:text-[#101411] text-sm font-semibold rounded-xl hover:bg-[#3a6b1e] dark:hover:bg-[#A3CD82] transition-all duration-300 shadow-lg shadow-[#2D5016]/20 hover:shadow-xl hover:shadow-[#2D5016]/25 active:scale-[0.97]"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#2D2D2D]/15 dark:border-white/25 text-navy dark:text-slate text-sm font-semibold rounded-xl hover:bg-[#2D2D2D]/5 dark:hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ──────────────────── SHOP MANAGEMENT ──────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <Reveal><Label n="01" text="Shop Management" /></Reveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — text + feature cards */}
          <div>
            <Reveal delay={80}>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-[-0.02em] text-navy dark:text-white mb-4">
                Run your shop <br className="hidden sm:block" />with clarity.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-[#6b6b6b] dark:text-slate leading-relaxed mb-10 max-w-md">
                Everything from stock counts to daily revenue — visible at a glance, manageable from anywhere.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 gap-4">
              {([
                { icon: Package, title: 'Smart Inventory', desc: 'Track stock levels and set automatic reorder alerts.' },
                { icon: Receipt, title: 'POS Billing', desc: 'Fast checkout with barcode scan and PDF receipts.' },
                { icon: BarChart3, title: 'Revenue Analytics', desc: 'Weekly trends, category breakdowns, and forecasts.' },
                { icon: Bell, title: 'Stock Alerts', desc: 'Real-time notifications for low stock and milestones.' },
              ]).map((f, i) => (
                <Reveal key={i} delay={200 + i * 60}>
                  <div className="group bg-white dark:bg-charcoal rounded-2xl p-5 border border-warmwhite/60 dark:border-white/10 hover:border-mutedgreen/20 dark:hover:border-mutedgreen/40 hover:shadow-lg hover:shadow-[#2D5016]/5 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-mutedgreen/8 dark:bg-mutedgreen/12 flex items-center justify-center mb-3 group-hover:bg-mutedgreen/14 dark:group-hover:bg-mutedgreen/20 transition-colors">
                      <f.icon className="w-5 h-5 text-mutedgreen dark:text-mutedgreen" />
                    </div>
                    <h3 className="font-bold text-sm text-navy dark:text-white mb-1">{f.title}</h3>
                    <p className="text-xs text-[#777] dark:text-slate leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right — image collage */}
          <div className="grid grid-cols-2 gap-3">
            <Reveal delay={100}>
              <LazyImg
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                alt="Inventory shelves with products"
                className="col-span-2 h-48 lg:h-56 rounded-2xl"
              />
            </Reveal>
            <Reveal delay={180}>
              <LazyImg
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
                alt="POS billing terminal"
                className="h-40 lg:h-48 rounded-2xl"
              />
            </Reveal>
            <Reveal delay={240}>
              <LazyImg
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
                alt="Analytics dashboard on laptop"
                className="h-40 lg:h-48 rounded-2xl"
              />
            </Reveal>
          </div>
        </div>
      </section>


      {/* ──────────────────── AI & IoT ──────────────────── */}
      <section className="bg-warmwhite dark:bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <Reveal><Label n="02" text="AI & IoT" /></Reveal>

          {/* Large hero image with text overlay */}
          <Reveal delay={80}>
            <div className="relative rounded-3xl overflow-hidden mb-10 h-[320px] lg:h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80"
                alt="ESP32-CAM circuit board"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/85 via-[#1a1a1a]/50 to-transparent" />
              <div className="absolute inset-0 flex items-end p-8 lg:p-12">
                <div className="max-w-lg">
                  <h2 className="text-3xl lg:text-4xl font-extrabold tracking-[-0.02em] text-white mb-3">
                    Computer vision,<br />built for retail.
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed max-w-md">
                    Real-time product detection on the shelf and edge-camera monitoring with ESP32-CAM — powered by OpenCV and YOLOv8.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 4 feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {([
              { icon: Scan, title: 'AI Product Detection', desc: 'Real-time bounding box detection with confidence scoring for every product.', clr: '#2D5016' },
              { icon: Cpu, title: 'OpenCV + YOLOv8', desc: 'Computer vision pipeline optimized for speed and accuracy in retail.', clr: '#3a6b1e' },
              { icon: Camera, title: 'ESP32-CAM Integration', desc: 'Affordable edge camera for continuous shop monitoring and capture.', clr: '#4a7c2a' },
              { icon: Image, title: 'Training Data Pipeline', desc: 'Capture, label, and retrain models with your own product images.', clr: '#5a8d3a' },
            ]).map((f, i) => (
              <Reveal key={i} delay={150 + i * 70}>
                <div className="group bg-white dark:bg-charcoal rounded-2xl p-6 border border-warmwhite/60 dark:border-white/10 hover:shadow-lg transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.clr}10` }}>
                    <f.icon className="w-5 h-5" style={{ color: f.clr }} />
                  </div>
                  <h3 className="font-bold text-[15px] text-navy dark:text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-[#777] dark:text-slate leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ──────────────────── CUSTOMER DISCOVERY ──────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <Reveal><Label n="03" text="Customer Discovery" /></Reveal>
        <Reveal delay={60}>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-[-0.02em] text-navy dark:text-white mb-4 max-w-lg">
            Find what you need,<br />right near you.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-[#6b6b6b] dark:text-slate leading-relaxed mb-12 max-w-xl">
            Customers search products, compare prices, check live availability, and discover nearby shops — all from their phone.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {([
            { icon: Search, title: 'Product Search', desc: 'Find products by name, category, or image scan.', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80' },
            { icon: Boxes, title: 'Live Availability', desc: 'Real-time stock status before you leave home.', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80' },
            { icon: MapPin, title: 'Nearby Shops', desc: 'Discover local retailers on a map.', img: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=400&q=80' },
            { icon: ShoppingCart, title: 'Price Comparison', desc: 'Compare prices across nearby stores.', img: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=400&q=80' },
            { icon: Sparkles, title: 'Recommendations', desc: 'Frequently Bought Together suggestions.', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80' },
          ]).map((f, i) => (
            <Reveal key={i} delay={150 + i * 70}>
              <div className="group bg-white dark:bg-charcoal rounded-2xl overflow-hidden border border-warmwhite/60 dark:border-white/10 hover:shadow-xl hover:shadow-[#2D5016]/5 hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="w-9 h-9 rounded-lg bg-mutedgreen/8 dark:bg-mutedgreen/12 flex items-center justify-center mb-3">
                    <f.icon className="w-4 h-4 text-mutedgreen dark:text-mutedgreen" />
                  </div>
                  <h3 className="font-bold text-[15px] text-navy dark:text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-[#777] dark:text-slate leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ──────────────────── SMART ASSISTANCE & SECURITY ──────────────────── */}
      <section className="bg-white dark:bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <Reveal><Label n="04" text="Smart Assistance & Security" /></Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-[-0.02em] text-navy dark:text-white mb-12 max-w-lg">
              Secure by default.<br />Easy to use.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {([
              { icon: Mic, title: 'Voice Assistant', desc: 'Hands-free commands for navigation, sales readouts, and stock checks via Web Speech API.', accent: '#2D5016' },
              { icon: Bell, title: 'Smart Notifications', desc: 'Context-aware alerts for inventory changes, order updates, and security events.', accent: '#3a6b1e' },
              { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Shop Owner, Customer, and System Admin roles with granular permission controls.', accent: '#4a7c2a' },
              { icon: Lock, title: 'Secure Authentication', desc: 'JWT session tokens, encrypted passwords, and full audit trail logging.', accent: '#5a8d3a' },
            ]).map((f, i) => (
              <Reveal key={i} delay={100 + i * 70}>
                <div className="group flex flex-col h-full bg-warmwhite dark:bg-charcoal rounded-2xl p-6 border border-warmwhite/60 dark:border-white/10 hover:bg-warmwhite dark:hover:bg-charcoal hover:border-mutedgreen/15 dark:hover:border-mutedgreen/30 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.accent}10` }}>
                    <f.icon className="w-5 h-5" style={{ color: f.accent }} />
                  </div>
                  <h3 className="font-bold text-[15px] text-navy dark:text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-[#777] dark:text-slate leading-relaxed flex-1">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ──────────────────── CLOSING CTA ──────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 text-center">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-mutedgreen dark:text-mutedgreen mb-5">Built for Local Retail</p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="text-3xl lg:text-[2.75rem] font-extrabold tracking-[-0.03em] text-navy dark:text-white leading-tight max-w-3xl mx-auto mb-6">
            Built to make local retail simpler, smarter, and easier to discover.
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-[#6b6b6b] dark:text-slate max-w-lg mx-auto mb-10 leading-relaxed">
            Whether you run a neighbourhood shop or shop at one — ShopGenie makes the experience better for everyone.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <button
            onClick={() => navigate('/register?role=owner')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-mutedgreen dark:bg-mutedgreen text-white dark:text-[#101411] text-sm font-semibold rounded-xl hover:bg-[#3a6b1e] dark:hover:bg-[#A3CD82] transition-all duration-300 shadow-lg shadow-[#2D5016]/20 hover:shadow-xl hover:shadow-[#2D5016]/25 active:scale-[0.97]"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </Reveal>
      </section>

    </div>
  );
};

export default FeaturesPage;


