import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, BarChart3, Boxes, Scan, ShoppingBag, Store } from 'lucide-react';

const highlights = [
  { icon: Scan, title: 'See products faster', text: 'AI-assisted product recognition and barcode workflows.' },
  { icon: Boxes, title: 'Know what matters', text: 'Clear stock alerts and reliable store-level visibility.' },
  { icon: BarChart3, title: 'Grow with confidence', text: 'Practical analytics for better daily decisions.' },
];

const Animate = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const classes = { up: 'animate-fade-up', down: 'animate-fade-down', left: 'animate-fade-left', right: 'animate-fade-right', scale: 'animate-fade-scale' };
  return <div className={`opacity-0 ${classes[direction]} ${className}`} style={{ animationDelay: `${delay}ms` }}>{children}</div>;
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
            <Animate delay={700}><NavLink to="/register?role=customer" className="inline-flex h-[46px] sm:h-[51px] items-center gap-3 px-5 sm:px-[27px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[14px] sm:text-[15.5px] font-[450] transition-opacity hover:opacity-90">Search products near you <ArrowRight className="w-4 h-4" /></NavLink></Animate>
          </div>
          <Animate delay={900} direction="scale" className="w-full max-w-[405px] mx-auto lg:mx-0"><div className="rounded-[24px] sm:rounded-[33px] bg-[rgba(17,16,15,0.45)] backdrop-blur-[20px] border border-white/[0.08] p-5 sm:p-8 pb-5 sm:pb-6"><p className="text-white text-[16px] sm:text-[20px] font-[450] leading-[20px]">Choose your experience</p><h2 className="text-white/65 text-sm mt-2 mb-5 sm:mb-7">One platform. Two simple ways in.</h2><div className="space-y-3"><ExperienceCard to="/register?role=customer" icon={ShoppingBag} title="I’m shopping" description="Explore products, compare what nearby stores have, and stay connected to the shops you trust." action="Create a shopper account" /><ExperienceCard to="/register?role=owner" icon={Store} title="I run a shop" description="Manage products, inventory, billing, alerts, and sales performance from one focused workspace." action="Set up my shop" /></div></div></Animate>
        </div>
      </div>
    </section>
    <section className="relative max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] py-16 sm:py-24"><div className="grid sm:grid-cols-3 gap-4 sm:gap-6">{highlights.map(({ icon: Icon, title, text }, index) => <Animate key={title} delay={200 + index * 100}><article className="h-full rounded-[24px] sm:rounded-[30px] bg-[rgba(17,16,15,0.35)] backdrop-blur-[20px] border border-white/[0.08] p-6 sm:p-8 transition-colors hover:bg-white/[0.08]"><Icon className="w-7 h-7 text-white/80 mb-8" /><h2 className="text-xl font-[450] text-white">{title}</h2><p className="text-sm text-white/65 leading-relaxed mt-3">{text}</p></article></Animate>)}</div></section>
  </div>
);

export default LandingPage;
