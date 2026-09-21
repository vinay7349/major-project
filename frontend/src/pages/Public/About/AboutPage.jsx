import React, { useEffect, useState } from 'react';
import {
  Search, Package, Store, Eye, ScanLine, ArrowRight,
  Smartphone, Globe, Cpu, ChevronDown, CheckCircle2,
  BarChart3, Box, User
} from 'lucide-react';
import useScrollReveal from '../../../hooks/useScrollReveal';

/* ─── tiny reusable wrapper ─── */
function Reveal({ children, className = '', delay = 0 }) {
  const [ref, vis] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Flow arrow ─── */
function FlowArrow({ label, direction = 'down' }) {
  const up = direction === 'up';
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <div className={`w-px h-6 bg-gradient-to-b ${up ? 'from-amber-400/20 to-amber-400/60' : 'from-amber-400/60 to-amber-400/20'}`} />
      {label && <span className="text-[11px] text-amber-400/80 font-medium tracking-wide">{label}</span>}
      <ChevronDown className={`w-4 h-4 text-amber-400/50 ${up ? 'rotate-180' : ''}`} />
    </div>
  );
}

/* ─── Tech badge ─── */
function TechBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal/80 border border-charcoal/50 text-[11px] font-medium text-slate/60 tracking-wide">
      <Cpu className="w-3 h-3 text-amber-400/70" />
      {children}
    </span>
  );
}

