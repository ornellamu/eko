import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar as CalendarIcon, 
  LogOut, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  RefreshCw,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { AuthUser, ReservationData } from '../../types';
import { fetchMyReservations } from '../../services/api';

interface CustomerDashboardProps {
  user: AuthUser;
  token: string;
  onLogout: () => void;
  onNavigateToMenu: () => void;
  onNavigateToReservation: () => void;
}

export function CustomerDashboard({
  user,
  token,
  onLogout,
  onNavigateToMenu,
  onNavigateToReservation
}: CustomerDashboardProps) {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const resRes = await fetchMyReservations(token).catch(() => ({ data: { reservations: [] } }));
      setReservations(resRes.data?.reservations || []);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans text-neutral-200">
      {/* Profile Header */}
      <div className="bg-[#141312] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-amber-300 text-black flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'E'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {user.full_name || user.username}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E5C158] text-[10px] font-mono uppercase tracking-wider">
                Eko Patron
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              {user.email} {user.phone && `• ${user.phone}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onNavigateToReservation}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Book Table</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-white">
              My Table Reservations ({reservations.length})
            </h2>
            <p className="text-xs text-neutral-400">
              Manage and view your upcoming dining bookings at KK 554, Kigali
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateToMenu}
          className="text-xs text-[#E5C158] hover:underline flex items-center gap-1 font-mono"
        >
          <span>Explore Culinary Menu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-20 text-neutral-500 font-mono text-xs">
          Loading your reservations...
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 bg-[#141312] border border-neutral-800 rounded-3xl space-y-4">
          <CalendarIcon className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="font-serif text-xl text-white">No Table Reservations Found</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Reserve your table in advance to experience authentic African & international fusion dining.
          </p>
          <button
            onClick={onNavigateToReservation}
            className="px-6 py-2.5 rounded-xl bg-[#E5C158] text-black font-serif font-bold text-xs uppercase tracking-wider"
          >
            Book a Table Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="bg-[#141312] border border-neutral-800 rounded-2xl p-6 space-y-4 hover:border-[#D4AF37]/50 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="font-mono text-xs text-[#E5C158] font-bold">
                  Ref: {res.reference || `#RES-${res.id}`}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase">
                  {res.status || 'Confirmed'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-500">Date:</span>
                  <span className="font-mono font-semibold text-white">{res.reservation_date}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-500">Time:</span>
                  <span className="font-mono font-semibold text-white">{res.reservation_time}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-500">Guests:</span>
                  <span className="font-mono font-semibold text-white">{res.party_size} Guests</span>
                </div>
                {res.table_location && (
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="text-neutral-500">Seating:</span>
                    <span className="font-mono text-[#E5C158] capitalize">{res.table_location}</span>
                  </div>
                )}
              </div>

              {res.special_requests && (
                <div className="p-3 bg-[#0D0C0B] rounded-xl border border-neutral-800 text-[11px] text-neutral-400">
                  <span className="text-neutral-300 font-medium block mb-0.5">Special Requests:</span>
                  {res.special_requests}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
