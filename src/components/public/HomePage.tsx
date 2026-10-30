import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  UtensilsCrossed, 
  Award, 
  Wine, 
  Clock, 
  MapPin, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info,
  X,
  Maximize2,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { PageView, MenuItemData } from '../../types';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  featuredItems: MenuItemData[];
}

interface PhotoShowcaseItem {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  highlights: string[];
}

export function HomePage({ onNavigate, featuredItems }: HomePageProps) {
  const [activeItemModal, setActiveItemModal] = useState<MenuItemData | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<PhotoShowcaseItem | null>(null);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState<'all' | 'food' | 'drink'>('all');

  // The 4 authentic restaurant photos provided by the user (strictly unedited)
  const eccoPhotos: PhotoShowcaseItem[] = [
    {
      id: 'signage',
      url: '/assets/aistudio/Screenshot_2026-10-30_112056_dae7d738.png',
      title: 'The Iconic ÈC•CO Sign & Living Wall',
      subtitle: 'The Grand Entrance & Identity',
      category: 'Arrival & Ambiance',
      description: 'The illuminated ÈC•CO backlit signage mounted upon natural textured river pebble stone walls, illuminated by woven artisan pendant lanterns and framed with lush tropical greenery.',
      highlights: ['Backlit Artisan Signage', 'Natural Pebble Stone Wall', 'Tropical Living Flora', 'Woven Warm Lanterns']
    },
    {
      id: 'main-dining',
      url: '/assets/aistudio/Modern_Fine_Dining_47c95ceb.jpg',
      title: 'The Grand Dining Hall',
      subtitle: 'Skyline Vistas & Golden Glow',
      category: 'Main Hall',
      description: 'Plush emerald velvet dining chairs beneath tiered amber glass chandeliers, polished marble floors, and expansive floor-to-ceiling panoramic windows overlooking the illuminated Kigali night skyline.',
      highlights: ['Panoramic Kigali Skyline', 'Cascading Amber Chandeliers', 'Emerald Velvet Seating', 'Polished Marble Flooring']
    },
    {
      id: 'vip-salon',
      url: '/assets/aistudio/Moody_Luxury_Dining_Room_Inspiration_for_a_Bold__Elegant_Home_686a67cc.jpg',
      title: 'The VIP Private Salon',
      subtitle: 'Intimate Candlelit Luxury',
      category: 'Private Dining',
      description: 'An exclusive private dining sanctuary centered around a black gold-veined marble table, dramatic bronze chandelier, tapered candlelight, and tailored sommelier service.',
      highlights: ['Black Gold-Veined Marble', 'Dedicated Sommelier Pairing', 'Intimate Candlelit Table', 'Complete Executive Privacy']
    },
    {
      id: 'chef-artistry',
      url: '/assets/aistudio/10_sensationelle_Trendreisen_2026_entdecken__c3824a45.jpg',
      title: 'Gastronomic Artistry & Haute Cuisine',
      subtitle: 'The Culinary Craft in Action',
      category: 'The Kitchen',
      description: 'Executive Chef plating gourmet masterpieces with surgical precision, celebrating authentic Rwandan harvest elevated with refined European culinary techniques and delicate reductions.',
      highlights: ['Executive Chef Plating', 'Artisanal Reductions', 'Locally Harvested Produce', 'Haute Gastronomy']
    }
  ];

  const chefSignatures = featuredItems
    .filter(item => selectedHomeCategory === 'all' || item.type === selectedHomeCategory)
    .slice(0, 8);

  return (
    <div className="space-y-24 pb-20 font-sans text-neutral-200">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#D4AF37]/20">
        {/* Authentic ÈC•CO Signage Backdrop with Luxury Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/aistudio/Screenshot_2026-10-30_112056_dae7d738.png"
            alt="ÈC•CO Restaurant Kigali Illuminated Signage"
            className="w-full h-full object-cover scale-105 filter brightness-[0.32] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/75 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12)_0%,transparent_75%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 py-20">
          {/* Brand Badge */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#181714]/90 border border-[#D4AF37]/50 backdrop-blur-md text-[#E5C158] text-xs font-mono tracking-widest uppercase shadow-[0_0_25px_rgba(212,175,55,0.2)]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>ÈC•CO Restaurant • Kigali, KK 554</span>
            </div>
          </div>

          {/* Slogan & Title */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              A Symphony of Flavors, <br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] bg-clip-text text-transparent italic font-serif">
                Where Kigali Meets Culinary Artistry
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              Welcome to ÈC•CO. Immerse yourself in an intimate black-and-gold culinary sanctuary featuring panoramic skyline views, wood-grilled cuts, reserve cellar wines, and handcrafted signature cocktails at <strong className="text-white font-normal">KK 554, Kigali</strong>.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 text-black" />
              <span>Explore Culinary Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('reservation')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#181715]/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] text-sm tracking-wider font-semibold uppercase backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Reserve a Table</span>
            </button>

            <a
              href="https://wa.me/250701537890"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-[#E5C158] border border-neutral-700/80 text-xs tracking-wider font-mono uppercase backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Concierge: 0701537890</span>
            </a>
          </div>

          {/* Quick Pillars Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#D4AF37]/20 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400 block">Location</span>
                <span className="text-xs font-semibold text-white">KK 554, Kigali</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400 block">Hours</span>
                <span className="text-xs font-semibold text-white">10:00 – 23:00 Daily</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wine className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400 block">Sommelier</span>
                <span className="text-xs font-semibold text-white">Curated Wine Cellar</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400 block">Experience</span>
                <span className="text-xs font-semibold text-white">Executive Fine Dining</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 SPACES OF ÈC•CO — LUXURY ATMOSPHERE & ARTISTRY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D4AF37]/20 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#D4AF37] tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuaries of Elegance</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Experience the Four Facets of ÈC•CO
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              From our illuminated living entrance to panoramic skyline dining and private candlelight suites, every space is designed for unforgettable gastronomic memories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('reservation')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Your Table</span>
            </button>
          </div>
        </div>

        {/* The 4 Distinct Visual Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eccoPhotos.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActivePhotoModal(item)}
              className="group bg-[#141312] border border-neutral-800 hover:border-[#D4AF37]/60 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] cursor-pointer"
            >
              {/* Photo Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-transparent to-transparent opacity-80" />

                {/* Category Pill */}
                <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/30 text-[#E5C158] font-mono text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
                  <span>0{index + 1}</span>
                  <span className="text-neutral-500">•</span>
                  <span>{item.category}</span>
                </div>

                {/* Inspect Button Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 group-hover:border-[#D4AF37] text-neutral-300 group-hover:text-[#D4AF37] flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C158] block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#F3E5AB] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Highlights tags */}
                <div className="space-y-3 pt-2 border-t border-neutral-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {item.highlights.slice(0, 2).map((h, i) => (
                      <span 
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#E5C158] font-mono group-hover:translate-x-0.5 transition-transform">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Inspect Full View</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CULINARY ARTISTRY & SIGNATURE DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Chef Feature Card (Left Column) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 bg-[#121110] flex flex-col justify-between shadow-2xl group min-h-[500px]">
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/aistudio/10_sensationelle_Trendreisen_2026_entdecken__c3824a45.jpg"
                alt="Executive Chef Plating Gourmet Course at ÈC•CO"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/60 to-black/40" />
            </div>

            <div className="relative z-10 p-6 sm:p-8 flex items-start justify-between">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#D4AF37]/50 text-[#E5C158] text-xs font-mono uppercase tracking-wider shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Executive Culinary Direction</span>
              </div>

              <button
                onClick={() => setActivePhotoModal(eccoPhotos[3])}
                className="p-2.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition-colors cursor-pointer"
                title="View Full Resolution"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 p-6 sm:p-8 space-y-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E5C158] block">
                The Philosophy of Haute Cuisine
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                "Every plate is an orchestrated harmony of Rwandan terroir and refined gastronomy."
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                Our kitchen at KK 554 honors the balance of fire, acidity, and delicate herbal reductions. Each dish is hand-finished right before service to ensure flawless presentation and temperature.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onNavigate('menu')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Browse Full Menu (35+)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Signature Menu Selections (Right Column) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                  Curated Epicurean Highlights
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                  Chef’s Signature Selections
                </h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-[#141312] p-1 rounded-xl border border-neutral-800 text-xs font-mono">
                <button
                  onClick={() => setSelectedHomeCategory('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedHomeCategory === 'all'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedHomeCategory('food')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedHomeCategory === 'food'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Fine Dining
                </button>
                <button
                  onClick={() => setSelectedHomeCategory('drink')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedHomeCategory === 'drink'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Beverages
                </button>
              </div>
            </div>

            {/* List of Signature Dishes (Clean Luxury Typography Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {chefSignatures.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItemModal(item)}
                  className="bg-[#141312]/90 border border-neutral-800/80 hover:border-[#D4AF37]/50 rounded-2xl p-5 flex flex-col justify-between group transition-all duration-300 hover:bg-[#181715] hover:shadow-lg cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                        {item.type === 'food' ? 'Culinary Creation' : 'Signature Drink'}
                      </span>
                      <span className="text-sm font-mono font-bold text-[#E5C158] whitespace-nowrap">
                        {item.price.toLocaleString()} RWF
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#F3E5AB] transition-colors">
                      {item.name}
                    </h4>

                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Fresh Daily</span>
                    </span>

                    <span className="text-xs font-semibold text-neutral-300 group-hover:text-[#D4AF37] flex items-center gap-1 transition-colors">
                      <span>Recipe Notes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => onNavigate('menu')}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E5C158] hover:text-white transition-colors cursor-pointer"
              >
                <span>Explore Full 35+ Dish Menu with Sommeliers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE KIGALI EXPERIENCE & ATMOSPHERE COMPARISON */}
      <section className="bg-[#121110] border-y border-[#D4AF37]/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Staggered Dual Showcase of Dining Hall & VIP Salon */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
              {/* Grand Dining Hall Card */}
              <div 
                onClick={() => setActivePhotoModal(eccoPhotos[1])}
                className="space-y-3 group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-800 group-hover:border-[#D4AF37]/60 shadow-xl transition-all">
                  <img
                    src="/assets/aistudio/Modern_Fine_Dining_47c95ceb.jpg"
                    alt="Grand Dining Hall with Kigali Skyline"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono uppercase text-[#E5C158] block">Main Hall</span>
                    <h5 className="font-serif text-sm font-bold text-white">Grand Dining Experience</h5>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#1A1917] border border-[#D4AF37]/30 text-center space-y-0.5">
                  <span className="font-serif text-xl font-bold text-[#E5C158]">KK 554</span>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Panoramic Kigali</p>
                </div>
              </div>

              {/* VIP Salon Card */}
              <div 
                onClick={() => setActivePhotoModal(eccoPhotos[2])}
                className="space-y-3 pt-6 group cursor-pointer"
              >
                <div className="p-3.5 rounded-xl bg-[#1A1917] border border-[#D4AF37]/30 text-center space-y-0.5">
                  <span className="font-serif text-xl font-bold text-[#E5C158]">VIP Salon</span>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Candlelit Privacy</p>
                </div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-800 group-hover:border-[#D4AF37]/60 shadow-xl transition-all">
                  <img
                    src="/assets/aistudio/Moody_Luxury_Dining_Room_Inspiration_for_a_Bold__Elegant_Home_686a67cc.jpg"
                    alt="Moody Luxury VIP Dining Salon"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono uppercase text-[#E5C158] block">Private Suite</span>
                    <h5 className="font-serif text-sm font-bold text-white">VIP Executive Dining</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative & Reservation Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181715] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Our Hospitality Legacy</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                Designed for Connoisseurs of Taste & Setting
              </h2>

              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                At ÈC•CO Kigali, dining transcends sustenance into an orchestrated sensory ritual. From the glow of our signature stone-wall sign to the emerald warmth of our dining hall and the intimacy of our candlelit VIP enclave, every detail was chosen to celebrate world-class luxury in Rwanda.
              </p>

              <div className="space-y-3.5 text-xs text-neutral-400">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <p><strong className="text-white">The Grand Skyline Dining Hall:</strong> High-altitude views over Kigali with ambient amber lighting and fine acoustics.</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <p><strong className="text-white">Executive VIP Dining Suite:</strong> Private banquet seating up to 10 guests with dedicated waitstaff and bespoke menus.</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <p><strong className="text-white">Curated Sommelier Cellar:</strong> Vintage French Bordeaux, Marlborough Sauvignon Blanc, and artisan botanical cocktails.</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('reservation')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  Reserve Your Table
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs uppercase tracking-wider font-semibold text-white transition-colors cursor-pointer"
                >
                  Read Restaurant Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RESERVATION CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-r from-[#181715] via-[#121110] to-[#0D0C0B] p-8 sm:p-14 shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 hidden md:block overflow-hidden pointer-events-none">
            <img 
              src="/assets/aistudio/Moody_Luxury_Dining_Room_Inspiration_for_a_Bold__Elegant_Home_686a67cc.jpg" 
              alt="Background Ambiance" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E5C158] block">
              Direct Kigali Maître d' Booking
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              An Evening of Rare Distinction Awaits
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              Whether celebrating an anniversary, hosting an executive delegation, or enjoying an intimate date night in Kigali, our team ensures every detail is flawless. Contact our concierge at <strong className="text-white font-mono">0701537890</strong> or reserve your table online.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('reservation')}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-sm tracking-wider uppercase transition-all shadow-lg cursor-pointer"
              >
                Instant Table Reservation
              </button>
              <a
                href="https://wa.me/250701537890"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>WhatsApp Concierge: 0701537890</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO LIGHTBOX MODAL (To inspect user's unedited photos at maximum fidelity) */}
      {activePhotoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in overflow-y-auto"
          onClick={() => setActivePhotoModal(null)}
        >
          <div 
            className="bg-[#141312] border border-[#D4AF37]/50 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)] relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setActivePhotoModal(null)}
                className="p-2.5 rounded-full bg-black/80 text-white hover:bg-neutral-800 border border-neutral-700 hover:border-[#D4AF37] transition-colors shadow-lg cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="overflow-y-auto flex-1 flex flex-col md:flex-row">
              {/* Photo Display (Unedited original framing) */}
              <div className="md:w-3/5 bg-black flex items-center justify-center p-2 sm:p-4">
                <img
                  src={activePhotoModal.url}
                  alt={activePhotoModal.title}
                  className="max-h-[60vh] md:max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>

              {/* Photo Meta & Story */}
              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#141312] border-t md:border-t-0 md:border-l border-neutral-800">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{activePhotoModal.category}</span>
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                      {activePhotoModal.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                      {activePhotoModal.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                    {activePhotoModal.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono uppercase text-[#D4AF37] block">
                      Architectural & Dining Highlights:
                    </span>
                    <ul className="space-y-1.5">
                      {activePhotoModal.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setActivePhotoModal(null);
                      onNavigate('reservation');
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reserve in This Space</span>
                  </button>

                  <button
                    onClick={() => setActivePhotoModal(null)}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-xs font-mono uppercase transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISH DETAIL EXPLORATION MODAL */}
      {activeItemModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto"
          onClick={() => setActiveItemModal(null)}
        >
          <div 
            className="bg-[#141312] border border-[#D4AF37]/40 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar with Close Button */}
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setActiveItemModal(null)}
                className="p-2 rounded-full bg-black/80 text-white hover:bg-neutral-800 border border-neutral-700 hover:border-[#D4AF37] transition-colors shadow-lg cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Header Hero for Dish using Chef Artistry Image */}
              <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden">
                <img
                  src="/assets/aistudio/10_sensationelle_Trendreisen_2026_entdecken__c3824a45.jpg"
                  alt={activeItemModal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-transparent to-black/40" />
                <div className="absolute bottom-3 left-4 bg-black/90 backdrop-blur-md px-3.5 py-1 rounded-xl border border-[#D4AF37]/60 text-[#E5C158] font-mono text-sm sm:text-base font-bold shadow-xl">
                  {activeItemModal.price.toLocaleString()} RWF
                </div>
                <div className="absolute top-3 left-4 flex items-center gap-1.5">
                  <span className="bg-[#0D0C0B]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase text-neutral-300 border border-neutral-800">
                    {activeItemModal.type}
                  </span>
                  {activeItemModal.is_chef_special && (
                    <span className="bg-[#D4AF37] text-black px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      Chef Special
                    </span>
                  )}
                </div>
              </div>

              {/* Dish Information */}
              <div className="p-5 sm:p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] px-2 py-0.5 rounded bg-[#1C1A17] border border-[#D4AF37]/30">
                      {activeItemModal.type === 'food' ? 'Culinary Creation' : 'Artisanal Beverage'}
                    </span>
                    {activeItemModal.is_chef_special && (
                      <span className="text-[10px] font-mono uppercase text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        Executive Recommendation
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">{activeItemModal.name}</h2>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-2.5">{activeItemModal.description}</p>
                </div>

                {/* Culinary Details Badges */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-[#0D0C0B] rounded-2xl border border-neutral-800/80 text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Prep: <strong className="text-white">~{activeItemModal.prep_time_minutes || 20} mins</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Spice: <strong className="text-white">{activeItemModal.spicy_level ? `${activeItemModal.spicy_level}/3` : 'Mild'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Origin: <strong className="text-white">Authentic Kigali</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <UtensilsCrossed className="w-4 h-4 text-[#D4AF37]" />
                    <span>Fulfillment: <strong className="text-white">Dine-in / Delivery</strong></span>
                  </div>
                </div>

                {/* Additional Culinary Notes */}
                <div className="p-3 bg-[#181715] rounded-xl border border-neutral-800/60 text-[11px] text-neutral-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Dietary & Kitchen Notes</span>
                  </div>
                  <p>Prepared fresh at ÈC•CO Restaurant Kigali (KK 554). Available for guests across our main dining room, terrace, and private suites.</p>
                </div>
              </div>
            </div>

            {/* Modal Footer with Table Reservation Action */}
            <div className="p-4 sm:p-5 bg-[#100F0E] border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setActiveItemModal(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setActiveItemModal(null);
                  onNavigate('reservation');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a Table to Experience This Dish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