/* ─── Step node for flow diagrams ─── */
function FlowNode({ icon: Icon, label, highlight = false }) {
  return (
    <div className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
      highlight
        ? 'bg-amber/10 border-amber/30 text-amber-400'
        : 'bg-charcoal/50 border-charcoal/40 text-slate/60'
    }`}>
      <Icon className="w-5 h-5" />
      <span className="text-[11px] font-medium text-center leading-tight whitespace-nowrap">{label}</span>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
const AboutPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">

      {/* ═══════════════════════════════════════
          SECTION 1 — HERO
         ═══════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-navy overflow-hidden">
        {/* Background image with parallax */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=2200&q=80)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080A19] via-[#080A19]/60 to-[#080A19]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080A19]/80 via-transparent to-[#080A19]/80" />

        {/* Subtle ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber/5 blur-[120px]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-20">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Store className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white/70 font-medium">Smart Retail Platform</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[0.95] mb-6">
              About{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                ShopGenie
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg sm:text-xl md:text-2xl text-white/50 font-medium max-w-2xl mx-auto leading-relaxed mb-4">
              Making local retail smarter, more accessible, and easier to discover.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-sm sm:text-base text-white/35 max-w-xl mx-auto leading-relaxed">
              ShopGenie connects local shop owners and customers through smart retail management,
              AI-assisted product identification, and digital product and shop discovery.
            </p>
          </Reveal>

          {/* Scroll indicator */}
          <Reveal delay={500}>
            <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
              <div className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5">
                <div className="w-1 h-2 rounded-full bg-white/30" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          SECTION 2 — WHAT IS SHOPGENIE?
         ═══════════════════════════════════════ */}
      <section className="relative bg-[#0c0f1a] py-24 sm:py-32 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-6">
              A smarter way to connect local shops and customers.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-base sm:text-lg text-slate/80 text-center max-w-3xl mx-auto leading-relaxed mb-16">
              ShopGenie is a smart retail platform designed for small and local shops.
              It helps shop owners digitally manage their products, prices, inventory, and shop information
              while giving customers an easier way to discover products and find nearby shops.
            </p>
          </Reveal>

          {/* Three pillar cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {([
              {
                icon: Package,
                title: 'MANAGE',
                desc: 'Keep your shop, products, prices, and inventory organized.',
                color: 'amber',
              },
              {
                icon: Eye,
                title: 'IDENTIFY',
                desc: 'Use AI-assisted visual recognition when conventional product identification is not suitable.',
                color: 'blue',
              },
              {
                icon: Search,
                title: 'DISCOVER',
                desc: 'Help customers find products and nearby local shops.',
                color: 'emerald',
              },
            ]).map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="group relative bg-charcoal/60 border border-charcoal/70 rounded-2xl p-8 text-center hover:border-charcoal/80 transition-all duration-500 hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${
                    item.color === 'amber' ? 'bg-amber/10 text-amber-400' :
                    item.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-mutedgreen/10 text-emerald-400'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white/90 tracking-[0.2em] mb-3">{item.title}</h3>
                  <p className="text-sm text-slate/80 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          SECTION 3 — WHY SHOPGENIE?
         ═══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#0c0f1a] to-[#0f1220] py-24 sm:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-4">
              Local retail has an information gap.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-slate/80 text-center max-w-2xl mx-auto mb-16">
              ShopGenie bridges the gap between shop owners and customers with digital tools built for local retail.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Customers card */}
            <Reveal delay={0}>
              <div className="relative group bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-charcoal/60 rounded-3xl p-8 sm:p-10 overflow-hidden hover:border-blue-500/20 transition-all duration-500">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px]" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-semibold text-blue-400 tracking-wide">CUSTOMERS</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-snug">
                    Finding a product shouldn't mean visiting multiple shops.
                  </h3>
                  <p className="text-sm sm:text-base text-slate/80 leading-relaxed">
                    Customers may not know which nearby shop has a required product, whether it is currently
                    available, or what price it is offered at. ShopGenie makes this information easier to
                    discover through a digital product and shop discovery platform.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Shop Owners card */}
            <Reveal delay={150}>
              <div className="relative group bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-charcoal/60 rounded-3xl p-8 sm:p-10 overflow-hidden hover:border-amber/20 transition-all duration-500">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber/5 rounded-full blur-[80px]" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/20 mb-6">
                    <Store className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400 tracking-wide">SHOP OWNERS</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-snug">
                    Managing a local shop should be simple.
                  </h3>
                  <p className="text-sm sm:text-base text-slate/80 leading-relaxed">
                    Small retailers may rely on manual processes or conventional computer-based management
                    for products, prices, inventory, and shop information. ShopGenie provides a more
                    convenient way to manage everyday retail information through a connected platform.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          SECTION 4 — BUILT FOR LOCAL RETAIL
         ═══════════════════════════════════════ */}
      <section className="relative bg-[#0f1220] py-24 sm:py-32 overflow-hidden">
        {/* Subtle vertical accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-400/5 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-400/5 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-6">
              Smart retail shouldn't be complicated.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-base sm:text-lg text-slate/80 text-center max-w-3xl mx-auto leading-relaxed mb-12">
              Many small and local shops cannot easily adopt expensive, complex, or hardware-heavy retail
              management systems. Managing products, prices, and inventory through conventional systems can
              be difficult and may require additional devices or continuous dependence on a laptop or desktop.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-center text-lg sm:text-xl font-semibold text-amber-400 mb-12">
              ShopGenie makes everyday retail management simpler.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-base sm:text-lg text-slate/80 text-center max-w-3xl mx-auto leading-relaxed mb-16">
              With a convenient mobile-first management experience, shop owners can manage their shop,
              products, prices, inventory, and availability more easily. The platform brings essential
              retail tools together in one simple and connected system, designed with the practical needs
              of small and local retailers in mind.
            </p>
          </Reveal>

          {/* Three visual highlights */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle2,
                title: 'SIMPLE TO MANAGE',
                desc: 'Manage everyday shop information without complicated systems.',
                color: 'amber',
              },
              {
                icon: Smartphone,
                title: 'MOBILE-FIRST',
                desc: 'Handle essential retail tasks conveniently from a mobile application.',
                color: 'blue',
              },
              {
                icon: Store,
                title: 'BUILT FOR LOCAL SHOPS',
                desc: 'Designed around the practical needs of small and local retailers.',
                color: 'emerald',
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="group relative bg-charcoal/60 border border-charcoal/70 rounded-2xl p-8 text-center hover:border-charcoal/80 transition-all duration-500 hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${
                    item.color === 'amber' ? 'bg-amber/10 text-amber-400' :
                    item.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-mutedgreen/10 text-emerald-400'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white/90 tracking-[0.2em] mb-3">{item.title}</h3>
                  <p className="text-sm text-slate/80 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          SECTION 5 — AI-ASSISTED PRODUCT IDENTIFICATION
         ═══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#0f1220] to-[#0c0f1a] py-24 sm:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-6">
              See the product. Understand the product.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-base sm:text-lg text-slate/80 text-center max-w-3xl mx-auto leading-relaxed mb-16">
              ShopGenie's AI-assisted vision system uses camera-based product recognition to identify
              registered products based on their visual appearance. The recognized product can then be matched
              with the corresponding product information maintained by the shop.
            </p>
          </Reveal>

          {/* Vertical workflow */}
          <Reveal delay={200}>
            <div className="max-w-md mx-auto">
              {([
                { icon: Package, label: 'Product', desc: 'Item presented to camera' },
                { icon: Eye, label: 'Wall-Mounted Camera', desc: 'ESP32-CAM captures frame' },
                null, // arrow
                { icon: Cpu, label: 'Image Capture', desc: 'Frame processed for analysis' },
                null,
                { icon: ScanLine, label: 'AI / Computer Vision', desc: 'YOLOv8 + OpenCV analysis', highlight: true },
                null,
                { icon: CheckCircle2, label: 'Product Recognition', desc: 'Visual match identified' },
                null,
                { icon: Store, label: 'Shop Product Data', desc: 'Matched with shop records' },
                null,
                { icon: BarChart3, label: 'Price • Stock • Availability', desc: 'Information displayed', highlight: true },
              ]).map((step, i) => {
                if (step === null) return <FlowArrow key={`a${i}`} />;
                return (
                  <div key={i} className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${
                    step.highlight
                      ? 'bg-amber/8 border-amber/20'
                      : 'bg-charcoal/40 border-charcoal/40'
                  }`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      step.highlight ? 'bg-amber/15 text-amber-400' : 'bg-charcoal/60 text-slate/80'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{step.label}</p>
                      <p className="text-xs text-slate">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Tech label */}
          <Reveal delay={300}>
            <div className="flex justify-center mt-10 gap-3">
              <TechBadge>YOLOv8</TechBadge>
              <TechBadge>OpenCV</TechBadge>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          SECTION 6 — PRODUCT DISCOVERY
         ═══════════════════════════════════════ */}
      <section className="relative bg-[#0c0f1a] py-24 sm:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-6">
              Don't just search for a product. Find where it is.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-base sm:text-lg text-slate/80 text-center max-w-3xl mx-auto leading-relaxed mb-16">
              ShopGenie gives customers a digital window into local retail. Search for a product,
              explore its details, check availability and price, and discover nearby shops where it is available.
            </p>
          </Reveal>

          {/* Customer UI Mockup */}
          <Reveal delay={200}>
            <div className="max-w-lg mx-auto">
              <div className="bg-charcoal/80 border border-charcoal/60 rounded-3xl overflow-hidden shadow-2xl shadow-black/20">
                {/* Search bar */}
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3 bg-charcoal/60 border border-charcoal/40 rounded-xl px-4 py-3">
                    <Search className="w-4 h-4 text-slate" />
                    <span className="text-sm text-white/80">Milk 500ml</span>
                  </div>
                </div>

                {/* Product card */}
                <div className="px-5 pb-3">
                  <div className="bg-charcoal/40 border border-charcoal/30 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-base font-bold text-white">Milk 500ml</h4>
                        <p className="text-xs text-slate mt-0.5">Dairy · Fresh</p>
                      </div>
                      <span className="text-xl font-extrabold text-amber-400">₹30</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mutedgreen/10 border border-mutedgreen/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-semibold text-emerald-400">Available</span>
                    </div>
                  </div>
                </div>

                {/* Nearby shops */}
                <div className="px-5 pb-5">
                  <p className="text-[11px] font-semibold text-slate tracking-wider mb-3 px-1">NEARBY SHOPS</p>
                  {([
                    { name: 'ABC General Store', price: '₹30', dist: '0.8 km' },
                    { name: 'Sri Stores', price: '₹32', dist: '1.2 km' },
                  ]).map((shop) => (
                    <div key={shop.name} className="flex items-center justify-between bg-charcoal/30 border border-charcoal/20 rounded-xl px-4 py-3 mb-2 last:mb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                          <Store className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{shop.name}</p>
                          <p className="text-[11px] text-slate">{shop.dist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-400">{shop.price}</p>
                        <div className="flex items-center gap-1 justify-end">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Available</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Reveal delay={300}>
                <div className="text-center mt-8">
                  <a href="/customer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber/10 border border-amber/20 text-amber-400 text-sm font-semibold hover:bg-amber/20 transition-all duration-300">
                    Explore Products <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          SECTION 7 — SMART SHOP MANAGEMENT
         ═══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#0c0f1a] to-[#0f1220] py-24 sm:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-6">
              A smarter workspace for local shops.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-base sm:text-lg text-slate/80 text-center max-w-3xl mx-auto leading-relaxed mb-16">
              Shop owners can add and manage their shop information, products, prices, inventory, and
              availability through the ShopGenie application or web interface. The mobile-first approach
              makes everyday management more convenient without requiring constant dependence on a laptop or desktop.
            </p>
          </Reveal>

          {/* Mobile dashboard mockup */}
          <Reveal delay={200}>
            <div className="max-w-sm mx-auto">
              <div className="bg-charcoal/80 border border-charcoal/60 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 p-1">
                {/* Phone notch */}
                <div className="flex justify-center py-2">
                  <div className="w-24 h-1.5 rounded-full bg-charcoal/50" />
                </div>

                <div className="px-5 pb-6 pt-2">
                  {/* App header */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-white text-navy flex items-center justify-center font-bold text-xs">G</div>
                    <span className="text-sm font-bold text-white">ShopGenie</span>
                  </div>

                  {/* Shop name */}
                  <h3 className="text-lg font-extrabold text-white mb-5">ABC General Store</h3>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {([
                      { label: 'Products', value: '128', color: 'text-white' },
                      { label: 'Available', value: '112', color: 'text-emerald-400' },
                      { label: 'Low Stock', value: '10', color: 'text-amber-400' },
                      { label: 'Unavailable', value: '6', color: 'text-red-400' },
                    ]).map((stat) => (
                      <div key={stat.label} className="bg-charcoal/50 border border-charcoal/30 rounded-xl p-3.5">
                        <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                        <p className="text-[11px] text-slate mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {([
                      { label: 'Manage Products', icon: Package },
                      { label: 'Inventory', icon: Box },
                      { label: 'Shop Profile', icon: Store },
                    ]).map((btn) => (
                      <div key={btn.label} className="flex-1 flex flex-col items-center gap-1.5 bg-charcoal/40 border border-charcoal/30 rounded-xl py-3 px-2">
                        <btn.icon className="w-4 h-4 text-amber-400" />
                        <span className="text-[10px] text-slate/80 text-center leading-tight">{btn.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          SECTION 8 — ONE CONNECTED PLATFORM
         ═══════════════════════════════════════ */}
      <section className="relative bg-[#0f1220] py-24 sm:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-6">
              One platform. Three connected experiences.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-slate/80 text-center max-w-2xl mx-auto mb-16">
              ShopGenie brings together customers, shop owners, and AI technology on a single connected platform.
            </p>
          </Reveal>

          {/* Three experience cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {([
              {
                icon: Globe,
                title: 'Discover',
                subtitle: 'CUSTOMER WEBSITE',
                desc: 'Search products, check availability, explore local prices, and find nearby shops.',
                color: 'blue',
              },
              {
                icon: Smartphone,
                title: 'Manage',
                subtitle: 'SHOP OWNER APP',
                desc: 'Manage products, inventory, prices, availability, and shop information.',
                color: 'amber',
              },
              {
                icon: Eye,
                title: 'Identify',
                subtitle: 'AI + IoT',
                desc: 'Use camera-based visual recognition to assist with product identification.',
                color: 'emerald',
              },
            ]).map((card, i) => (
              <Reveal key={card.title} delay={i * 120}>
                <div className={`relative bg-charcoal/60 border border-charcoal/60 rounded-2xl p-8 text-center overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                  card.color === 'blue' ? 'hover:border-blue-500/20' :
                  card.color === 'amber' ? 'hover:border-amber/20' :
                  'hover:border-mutedgreen/20'
                }`}>
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px] ${
                    card.color === 'blue' ? 'bg-blue-500/8' :
                    card.color === 'amber' ? 'bg-amber/8' :
                    'bg-mutedgreen/8'
                  }`} />
                  <div className="relative">
                    <p className="text-[11px] font-semibold text-slate tracking-wider mb-4">{card.subtitle}</p>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${
                      card.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                      card.color === 'amber' ? 'bg-amber/10 text-amber-400' :
                      'bg-mutedgreen/10 text-emerald-400'
                    }`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                    <p className="text-sm text-slate/80 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Architecture connection diagram */}
          <Reveal delay={200}>
            <div className="bg-charcoal/40 border border-charcoal/40 rounded-2xl p-8 sm:p-10">
              <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
                {/* Top: Customer Website */}
                <FlowNode icon={Globe} label="Customer Website" />
                <FlowArrow direction="down" />

                {/* Middle: API */}
                <div className="px-6 py-3 rounded-xl bg-amber/10 border border-amber/20 text-center">
                  <p className="text-sm font-bold text-amber-400">Django REST API</p>
                  <p className="text-[11px] text-amber-400/50 mt-0.5">ShopGenie Data</p>
                </div>

                {/* Two inputs feeding in */}
                <div className="flex gap-8 items-start">
                  <div className="flex flex-col items-center gap-1">
                    <FlowArrow direction="up" />
                    <FlowNode icon={Smartphone} label="Shop Owner App" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <FlowArrow direction="up" />
                    <FlowNode icon={Eye} label="AI / IoT" />
                  </div>
                </div>
              </div>

              {/* Tech badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {['React', 'Django REST Framework', 'PostgreSQL', 'ESP32-CAM', 'YOLOv8', 'OpenCV'].map((tech) => (
                  <TechBadge key={tech}>{tech}</TechBadge>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          SECTION 9 — OUR VISION
         ═══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#0f1220] to-[#0c0f1a] py-24 sm:py-32 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber/5 rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8">
              Technology shouldn't leave local retail behind.
            </h2>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-base sm:text-lg text-slate/80 leading-relaxed max-w-3xl mx-auto">
              We envision a future where local shops are digitally connected, easier to manage,
              and easier for customers to discover. ShopGenie aims to bring practical AI and digital
              tools to everyday retail without making local businesses dependent on complicated systems.
            </p>
          </Reveal>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          SECTION 10 — FINAL CTA
         ═══════════════════════════════════════ */}
      <section className="relative bg-navy py-24 sm:py-32 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-amber/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-orange-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Manage smarter. Identify easier.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
                Discover locally.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-base sm:text-lg text-slate/80 max-w-2xl mx-auto mb-10">
              ShopGenie brings local retailers and customers closer through smart retail technology.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/customer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber/20 hover:shadow-amber/30 hover:from-amber-400 hover:to-orange-400 transition-all duration-300 active:scale-[0.97]"
              >
                For Customers — Find Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/register?role=owner"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-[0.97]"
              >
                For Shop Owners — Set Up Your Shop
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;



