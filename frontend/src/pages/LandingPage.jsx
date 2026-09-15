import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, BarChart3, Boxes, Scan, ShoppingBag, Store, Package } from 'lucide-react';

const highlights = [
  { icon: Scan, title: 'See products faster', text: 'AI-assisted product recognition and barcode workflows.' },
  { icon: Boxes, title: 'Know what matters', text: 'Clear stock alerts and reliable store-level visibility.' },
  { icon: BarChart3, title: 'Grow with confidence', text: 'Practical analytics for better daily decisions.' },
];

const Animate = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const classes = { up: 'animate-fade-up', down: 'animate-fade-down', left: 'animate-fade-left', right: 'animate-fade-right', scale: 'animate-fade-scale' };
  return <div className={`opacity-0 ${classes[direction]} ${className}`} style={{ animationDelay: `${delay}ms` }}>{children}</div>;
};

/* Scroll-reveal wrapper (appears once, when scrolled into view) */
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); io.unobserve(el); } },
      { threshold: 0.15 }
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

const ExperienceCard = ({ to, icon: Icon, title, description, action }) => (
  <NavLink to={to} className="group flex items-start gap-4 rounded-[16px] border border-white/[0.08] bg-white/[0.06] p-4 sm:p-5 transition-colors hover:bg-white/[0.12]">
    <Icon className="w-6 h-6 text-white/80 shrink-0 mt-0.5" />
    <div className="min-w-0 flex-1"><p className="font-[450] text-white">{title}</p><p className="text-sm leading-relaxed text-white/65 mt-1">{description}</p><span className="inline-flex items-center gap-2 text-sm font-[450] text-white/90 mt-4">{action} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span></div>
  </NavLink>
);

