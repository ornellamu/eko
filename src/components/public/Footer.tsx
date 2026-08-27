import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter, 
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { PageView } from '../../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'admin') => void;
}

export function Footer({ onNavigate, onOpenAuth }: FooterProps) {
  return (
    <footer className="bg-[#080707] border-t border-[#D4AF37]/20 text-neutral-400 font-sans">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6B0D] p-[1px]">
                <div className="w-full h-full rounded-full bg-[#080707] flex items-center justify-center">
                  <span className="font-serif font-bold text-lg text-[#E5C158]">E</span>
                </div>
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-widest text-white block">
                  EKO RESTAURANT
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                  Fine Dining Kigali
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-neutral-400 font-serif italic">
              "A Symphony of Flavors, Where Kigali Meets Culinary Artistry"
            </p>

            <p className="text-xs leading-relaxed text-neutral-500">
              Immerse yourself in authentic Rwandan gastronomy, wood-fired cuts, premium reserve vintages, and artisanal cocktails in the heart of Kigali.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#E5C158] hover:border-[#D4AF37]/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#E5C158] hover:border-[#D4AF37]/40 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#E5C158] hover:border-[#D4AF37]/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">
              Exploration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#E5C158] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>Grand Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#E5C158] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>Culinary & Drink Menu</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('reservation')}
                  className="hover:text-[#E5C158] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>Table Reservation</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#E5C158] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>Our Kigali Story</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#E5C158] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>Ambiance Gallery</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Concierge Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">
              Kigali Concierge
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Kigali, KK 554, Rwanda</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <a href="tel:0701537890" className="hover:text-[#E5C158] font-mono text-white block">
                    0701537890
                  </a>
                  <span className="text-[10px] text-neutral-500">Reservations & WhatsApp</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <a href="mailto:mugishamp7@gmail.com" className="hover:text-[#E5C158] font-mono text-white">
                  mugishamp7@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white">Every day, 10:00 – 23:00</span>
                  <span className="text-[10px] text-neutral-500 block">Kitchen closes at 22:30</span>
                </div>
              </li>
            </ul>
          </div>

          {/* VIP Seating & Administration */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">
              Private Dining & Events
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Host your private corporate banquets, anniversaries, and VIP sunset dinners at our Kigali terrace suites.
            </p>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => onNavigate('reservation')}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
              >
                Inquire For VIP Suite
              </button>

              <button
                onClick={() => onOpenAuth('admin')}
                className="w-full py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Admin Management Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-neutral-900 bg-[#040404] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Eko Restaurant Kigali. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Currency: <strong>RWF</strong></span>
            <span>•</span>
            <span>Certified Gastronomy</span>
            <span>•</span>
            <span className="text-[#D4AF37]">KK 554 Kigali</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
