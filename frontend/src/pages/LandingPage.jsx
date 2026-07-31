import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Scan, Bot, BarChart3, ShieldCheck, ArrowRight, Zap, Boxes, Receipt, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const LandingPage = () => {
  return (
    <div className="space-y-24 py-12 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative overflow-hidden pt-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Next-Generation Retail Automation Engine</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Transform Your Shop with <span className="gradient-text">ShopGenie AI</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Intelligent computer vision product detection, hands-free Web Speech voice control, real-time inventory alerts, and predictive sales analytics in one unified dashboard.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <NavLink to="/dashboard" className="gradient-btn-primary px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-3 shadow-2xl shadow-indigo-500/30">
            <span>Explore Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </NavLink>
          <NavLink to="/ai-detection" className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-base font-bold text-slate-200 flex items-center gap-2 transition-all">
            <Scan className="w-5 h-5 text-cyan-400" />
            <span>Try AI Detection</span>
          </NavLink>
        </div>

        {/* Live Metrics Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16">
          {[
            { label: 'Detection Speed', val: '120 ms', sub: 'YOLOv8 & OpenCV' },
            { label: 'Voice Commands', val: '100% Native', sub: 'Web Speech API' },
            { label: 'Inventory Precision', val: '99.8%', sub: 'Auto Threshold Alerts' },
            { label: 'Sales Prediction', val: 'ML Forecast', sub: '7-Day Trend Analysis' },
          ].map((stat, i) => (
            <GlassCard key={i} className="text-center border-slate-800/80 bg-slate-900/60">
              <h3 className="text-3xl font-extrabold gradient-text mb-1">{stat.val}</h3>
              <p className="text-xs font-semibold text-slate-200">{stat.label}</p>
              <p className="text-[10px] text-slate-400 mt-1">{stat.sub}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Powerful AI Modules Built for Retailers</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Everything you need to automate inventory, boost counter billing speed, and maximize revenue.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <GlassCard className="bg-slate-900/50 border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Product Detection</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Upload or stream images to instant identify items using OpenCV feature extractors and YOLO neural vision with high confidence scoring.
            </p>
            <NavLink to="/ai-detection" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Test AI Scanner &rarr;
            </NavLink>
          </GlassCard>

          <GlassCard className="bg-slate-900/50 border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Speech Voice Assistant</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Hands-free voice recognition allowing shop owners to search inventory, switch themes, navigate pages, and read out sales stats.
            </p>
            <NavLink to="/dashboard" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Try Voice Commands &rarr;
            </NavLink>
          </GlassCard>

          <GlassCard className="bg-slate-900/50 border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Billing & Invoice</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Rapid POS checkout terminal with barcode scanner support, tax calculation, payment methods, and instant QR verification PDF invoices.
            </p>
            <NavLink to="/billing" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Open POS Billing &rarr;
            </NavLink>
          </GlassCard>
        </div>
      </section>

      {/* Community Retail Network banner */}
      <section className="glass-card rounded-3xl p-12 bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-slate-950 border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Community Retail Network
          </div>
          <h2 className="text-3xl font-bold text-white">Connect with Nearby Local Shops</h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            Bridge neighborhood inventory sharing, customer reviews, ratings, and localized product availability right within ShopGenie AI.
          </p>
        </div>
        <NavLink to="/nearby-shops" className="gradient-btn-primary px-8 py-4 rounded-2xl font-bold text-sm whitespace-nowrap">
          View Nearby Shops
        </NavLink>
      </section>
    </div>
  );
};

export default LandingPage;
