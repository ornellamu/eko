import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  UtensilsCrossed, 
  Award, 
  Wine, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info,
  X
} from 'lucide-react';
import { PageView, MenuItemData } from '../../types';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  featuredItems: MenuItemData[];
}

export function HomePage({ onNavigate, featuredItems }: HomePageProps) {
  const [activeItemModal, setActiveItemModal] = useState<MenuItemData | null>(null);

  // Prioritize signature and new highlighted creations for the homepage
  const [selectedHomeCategory, setSelectedHomeCategory] = useState<'all' | 'food' | 'drink'>('all');
  
  const chefSignatures = featuredItems
    .filter(item => selectedHomeCategory === 'all' || item.type === selectedHomeCategory)
    .slice(0, 8);

  return (
    <div className="space-y-24 pb-20 font-sans text-neutral-200">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#D4AF37]/20">
        {/* Background Image with Deep Vignette & Luxury Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
            alt="Eko Restaurant Fine Dining Kigali Ambiance"
            className="w-full h-full object-cover scale-105 filter brightness-[0.38] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/60 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 py-20">
          {/* Brand Logo Crest & Subtle Tagline Badge */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#8C6B0D] shadow-[0_0_35px_rgba(212,175,55,0.4)] overflow-hidden bg-[#0D0C0B]">
              <img 
                src="/images/eko-logo.jpg" 
                alt="Eko Restaurant Crest Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181714]/80 border border-[#D4AF37]/40 backdrop-blur-md text-[#E5C158] text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Kigali's Premier Gastronomic Destination</span>
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
              Experience masterfully curated dishes, wood-grilled cuts, reserve cellar wines, and handcrafted signature cocktails in an intimate black-and-gold sanctuary at <strong className="text-white font-normal">KK 554, Kigali</strong>.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 group"
            >
              <UtensilsCrossed className="w-4 h-4 text-black" />
              <span>Explore Culinary Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('reservation')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#181715]/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-[#D4AF37]/40 hover:border-[#D4AF37] text-sm tracking-wider font-semibold uppercase backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Reserve a Table</span>
            </button>
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
                <span className="text-xs font-semibold text-white">Executive Dining</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHEF'S SIGNATURE SELECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D4AF37]/20 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#D4AF37] tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Epicurean Highlights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              Chef’s Signature Selections
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Authentic ingredients prepared with meticulous European and African culinary techniques.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#141312] p-1 rounded-xl border border-neutral-800 text-xs font-mono">
              <button
                onClick={() => setSelectedHomeCategory('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedHomeCategory === 'all'
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Creations
              </button>
              <button
                onClick={() => setSelectedHomeCategory('food')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedHomeCategory === 'food'
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Fine Dining
              </button>
              <button
                onClick={() => setSelectedHomeCategory('drink')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedHomeCategory === 'drink'
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Beverages & Coffee
              </button>
            </div>

            <button
              onClick={() => onNavigate('menu')}
              className="hidden sm:flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E5C158] hover:text-white transition-colors"
            >
              <span>View Full Menu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dishes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chefSignatures.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveItemModal(item);
              }}
              className="bg-[#141312] border border-neutral-800/80 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D4AF37]/30 text-[#E5C158] font-mono text-xs font-bold">
                  {item.price.toLocaleString()} RWF
                </div>
                <div className="absolute top-3 left-3 bg-[#0D0C0B]/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-neutral-300">
                  {item.type}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#E5C158] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>In Kitchen</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItemModal(item);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#D4AF37] hover:text-black border border-neutral-700 hover:border-[#D4AF37] text-xs font-semibold text-neutral-200 transition-all active:scale-95 flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE KIGALI EXPERIENCE / STORY TEASER */}
      <section className="bg-[#121110] border-y border-[#D4AF37]/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80"
                  alt="Fine Dining Table Setting at Eko"
                  className="rounded-2xl object-cover aspect-[3/4] border border-neutral-800 shadow-xl"
                />
                <div className="p-4 rounded-2xl bg-[#1A1917] border border-[#D4AF37]/30 text-center space-y-1">
                  <span className="font-serif text-2xl font-bold text-[#E5C158]">KK 554</span>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Heart of Kigali</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="p-4 rounded-2xl bg-[#1A1917] border border-[#D4AF37]/30 text-center space-y-1">
                  <span className="font-serif text-2xl font-bold text-[#E5C158]">35+</span>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Dishes & Wines</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80"
                  alt="Artisanal Wine Pouring at Eko"
                  className="rounded-2xl object-cover aspect-[3/4] border border-neutral-800 shadow-xl"
                />
              </div>
            </div>

            {/* Narrative Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181715] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Our Culinary Vision</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                Crafted for Discerning Palates in Rwanda
              </h2>

              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                At Eko Restaurant, we believe that dinner is not merely a meal, but an unforgettable sensory performance. Nestled in Kigali, we harmoniously blend rich African heritage with refined modern gastronomy.
              </p>

              <div className="space-y-3 text-xs text-neutral-400">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <p><strong className="text-white">Locally Sourced Prime Cuts:</strong> Tender cuts expertly grilled with aromatic native herbs and reduction jus.</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <p><strong className="text-white">Sommelier Selection:</strong> Vintage French, Italian, and South African wines paired to each course.</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <p><strong className="text-white">VIP Private Dining:</strong> Exclusive terraces with panoramic Kigali skyline sunsets.</p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs uppercase tracking-wider font-semibold text-white transition-colors"
                >
                  Read Our Story
                </button>
                <button
                  onClick={() => onNavigate('reservation')}
                  className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Reserve Your Evening
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RESERVATION BANNER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-r from-[#181715] via-[#121110] to-[#0D0C0B] p-8 sm:p-14 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E5C158] block">
              Direct Kigali Maître d' Booking
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              An Evening of Rare Distinction Awaits
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              Whether celebrating a milestone or hosting an executive lunch, our team ensures every detail is flawless. Contact our concierge at <strong className="text-white font-mono">0701537890</strong> or book online instantly.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('reservation')}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-sm tracking-wider uppercase transition-all shadow-lg"
              >
                Instant Table Reservation
              </button>
              <a
                href="https://wa.me/250701537890"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dish Detail Exploration Modal */}
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
                className="p-2 rounded-full bg-black/80 text-white hover:bg-neutral-800 border border-neutral-700 hover:border-[#D4AF37] transition-colors shadow-lg"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Image Section */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-900 overflow-hidden">
                <img
                  src={activeItemModal.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'}
                  alt={activeItemModal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-md px-3.5 py-1 rounded-xl border border-[#D4AF37]/60 text-[#E5C158] font-mono text-sm sm:text-base font-bold shadow-xl">
                  {activeItemModal.price.toLocaleString()} RWF
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
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
                  <p>Prepared fresh at Eko Restaurant Kigali (KK 554). Available for dine-in guests across our main dining room, terrace, and private suites.</p>
                </div>
              </div>
            </div>

            {/* Modal Footer with Table Reservation Action */}
            <div className="p-4 sm:p-5 bg-[#100F0E] border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setActiveItemModal(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setActiveItemModal(null);
                  onNavigate('reservation');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
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
