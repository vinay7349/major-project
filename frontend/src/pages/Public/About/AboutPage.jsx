import React from 'react';
import { Cpu, ShieldCheck, Zap, Users, CheckCircle2 } from 'lucide-react';
import GlassCard from '../../../components/GlassCard';

const AboutPage = () => {
  return (
    <div
      className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2200&q=85)', backgroundPosition: 'center', backgroundSize: 'cover' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/35" />
      <div className="relative max-w-5xl mx-auto py-16 px-6 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          About <span className="gradient-text">ShopGenie AI</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          ShopGenie AI is an intelligent sales and inventory assistant engineered to modernize brick-and-mortar retail management through computer vision, Web Speech voice interaction, and machine learning analytics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <GlassCard className="bg-slate-900/60 border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Vision</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Every shop owner should have access to Enterprise-grade artificial intelligence tools without needing complex hardware. By integrating OpenCV, YOLOv8 vision, and Web Speech API into a seamless browser dashboard, we turn any device into a high-speed AI terminal.
          </p>
        </GlassCard>

        <GlassCard className="bg-slate-900/60 border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Core Pillars</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Product Detection</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Low Stock Predictive Warnings</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hands-Free Voice Controls</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF Invoicing & QR Code Validation</li>
          </ul>
        </GlassCard>
      </div>
      </div>
    </div>
  );
};

export default AboutPage;
