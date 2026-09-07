import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  UtensilsCrossed, 
  Wine, 
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { PageView } from '../../types';
import { fetchPublicGallery } from '../../services/api';

interface GalleryPageProps {
  onNavigate: (page: PageView) => void;
}

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  description: string;
}

const DEFAULT_GALLERY = [
  {
    id: 1,
    title: 'Ribeye Steak',
    category: 'Food',
    image_url: '/images/prime-ribeye-steak.jpg',
    description: '350g char-grilled aged prime beef ribeye steak with hasselback potato and red wine jus.'
  },
  {
    id: 2,
    title: 'Pornstar Martini',
    category: 'Drinks',
    image_url: '/images/pornstar-martini.jpg',
    description: 'Exquisite vanilla vodka, passion fruit purée, and a chilled side shot of sparkling Prosecco.'
  },
  {
    id: 3,
    title: 'Carpaccio',
    category: 'Food',
    image_url: '/images/avocado-carpaccio.jpg',
    description: 'Delicately sliced Hass avocado and sweet mango fan with whipped goat cheese and basil.'
  },
  {
    id: 4,
    title: 'Margarita',
    category: 'Drinks',
    image_url: '/images/golden-goss-cocktail.jpg',
    description: 'Artisanal cocktail with amber botanicals, fresh citrus, and delicate honeyed warmth.'
  },
  {
    id: 5,
    title: 'Gin & Tonic',
    category: 'Drinks',
    image_url: '/images/pink-gin-spritz.jpg',
    description: 'Botanical gin with wild berries, artisanal tonic, and fresh pink grapefruit wheel.'
  },
  {
    id: 6,
    title: 'Chicken Schnitzel',
    category: 'Food',
    image_url: '/images/chicken-schnitzel-fettuccine.jpg',
    description: 'Golden panko chicken over ribbon fettuccine in garlic-Parmigiano cream sauce.'
  },
  {
    id: 7,
    title: 'Ratatouille',
    category: 'Food',
    image_url: '/images/confit-byaldi-ratatouille.jpg',
    description: 'Medallions of squash, zucchini, eggplant, and tomato over piperade coulis.'
  },
  {
    id: 8,
    title: 'Grand Dining Hall & Chandelier',
    category: 'Interior',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    description: 'Gold acoustic accents and bespoke velvet booth seating.'
  },
  {
    id: 9,
    title: 'Kigali Sunset Terrace at Twilight',
    category: 'Terrace',
    image_url: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1000&q=80',
    description: 'Panoramic views overlooking the rolling hills of Kigali.'
  },
  {
    id: 10,
    title: 'Private VIP Executive Suite',
    category: 'Interior',
    image_url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1000&q=80',
    description: 'Intimate dining sanctuary for executive banquets.'
  }
];

export function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [filter, setFilter] = useState<string>('all');
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicGallery()
      .then((res) => {
        if (res.data && res.data.gallery && res.data.gallery.length > 0) {
          setItems(res.data.gallery);
        }
      })
      .catch(() => {
        // Fallback to default
      })
      .finally(() => setLoading(false));
  }, []);

  const categories: string[] = ['all', ...Array.from(new Set(items.map((i) => i.category || 'Interior'))).map(String)];

  const filtered = items.filter(
    (item) => filter === 'all' || (item.category && item.category.toLowerCase() === filter.toLowerCase())
  );

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
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all capitalize ${
              filter.toLowerCase() === cat.toLowerCase()
                ? 'bg-[#E5C158] text-black font-bold shadow-md'
                : 'bg-[#141312] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat === 'all' ? 'All Visuals' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Images */}
      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-mono text-xs">
          Loading culinary gallery...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-[#141312] border border-neutral-800 hover:border-[#D4AF37]/50 shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image_url}
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
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

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
