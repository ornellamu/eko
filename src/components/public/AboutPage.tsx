import React from 'react';
import { 
  Award, 
  Heart, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  UtensilsCrossed, 
  Wine 
} from 'lucide-react';
import { PageView } from '../../types';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 font-sans text-neutral-200">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181715] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>The Story of Eko Restaurant</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Where Kigali Meets Culinary Artistry
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
          Founded with an uncompromising commitment to gastronomic excellence, Eko Restaurant is Kigali’s crown jewel for fine dining, blending continental mastery with indigenous culinary treasures.
        </p>
      </div>

      {/* Main Story Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
          <h2 className="font-serif text-3xl font-bold text-white leading-snug">
            A Symphony of Flavors Born in the Heart of Rwanda
          </h2>
          <p>
            Located at <strong className="text-white">KK 554, Kigali</strong>, Eko was established to redefine how fine dining is experienced in East Africa. We honor Rwanda’s rich agricultural bounty—from organic volcanic highland produce to prime meats and fresh Lake Kivu offerings.
          </p>
          <p>
            Our master culinary team pairs time-honored charcoal grilling and classic French sous-vide techniques with vibrant African spices, resulting in a 35-item menu that balances comfort with unforgettable surprise.
          </p>
          <p>
            Whether seated under the twilight glow of our panoramic Kigali Sunset Terrace or inside our opulent Grand Hall, each guest is greeted with the warmth and gracious hospitality that define Rwandan culture.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
            <div>
              <span className="font-serif text-3xl font-bold text-[#E5C158] block">35+</span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase">Original Items</span>
            </div>
            <div>
              <span className="font-serif text-3xl font-bold text-[#E5C158] block">100%</span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase">Fresh Ingredients</span>
            </div>
            <div>
              <span className="font-serif text-3xl font-bold text-[#E5C158] block">KK 554</span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase">Kigali Prime</span>
            </div>
          </div>
        </div>

        {/* Story Image */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
              alt="Eko Restaurant Interior Ambiance"
              className="w-full h-full object-cover aspect-[4/3]"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-[#161514] border border-[#D4AF37]/40 p-5 rounded-2xl hidden sm:block shadow-xl max-w-xs">
            <span className="text-[10px] font-mono uppercase text-[#D4AF37] block">Executive Chef's Creed</span>
            <p className="font-serif text-xs italic text-white mt-1">
              "We cook with soul, precision, and the deepest reverence for every ingredient that graces our kitchen."
            </p>
          </div>
        </div>
      </div>

      {/* Core Philosophies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="p-8 rounded-3xl bg-[#141312] border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Culinary Artistry</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Every plate is composed like a canvas, balancing visual elegance, aromatic harmony, texture, and taste.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#141312] border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center">
            <Wine className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Cellar Distinction</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Our sommelier curates prestigious old-world vintages and rare spirits to elevate every dining experience.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#141312] border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Kigali Graciousness</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Warm, attentive, and personalized hospitality making every anniversary, family dinner, or business meeting unforgettable.
          </p>
        </div>
      </div>
    </div>
  );
}