const LandingPage = () => (
  <div className="bg-[#080A19] text-white overflow-hidden">
    <section className="relative min-h-[calc(100vh-5rem)] lg:min-h-screen flex items-center overflow-hidden">
      <video className="absolute inset-0 w-full h-full object-cover" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4" autoPlay loop muted playsInline />
      <div className="absolute inset-0 bg-[#080A19]/20" />
      <div className="relative w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] pt-28 sm:pt-32 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-12">
          <div className="max-w-[593px]">
            <Animate delay={300}><p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-5">LOCAL SHOPPING, MADE SIMPLE</p><h1 className="text-white text-[36px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-normal leading-[0.95] tracking-[-0.035em] mb-5 sm:mb-8"><span className="block">Find What You Need,</span><span className="block">Right Near You</span><span className="block text-white/70">with ShopGenie</span></h1></Animate>
            <Animate delay={500}><p className="max-w-[550px] text-white/80 text-[16px] sm:text-[18px] md:text-[20px] font-[450] leading-[1.3] mb-7 sm:mb-10">Discover products from trusted local shops, or bring your own store online with one clear retail workspace.</p></Animate>
            <Animate delay={700}><NavLink to="/customer" className="inline-flex h-[46px] sm:h-[51px] items-center gap-3 px-5 sm:px-[27px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[14px] sm:text-[15.5px] font-[450] transition-opacity hover:opacity-90">Find products near you <ArrowRight className="w-4 h-4" /></NavLink></Animate>
          </div>
          <Animate delay={900} direction="scale" className="w-full max-w-[405px] mx-auto lg:mx-0"><div className="rounded-[24px] sm:rounded-[33px] bg-[rgba(17,16,15,0.45)] backdrop-blur-[20px] border border-white/[0.08] p-5 sm:p-8 pb-5 sm:pb-6"><p className="text-white text-[16px] sm:text-[20px] font-[450] leading-[20px]">Choose your experience</p><h2 className="text-white/65 text-sm mt-2 mb-5 sm:mb-7">One platform. Two simple ways in.</h2><div className="space-y-3"><ExperienceCard to="/customer" icon={ShoppingBag} title="I’m a customer" description="Explore products, discover nearby shops, check prices and availability, and stay connected with the shops you trust." action="Explore products" /><ExperienceCard to="/register?role=owner" icon={Store} title="I run a shop" description="Manage products, inventory, billing, alerts, and sales performance from one focused workspace." action="Set up my shop" /></div></div></Animate>
        </div>
      </div>
    </section>
    <section className="relative max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] py-16 sm:py-24"><div className="grid sm:grid-cols-3 gap-4 sm:gap-6">{highlights.map(({ icon: Icon, title, text }, index) => <Animate key={title} delay={200 + index * 100}><article className="h-full rounded-[24px] sm:rounded-[30px] bg-[rgba(17,16,15,0.35)] backdrop-blur-[20px] border border-white/[0.08] p-6 sm:p-8 transition-colors hover:bg-white/[0.08]"><Icon className="w-7 h-7 text-white/80 mb-8" /><h2 className="text-xl font-[450] text-white">{title}</h2><p className="text-sm text-white/65 leading-relaxed mt-3">{text}</p></article></Animate>)}</div></section>

    {/* ─────────────── NEW: Everything connected, in one place ─────────────── */}
    <section className="relative max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] py-16 sm:py-24 md:py-32">
      <div className="max-w-[820px]">
        <Reveal><p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-5">One platform, every part of retail</p></Reveal>
        <Reveal delay={100}><h2 className="text-[34px] sm:text-[46px] md:text-[56px] font-normal leading-[1.02] tracking-[-0.035em] text-white">Everything connected,<br className="hidden sm:block" /> in one place.</h2></Reveal>
        <Reveal delay={200}><p className="mt-6 max-w-[620px] text-white/75 text-[16px] sm:text-[18px] font-[450] leading-[1.5]">ShopGenie brings shop owners, customers, products, and local stores together through one simple digital retail platform.</p></Reveal>
      </div>

      {/* 01 · Admin Panel */}
      <div className="mt-16 sm:mt-24 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <Reveal className="lg:col-span-6">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[36px] bg-[#2D5016]/25 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[24px] sm:rounded-[32px] bg-[rgba(17,16,15,0.55)] backdrop-blur-[20px] border border-white/[0.08] p-4 sm:p-6">
              {/* dashboard device frame */}
              <div className="rounded-[16px] sm:rounded-[22px] bg-[#0D1320]/90 border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/40">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]"><span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" /><span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" /><span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" /><span className="ml-3 text-[11px] text-white/40 tracking-wide">ShopGenie · Admin Panel</span></div>
                <div className="p-4 sm:p-6 grid grid-cols-3 gap-3 sm:gap-4">
                  {[38, 62, 44].map((v, i) => <div key={i} className="rounded-xl bg-white/[0.05] p-3"><div className="text-[10px] text-white/40 uppercase tracking-wide">{['Stock', 'Sales', 'Orders'][i]}</div><div className="text-lg sm:text-xl font-[450] text-white mt-1">{['2,318', '₹4.6L', '312'][i]}</div><div className="mt-2 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#34D399]" style={{ width: `${v}%` }} /></div></div>)}
                  <div className="col-span-3 rounded-xl bg-white/[0.05] p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3"><span className="text-[11px] text-white/45 uppercase tracking-wide">Weekly revenue</span><span className="text-[11px] text-[#34D399]">+12.4%</span></div>
                    <div className="flex items-end gap-1.5 h-16 sm:h-20">{['22','35','28','48','40','62','55'].map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#2D5016]/60 to-[#34D399]/80" style={{ height: `${h}%` }} />)}</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-3 sm:-right-5 rounded-2xl bg-[#2D5016] text-white px-4 py-3 shadow-xl shadow-black/30"><p className="text-[11px] uppercase tracking-[0.15em] text-white/70">Dashboard</p><p className="text-sm font-[450]">One view. Complete control.</p></div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6">
          <div>
            <div className="flex items-center gap-3 mb-4"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2D5016] text-white text-xs font-[450]">01</span><span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Admin Panel</span></div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-[-0.02em] text-white leading-tight">One view.<br />Complete control.</h3>
            <p className="mt-4 text-white/70 text-base leading-relaxed max-w-[460px]">Stock, sales, and orders — managed from a single focused dashboard built for shop owners.</p>
            <div className="mt-6 inline-flex items-center gap-2 text-[#34D399] text-sm font-[450]">See the dashboard <ArrowRight className="w-4 h-4" /></div>
          </div>
        </Reveal>
      </div>

      {/* 02 · Product Discovery */}
      <div className="mt-20 sm:mt-28 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <Reveal delay={120} className="lg:col-span-6 lg:order-2">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[36px] bg-[#2D5016]/25 blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto max-w-[280px] sm:max-w-[320px] rounded-[28px] sm:rounded-[36px] bg-[#0D1320] border border-white/[0.1] p-2.5 shadow-2xl shadow-black/40">
              <div className="rounded-[22px] sm:rounded-[28px] bg-[#111a14] overflow-hidden">
                <div className="relative h-36 sm:h-44 overflow-hidden"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80" alt="Retail products" className="w-full h-full object-cover" /><span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide bg-black/50 text-white px-2.5 py-1 rounded-full">Step 1 · Search</span></div>
                <div className="p-4 sm:p-5 space-y-2.5">
                  {[{ label: 'In stock', val: '2 shops', on: true }, { label: 'Near you', val: '0.8 km', on: true }, { label: 'Price', val: '$4.50', on: true }].map((r) => <div key={r.label} className="flex items-center justify-between rounded-lg bg-white/[0.06] px-3 py-2.5"><span className="text-xs text-white/60">{r.label}</span><span className="text-xs text-[#34D399] font-[450]">{r.val}</span></div>)}
                </div>
              </div>
              <div className="absolute -bottom-5 -left-3 sm:-left-5 rounded-2xl bg-[#2D5016] text-white px-4 py-3 shadow-xl shadow-black/30"><p className="text-[11px] uppercase tracking-[0.15em] text-white/70">Discovery</p><p className="text-sm font-[450]">Find it. Check it. Nearby.</p></div>
            </div>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-6 lg:order-1">
          <div>
            <div className="flex items-center gap-3 mb-4"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2D5016] text-white text-xs font-[450]">02</span><span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Product Discovery</span></div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-[-0.02em] text-white leading-tight">Find it. Check it.<br />Nearby.</h3>
            <p className="mt-4 text-white/70 text-base leading-relaxed max-w-[460px]">Search a product, see live availability, and find the nearest shop stocking it — right from a phone.</p>
            <div className="mt-6 inline-flex items-center gap-2 text-[#34D399] text-sm font-[450]">Start searching <ArrowRight className="w-4 h-4" /></div>
          </div>
        </Reveal>
      </div>

      {/* 03 · Connected Retail */}
      <div className="mt-20 sm:mt-28 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <Reveal className="lg:col-span-6">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[36px] bg-[#2D5016]/25 blur-3xl" aria-hidden="true" />
            <div className="relative flex items-end justify-center gap-3 sm:gap-5">
              {/* shelf */}
              <div className="relative w-36 sm:w-48 rounded-[18px] sm:rounded-[24px] bg-[rgba(20,26,18,0.7)] border border-white/[0.08] p-3 pb-6 overflow-hidden shadow-2xl shadow-black/40">
                <div className="h-full flex flex-col justify-end gap-2">
                  {['#2D5016', '#3F6C27', '#527F34', '#63904A'].map((c, i) => <div key={i} className="flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2 py-2"><span className="h-8 w-4 rounded-sm" style={{ backgroundColor: c }} /><span className="text-[10px] text-white/60 leading-none">Item {i + 1}</span></div>)}
                </div>
              </div>
              {/* product */}
              <div className="relative rounded-[22px] sm:rounded-[28px] bg-[rgba(20,26,18,0.75)] border border-white/10 p-4 sm:p-5 shadow-2xl shadow-black/40 flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#2D5016] to-[#63904A] flex items-center justify-center"><Package className="w-7 h-7 text-white" /></div>
                <p className="mt-3 text-xs text-white/55">On the shelf</p>
                <p className="text-sm font-[450] text-white">In stock</p>
              </div>
              {/* phone */}
              <div className="relative w-40 sm:w-52 rounded-[22px] sm:rounded-[28px] bg-[#0D1320] border border-white/[0.1] p-2 sm:p-2.5 shadow-2xl shadow-black/40">
                <div className="rounded-[16px] sm:rounded-[20px] bg-[#111a14] overflow-hidden">
                  <div className="h-24 sm:h-32 overflow-hidden"><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80" alt="Product on phone screen" className="w-full h-full object-cover" /></div>
                  <div className="p-3"><div className="h-2 rounded-full bg-white/15 w-3/4 mb-2" /><div className="h-2 rounded-full bg-white/10 w-1/2" /><div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#34D399]"><span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />Available · 0.8 km</div></div>
                </div>
              </div>
              {/* green connection line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 200" fill="none" preserveAspectRatio="none"><path d="M45 120 C 110 55, 190 55, 255 130" stroke="#34D399" strokeWidth="2" strokeDasharray="6 7" opacity="0.7" /></svg>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-2xl bg-[#2D5016] text-white px-4 py-3 shadow-xl shadow-black/30 whitespace-nowrap"><p className="text-[11px] uppercase tracking-[0.15em] text-white/70">Connected Retail</p><p className="text-sm font-[450]">From the shelf to the screen.</p></div>
          </div>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6">
          <div>
            <div className="flex items-center gap-3 mb-4"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2D5016] text-white text-xs font-[450]">03</span><span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Connected Retail</span></div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-[-0.02em] text-white leading-tight">From the shelf<br />to the screen.</h3>
            <p className="mt-4 text-white/70 text-base leading-relaxed max-w-[460px]">A connected thread runs through every local shop — from what's stocked on shelves to what customers see on their phones.</p>
            <div className="mt-6 inline-flex items-center gap-2 text-[#34D399] text-sm font-[450]">Explore the network <ArrowRight className="w-4 h-4" /></div>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default LandingPage;
