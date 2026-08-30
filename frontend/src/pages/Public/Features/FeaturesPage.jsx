import React from 'react';
import { Scan, Bot, Boxes, Receipt, Sparkles, BarChart3, Bell, Store, ShieldCheck } from 'lucide-react';
import GlassCard from '../../../components/GlassCard';

const FeaturesPage = () => {
  const features = [
    { title: "AI Product Detection", desc: "OpenCV + YOLOv8 vision pipeline for real-time bounding box object detection and confidence scoring.", icon: Scan },
    { title: "Voice Assistant Integration", desc: "Hands-free speech commands powered by Web Speech API for instant route navigation and sales readouts.", icon: Bot },
    { title: "Smart Inventory Tracking", desc: "Automatic low stock alerts, critical threshold notifications, and rapid restock logging.", icon: Boxes },
    { title: "POS Billing & Invoicing", desc: "Interactive cart terminal with barcode scan support, multi-payment options, and downloadable PDF receipts.", icon: Receipt },
    { title: "AI Recommendation Engine", desc: "Frequently Bought Together algorithms and item similarity matching to increase average order values.", icon: Sparkles },
    { title: "Sales & Revenue Analytics", desc: "Interactive charts for weekly trends, category share, peak shopping hours, and ML 7-day forecast.", icon: BarChart3 },
    { title: "Notification System", desc: "Real-time stock alerts, sales milestone updates, and system activity logs.", icon: Bell },
    { title: "Community Retail Network", desc: "Directory listing nearby local shops, ratings, reviews, and neighborhood stock discovery.", icon: Store },
    { title: "Admin Panel & Security", desc: "Role-based authorization (Admin, Shop Owner, Customer), JWT session tokens, and audit trail logging.", icon: ShieldCheck },
  ];

  return (
    <div
      className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=2200&q=85)', backgroundPosition: 'center', backgroundSize: 'cover' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/40" />
      <div className="relative max-w-6xl mx-auto py-16 px-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white">Full Feature Specification</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">Explore all 12 modules included in ShopGenie AI.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <GlassCard key={i} className="bg-slate-900/60 border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </GlassCard>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
