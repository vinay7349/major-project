import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, BarChart3, Boxes, Scan, ShoppingBag, Store } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const LandingPage = () => {
  const shopBackground = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1800&q=85';

  const highlights = [
    { icon: Scan, title: 'See products faster', text: 'AI-assisted product recognition and barcode workflows.' },
    { icon: Boxes, title: 'Know what matters', text: 'Clear stock alerts and reliable store-level visibility.' },
    { icon: BarChart3, title: 'Grow with confidence', text: 'Practical analytics for better daily decisions.' },
  ];

  return (
    <div className="relative isolate overflow-hidden bg-slate-950 text-white">
      <section
        className="relative min-h-[calc(100vh-5rem)] flex items-center"
        style={{ backgroundImage: `url(${shopBackground})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/20" />
        <div className="relative w-full px-[6vw] py-20">
          <div className="max-w-2xl space-y-7 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">LOCAL SHOPPING, MADE SIMPLE</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
              <span className="block">Find What You Need,</span>
              <span className="block">Right Near You</span>
              <span className="block text-sky-400">with ShopGenie</span>
            </h1>
            <p className="max-w-[550px] text-base sm:text-lg text-slate-200 leading-relaxed">Discover products from trusted local shops, or bring your own store online with one clear retail workspace.</p>
            <NavLink to="/register?role=customer" className="gradient-btn-primary inline-flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-bold hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/20">
              Search products near you
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </section>

      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-16 space-y-20">

      <section className="space-y-8">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Choose your experience</p><h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-950">One platform. Two simple ways in.</h2></div>
        <div className="grid md:grid-cols-2 gap-5">
          <GlassCard className="bg-white/85 border-sky-200 p-8"><ShoppingBag className="w-8 h-8 text-sky-500 mb-8" /><h3 className="text-2xl font-bold text-slate-950">I’m shopping</h3><p className="text-slate-600 leading-relaxed mt-3 mb-7">Explore products, compare what nearby stores have, and stay connected to the shops you trust.</p><NavLink to="/register?role=customer" className="text-sm font-bold text-sky-600 flex items-center gap-2">Create a shopper account <ArrowRight className="w-4 h-4" /></NavLink></GlassCard>
          <GlassCard className="bg-white/85 border-sky-200 p-8"><Store className="w-8 h-8 text-indigo-500 mb-8" /><h3 className="text-2xl font-bold text-slate-950">I run a shop</h3><p className="text-slate-600 leading-relaxed mt-3 mb-7">Manage products, inventory, billing, alerts, and sales performance from one focused workspace.</p><NavLink to="/register?role=owner" className="text-sm font-bold text-indigo-600 flex items-center gap-2">Set up my shop <ArrowRight className="w-4 h-4" /></NavLink></GlassCard>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-6 bg-white/55 rounded-xl px-4 sm:px-6 py-8 backdrop-blur-sm border-y border-sky-200">
        {highlights.map(({ icon: Icon, title, text }) => <div key={title} className="space-y-3"><Icon className="w-6 h-6 text-sky-600" /><h3 className="font-bold text-slate-950">{title}</h3><p className="text-sm text-slate-600 leading-relaxed">{text}</p></div>)}
      </section>

      </div>
    </div>
  );
};

export default LandingPage;
