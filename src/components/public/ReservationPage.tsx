import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  User, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  ChevronRight,
  MessageSquare,
  Search,
  Copy,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { createReservation, lookupReservation } from '../../services/api';
import { ReservationData } from '../../types';

interface ReservationPageProps {
  authToken?: string | null;
  currentUser?: any | null;
}

export function ReservationPage({ authToken, currentUser }: ReservationPageProps) {
  const [activeTab, setActiveTab] = useState<'book' | 'lookup'>('book');

  // Booking Form State
  const [formData, setFormData] = useState({
    name: currentUser?.full_name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: '2',
    seatingArea: 'sunset_terrace' as 'main_dining' | 'sunset_terrace' | 'vip_suite' | 'any',
    occasion: 'Dinner with Friends',
    specialRequests: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<ReservationData | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Lookup State
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState<ReservationData | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await createReservation({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || 'guest@eko-kigali.rw',
        reservationDate: formData.date,
        reservationTime: formData.time,
        partySize: parseInt(formData.guests, 10),
        seatingArea: formData.seatingArea,
        occasion: formData.occasion,
        specialRequests: formData.specialRequests
      }, authToken || undefined);

      if (res.data && res.data.reservation) {
        setConfirmedReservation(res.data.reservation);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim()) return;
    setLookupLoading(true);
    setLookupError(null);
    try {
      const res = await lookupReservation(lookupCode.trim());
      if (res.data && res.data.reservation) {
        setLookupResult(res.data.reservation);
      } else {
        throw new Error('Reservation not found');
      }
    } catch (err: any) {
      setLookupError(err.message || 'Reservation not found. Please check code.');
      setLookupResult(null);
    } finally {
      setLookupLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans text-neutral-200">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181715] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Maître d’ Table Seating</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Reserve Your Dining Experience
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
          We invite you to reserve your table at Eko Restaurant Kigali (<strong className="text-white">KK 554</strong>). Every reservation is verified and prepared with personalized table settings.
        </p>

        {/* Tab Toggle */}
        <div className="inline-flex items-center p-1 bg-[#141312] border border-neutral-800 rounded-xl mt-4">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'book'
                ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Book a Table
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'lookup'
                ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Look up Booking Code
          </button>
        </div>
      </div>

      {activeTab === 'book' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#141312] border border-neutral-800 p-8 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
            {confirmedReservation ? (
              <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6B0D] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                  <CheckCircle2 className="w-8 h-8 text-black stroke-[2.5]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl font-bold text-white">Table Reserved!</h3>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#E5C158]">{confirmedReservation.customer_name}</strong>. Your reservation for <strong className="text-white">{confirmedReservation.party_size} guests</strong> on <strong className="text-white">{confirmedReservation.reservation_date}</strong> at <strong className="text-white">{confirmedReservation.reservation_time}</strong> is officially registered.
                  </p>
                </div>

                <div className="p-5 bg-[#0D0C0B] border border-[#D4AF37]/40 rounded-2xl max-w-md mx-auto text-left text-xs font-mono space-y-2 text-neutral-300 shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-[#D4AF37] font-bold">Booking Code</span>
                    <button
                      onClick={() => copyCode(confirmedReservation.reservation_code)}
                      className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 rounded text-white text-[11px]"
                    >
                      <Copy className="w-3 h-3 text-[#D4AF37]" />
                      <span>{copiedCode ? 'Copied!' : confirmedReservation.reservation_code}</span>
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Seating Area:</span>
                    <span className="text-white uppercase">{confirmedReservation.seating_area.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Party Size:</span>
                    <span className="text-white">{confirmedReservation.party_size} Guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Address:</span>
                    <span className="text-white">KK 554, Kigali</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-800">
                    <span className="text-neutral-500">Hotline:</span>
                    <span className="text-amber-400">0701537890</span>
                  </div>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  <a
                    href={`https://wa.me/250701537890?text=${encodeURIComponent(`Hello Eko Maître d', I booked table ${confirmedReservation.reservation_code} for ${confirmedReservation.party_size} guests on ${confirmedReservation.reservation_date} at ${confirmedReservation.reservation_time}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-[#1C1A17] border border-[#D4AF37]/40 text-white font-mono text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Confirm via WhatsApp (0701537890)</span>
                  </a>

                  <button
                    onClick={() => {
                      setConfirmedReservation(null);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        date: new Date().toISOString().split('T')[0],
                        time: '19:30',
                        guests: '2',
                        seatingArea: 'sunset_terrace',
                        occasion: 'Dinner with Friends',
                        specialRequests: ''
                      });
                    }}
                    className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-400 border border-neutral-700 transition-colors"
                  >
                    Make Another Booking
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Full Guest Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eric Manzi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Phone / WhatsApp *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0788 123 456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Hour (10:00-22:30) *</span>
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="12:00">12:00 PM (Lunch)</option>
                      <option value="13:00">01:00 PM (Lunch)</option>
                      <option value="14:00">02:00 PM (Afternoon)</option>
                      <option value="18:00">06:00 PM (Sunset)</option>
                      <option value="19:00">07:00 PM (Dinner)</option>
                      <option value="19:30">07:30 PM (Dinner)</option>
                      <option value="20:00">08:00 PM (Evening)</option>
                      <option value="21:00">09:00 PM (Late Dining)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Party Size *</span>
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="1">1 Guest (Solo)</option>
                      <option value="2">2 Guests (Couple)</option>
                      <option value="4">4 Guests (Dining)</option>
                      <option value="6">6 Guests (Party)</option>
                      <option value="8">8 Guests (Executive)</option>
                      <option value="12">12+ Guests (Private Suite)</option>
                    </select>
                  </div>
                </div>

                {/* Seating Area Radio Selection */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-medium text-neutral-300 block">Ambiance Seating Preference</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, seatingArea: 'sunset_terrace' })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        formData.seatingArea === 'sunset_terrace'
                          ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158] shadow-md'
                          : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                      }`}
                    >
                      <span className="font-bold text-xs block text-white">Sunset Terrace</span>
                      <span className="text-[10px] text-neutral-400 mt-1 block">Kigali hills skyline</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, seatingArea: 'main_dining' })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        formData.seatingArea === 'main_dining'
                          ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158] shadow-md'
                          : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                      }`}
                    >
                      <span className="font-bold text-xs block text-white">Grand Hall</span>
                      <span className="text-[10px] text-neutral-400 mt-1 block">Chandelier & acoustics</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, seatingArea: 'vip_suite' })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        formData.seatingArea === 'vip_suite'
                          ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158] shadow-md'
                          : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                      }`}
                    >
                      <span className="font-bold text-xs block text-white">VIP Suite</span>
                      <span className="text-[10px] text-neutral-400 mt-1 block">Private lounge</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">Special Notes / Dietary Requests</label>
                  <textarea
                    rows={3}
                    placeholder="Allergies, table positioning, champagne upon arrival..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {submitting ? 'Confirming Reservation...' : 'Confirm Table Booking'}
                </button>
              </form>
            )}
          </div>

          {/* Right Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141312] border border-neutral-800 p-6 sm:p-8 rounded-3xl space-y-6">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <span>The Eko Reservation Protocol</span>
              </h3>

              <div className="space-y-4 text-xs text-neutral-300 leading-relaxed font-light">
                <div className="p-3.5 bg-[#0D0C0B] rounded-2xl border border-neutral-800 space-y-1">
                  <h4 className="font-bold text-white text-xs">Zero Booking Surcharge</h4>
                  <p className="text-neutral-400">All standard reservations carry no advance deposit. You pay solely for items ordered from our authentic RWF culinary menu.</p>
                </div>

                <div className="p-3.5 bg-[#0D0C0B] rounded-2xl border border-neutral-800 space-y-1">
                  <h4 className="font-bold text-white text-xs">15-Minute Grace Holding</h4>
                  <p className="text-neutral-400">Tables are held for 15 minutes past your scheduled hour. If delayed along Kigali traffic, notify our concierge hotline.</p>
                </div>

                <div className="p-3.5 bg-[#0D0C0B] rounded-2xl border border-neutral-800 space-y-1">
                  <h4 className="font-bold text-white text-xs">Concierge Hotline & WhatsApp</h4>
                  <p className="text-neutral-400">Direct concierge phone: <strong className="text-[#E5C158]">0701537890</strong> or email <strong className="text-[#E5C158]">mugishamp7@gmail.com</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Lookup Tab */
        <div className="max-w-2xl mx-auto space-y-8">
          <form onSubmit={handleLookupSubmit} className="flex items-center gap-2 p-2 bg-[#141312] border border-[#D4AF37]/30 rounded-2xl shadow-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Booking Code (e.g. RES-2026-X9A2)"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-white placeholder-neutral-500 focus:outline-none uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={lookupLoading}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase shadow-md hover:brightness-110"
            >
              {lookupLoading ? 'Searching...' : 'Find Booking'}
            </button>
          </form>

          {lookupError && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p>{lookupError}</p>
            </div>
          )}

          {lookupResult && (
            <div className="p-6 bg-[#141312] border border-[#D4AF37]/40 rounded-3xl space-y-4 shadow-2xl animate-in fade-in">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                <div>
                  <span className="text-xs font-mono text-[#D4AF37]">Reservation Code</span>
                  <h3 className="font-serif text-xl font-bold text-white">{lookupResult.reservation_code}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-xs font-mono font-bold uppercase">
                  {lookupResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-neutral-300">
                <p><span className="text-neutral-500">Guest:</span> {lookupResult.customer_name}</p>
                <p><span className="text-neutral-500">Phone:</span> {lookupResult.customer_phone}</p>
                <p><span className="text-neutral-500">Date:</span> {lookupResult.reservation_date}</p>
                <p><span className="text-neutral-500">Time:</span> {lookupResult.reservation_time}</p>
                <p><span className="text-neutral-500">Party:</span> {lookupResult.party_size} Guests</p>
                <p><span className="text-neutral-500">Area:</span> {lookupResult.seating_area.replace(/_/g, ' ')}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
