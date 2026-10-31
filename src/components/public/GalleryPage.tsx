import React, { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { PageView } from '../../types';

interface GalleryPageProps {
  onNavigate?: (page: PageView) => void;
}

export function GalleryPage({}: GalleryPageProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // The authentic luxury restaurant collection provided by the user
  const galleryPhotos: string[] = [
    '/assets/aistudio/Modern_Fine_Dining_47c95ceb.jpg',
    '/assets/gallery/steak_dinner_1793465516096.jpg',
    '/assets/gallery/cocktails_trio_1793465589022.jpg',
    '/assets/aistudio/Moody_Luxury_Dining_Room_Inspiration_for_a_Bold__Elegant_Home_686a67cc.jpg',
    '/assets/gallery/seafood_haute_cuisine_1793465571592.jpg',
    '/assets/gallery/amaretto_sour_1793465535909.jpg',
    '/assets/aistudio/10_sensationelle_Trendreisen_2026_entdecken__c3824a45.jpg',
    '/assets/gallery/cosmopolitan_cocktail_1793465553461.jpg',
    '/assets/aistudio/1004091679450810463_30e50be3.jpg'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12 font-sans text-neutral-200">
      {/* Minimalist Editorial Title (No descriptions, no buttons) */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] block">
          ÈC•CO KIGALI
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Visual Gallery
        </h1>
      </div>

      {/* Pure Luxury Photo Arrangement (Only pictures, no text or descriptions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {galleryPhotos.map((photoUrl, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhoto(photoUrl)}
            className="group relative rounded-3xl overflow-hidden bg-[#121110] border border-neutral-800/80 hover:border-[#D4AF37]/70 shadow-2xl transition-all duration-500 cursor-pointer"
          >
            {/* Elegant Portrait Aspect Ratio */}
            <div className="aspect-[3/4] w-full overflow-hidden bg-black/60">
              <img
                src={photoUrl}
                alt="ÈC•CO Fine Dining"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Subtle luxury ambient vignette on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Subtle corner inspect icon on hover */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-neutral-700/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
              <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
        ))}
      </div>

      {/* Clean Full-Screen Lightbox Modal (Picture only, no descriptions) */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
              aria-label="Close image"
            >
              <X className="w-7 h-7" />
            </button>

            <img
              src={selectedPhoto}
              alt="ÈC•CO Gallery Large View"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
