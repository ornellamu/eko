import React, { useState } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  UtensilsCrossed, 
  MapPin, 
  Clock, 
  Phone,
  Maximize2, 
  X, 
  Sparkles 
} from 'lucide-react';
import { PageView, MenuItemData } from '../../types';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  featuredItems?: MenuItemData[];
}

interface PhotoCard {
  id: string;
  url: string;
  label: string;
  title: string;
  tag: string;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [activePhoto, setActivePhoto] = useState<PhotoCard | null>(null);

  // The 3 authentic restaurant pictures organized to captivate guests
  const showcasePhotos: PhotoCard[] = [
    {
      id: 'entrance',
      url: '/assets/aistudio/1004091679450810463_30e50be3.jpg',
      label: 'The Arrival',
      tag: '01 • THE ENTRANCE',
      title: 'Illuminated Living Wall'
    },
    {
      id: 'main-dining',
      url: '/assets/aistudio/Modern_Fine_Dining_47c95ceb.jpg',
      label: 'The Main Hall',
      tag: '02 • SKYLINE DINING',
      title: 'Panoramic Amber Hall'
    },
    {
      id: 'vip-suite',
      url: '/assets/aistudio/Moody_Luxury_Dining_Room_Inspiration_for_a_Bold__Elegant_Home_686a67cc.jpg',
      label: 'The VIP Salon',
      tag: '03 • PRIVATE SUITE',
      title: 'Candlelit Marble Intimacy'
    }
  ];

  return (
    <div className="space-y-20 pb-20 font-sans text-neutral-200">
      {/* 1. HERO SECTION — Features the ONLY "Reserve a Table" and "Explore Menu" buttons on the Home Page */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#D4AF37]/20">
        {/* Background Image with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/aistudio/Chef_Apron_Design___Restaurant_Uniform_Branding_for_Principino_5105f53f.jpg"
            alt="ÈC•CO Restaurant Culinary Atmosphere"
            className="w-full h-full object-cover scale-105 filter brightness-[0.34] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/70 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.14)_0%,transparent_70%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181714]/90 border border-[#D4AF37]/50 backdrop-blur-md text-[#E5C158] text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ÈC•CO Restaurant • Kigali, KK 554</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              A Symphony of Flavors, <br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] bg-clip-text text-transparent italic font-serif">
                Where Kigali Meets Culinary Artistry
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              Fine dining, panoramic city skyline views, and intimate private candlelight enclaves at KK 554, Kigali.
            </p>
          </div>

          {/* SINGLE INSTANCE OF EACH FUNCTIONAL BUTTON ON THE HOME PAGE */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* The ONLY "Reserve a Table" button on the home page */}
            <button
              onClick={() => onNavigate('reservation')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>Reserve a Table</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* The ONLY "Explore Menu" button on the home page */}
            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#181715]/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] text-sm tracking-wider font-semibold uppercase backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#D4AF37]" />
              <span>Explore Menu</span>
            </button>
          </div>

          {/* Minimalist Info Bar */}
          <div className="pt-8 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-neutral-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>KK 554, Kigali</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Every Day, 10:00 – 23:00</span>
            </div>
            <a 
              href="https://wa.me/250701537890" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 text-[#E5C158] hover:underline"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>+250 701 537 890</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. THE THREE SPACES OF ÈC•CO — Pure Visual Showcase (No Repeated Action Buttons) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#D4AF37]/20 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block">
            The Ambiance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
            Three Sanctuaries of ÈC•CO
          </h2>
        </div>

        {/* The 3-Photo Magnetic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcasePhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-neutral-800 hover:border-[#D4AF37] transition-all duration-500 shadow-2xl cursor-pointer bg-neutral-950"
            >
              {/* Unedited original picture */}
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Vignette for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              {/* Top Tag */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#E5C158] font-mono text-[11px] font-semibold">
                {photo.tag}
              </div>

              {/* Inspect Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 group-hover:border-[#D4AF37] text-neutral-300 group-hover:text-[#D4AF37] flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 shadow-lg">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Bottom Title */}
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E5C158] block">
                  {photo.label}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#F3E5AB] transition-colors leading-snug">
                  {photo.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CONCIERGE & CONTACT CALLOUT — The ONLY "Contact" button on the Home Page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#D4AF37]/30 bg-[#121110] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#E5C158] block">
              Direct Inquiries
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Questions or Private Dining Arrangements?
            </h4>
            <p className="text-xs text-neutral-400 font-light">
              Speak directly with our Kigali maître d' team at KK 554.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* The ONLY Contact button on the home page */}
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-[#D4AF37] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Contact & Hours
            </button>
          </div>
        </div>
      </section>

      {/* FULL-RESOLUTION PHOTO LIGHTBOX */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md animate-in fade-in cursor-pointer"
          onClick={() => setActivePhoto(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-12 right-0 p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={activePhoto.url}
              alt={activePhoto.title}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl border border-neutral-800 shadow-2xl"
            />

            <div className="mt-4 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E5C158] block">
                {activePhoto.label}
              </span>
              <h4 className="font-serif text-xl font-bold text-white">
                {activePhoto.title}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
