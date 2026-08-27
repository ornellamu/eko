import React, { useState } from 'react';
import { 
  Menu as MenuIcon, 
  X, 
  ShoppingBag, 
  Calendar, 
  Phone, 
  MapPin, 
  User, 
  LogOut, 
  ShieldCheck, 
  Clock,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { PageView, AuthUser } from '../../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'register' | 'admin') => void;
  onLogout: () => void;
  onToggleDevTracker: () => void;
}

export function Navbar({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAuth,
  onLogout,
  onToggleDevTracker
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Menu', page: 'menu' },
    { label: 'About Us', page: 'about' },
    { label: 'Ambiance Gallery', page: 'gallery' },
    { label: 'Contact & Hours', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0D0C0B]/95 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-[#161514] border-b border-neutral-800/60 px-4 py-1.5 text-xs text-neutral-300 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-[#E5C158]">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span>Kigali, KK 554</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 text-neutral-400">
              <Clock className="w-3 h-3 text-[#D4AF37]" />
              <span>Open Daily: 10:00 – 23:00</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <a 
              href="tel:0701537890" 
              className="flex items-center gap-1 text-neutral-300 hover:text-[#E5C158] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-mono">0701537890</span>
            </a>
            <span className="text-neutral-700">|</span>
            <button
              onClick={onToggleDevTracker}
              className="text-[#D4AF37] hover:underline font-mono text-[10px] uppercase tracking-wider"
            >
              Matrix Mode
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#AA7C11] to-[#6A4E08] p-[1px] shadow-[0_0_15px_rgba(212,175,55,0.25)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all">
              <div className="w-full h-full rounded-full bg-[#0D0C0B] flex items-center justify-center">
                <span className="font-serif font-bold text-xl text-[#E5C158] tracking-widest">E</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white group-hover:text-[#E5C158] transition-colors">
                  EKO
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.2 rounded uppercase">
                  Kigali
                </span>
              </div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                Culinary Artistry
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all relative ${
                  currentPage === link.page
                    ? 'text-[#E5C158] bg-[#1C1A17] border border-[#D4AF37]/30 shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Table Reservation Button */}
            <button
              onClick={() => onNavigate('reservation')}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                currentPage === 'reservation'
                  ? 'bg-[#E5C158] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black shadow-md'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Table</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2 bg-[#181715] border border-neutral-800 px-3 py-1.5 rounded-xl text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-neutral-200 font-medium truncate max-w-[100px]">
                  {currentUser.username || currentUser.full_name || 'Guest'}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-semibold">
                    Admin
                  </span>
                )}
                <button
                  onClick={onLogout}
                  className="text-neutral-400 hover:text-rose-400 ml-1 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121110] border-b border-neutral-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold ${
                  currentPage === link.page
                    ? 'bg-[#E5C158]/20 text-[#E5C158] border border-[#D4AF37]/30'
                    : 'text-neutral-300 hover:bg-neutral-800/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('reservation');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Table</span>
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 border border-rose-900/40"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout ({currentUser.username || 'User'})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 border border-neutral-800"
              >
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
