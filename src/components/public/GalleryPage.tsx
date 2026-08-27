import React, { useState } from 'react';
import { 
  Sparkles, 
  Eye, 
  MapPin, 
  UtensilsCrossed, 
  Wine, 
  Calendar 
} from 'lucide-react';
import { PageView } from '../../types';

interface GalleryPageProps {
  onNavigate: (page: PageView) => void;
}

export function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [filter, setFilter] = useState<'all' | 'interior' | 'cuisine' | 'terrace'>('all');

  const galleryItems = [
    {
      id: 1,
      title: 'Grand Dining Hall & Chandelier',
      category: 'interior',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      caption: 'Gold acoustic accents and bespoke velvet booth seating.'
    },
    {
      id: 2,
      title: 'Grilled Prime Ribeye in Jus',
      category: 'cuisine',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
      caption: 'Locally aged beef with truffle potato purée.'
    },
    {
      id: 3,
      title: 'Kigali Sunset Terrace at Twilight',
      category: 'terrace',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Panoramic views overlooking the rolling hills of Kigali.'
    },
    {
      id: 4,
      title: 'Artisanal Kigali Sunset Cocktail',
      category: 'cuisine',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Smoked botanicals and passion fruit cordial.'
    },
    {
      id: 5,
      title: 'Private VIP Executive Suite',
      category: 'interior',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      caption: 'Intimate dining sanctuary for executive banquets.'
    },
    {
      id: 6,
      title: 'Sommelier Reserve Decanting',
      category: 'terrace',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Vintage wine service under terrace candlelight.'
    }
  ];

  const filtered = galleryItems.filter(item => filter === 'all' || item.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans text-neutral-200">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181715] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Ambiance & Culinary Visuals</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
          The Eko Visual Sanctuary
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
          Glimpse the refined atmospheres, dining rooms, and epicurean creations awaiting you at <strong className="text-white">KK 554, Kigali</strong>.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            filter === 'all'
              ? 'bg-[#E5C158] text-black font-bold shadow-md'
              : 'bg-[#141312] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          All Visuals
        </button>
        <button
          onClick={() => setFilter('interior')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            filter === 'interior'
              ? 'bg-[#E5C158] text-black font-bold shadow-md'
              : 'bg-[#141312] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Dining Halls
        </button>
        <button
          onClick={() => setFilter('cuisine')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            filter === 'cuisine'
              ? 'bg-[#E5C158] text-black font-bold shadow-md'
              : 'bg-[#141312] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Plated Artistry
        </button>
        <button
          onClick={() => setFilter('terrace')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            filter === 'terrace'
              ? 'bg-[#E5C158] text-black font-bold shadow-md'
              : 'bg-[#141312] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Sunset Terrace
        </button>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-[#141312] border border-neutral-800 hover:border-[#D4AF37]/50 shadow-xl transition-all duration-300"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
            <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C158] block">
                {item.category}
              </span>
              <h3 className="font-serif text-lg font-bold text-white leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-300 line-clamp-1">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Banner */}
      <div className="text-center pt-8">
        <button
          onClick={() => onNavigate('reservation')}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
        >
          Experience Eko in Person — Book a Table
        </button>
      </div>
    </div>
  );
}
