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
  MessageSquare
} from 'lucide-react';

export function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '19:30',
    guests: '2',
    seatingArea: 'Kigali Sunset Terrace',
    specialRequests: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
    }, 1200);
  };

  const seatingOptions = [
    {
      id: 'terrace',
      name: 'Kigali Sunset Terrace',
      desc: 'Open-air panoramic views of Kigali hills, ambient evening warm lighting, and fresh breeze.'
    },
    {
      id: 'hall',
      name: 'Grand Dining Hall',
      desc: 'High ceilings, acoustic gold panelling, live sommelier decanting, and centerpiece chandelier.'
    },
    {
      id: 'vip',
      name: 'VIP Executive Suite',
      desc: 'Private soundproof dining lounge with dedicated maître d\', bespoke 7-course tasting menu service.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans text-neutral-200">
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
          We invite you to reserve your table at Eko Restaurant Kigali (<strong className="text-white">KK 554</strong>). Please specify your guest count, preferred ambiance zone, and arrival hour.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-[#141312] border border-neutral-800 p-8 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
          {confirmed ? (
            <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6B0D] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                <CheckCircle2 className="w-8 h-8 text-black stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-3xl font-bold text-white">Table Booking Confirmed</h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#E5C158]">{formData.name}</strong>. Your reservation for <strong className="text-white">{formData.guests} guests</strong> in the <strong className="text-white">{formData.seatingArea}</strong> on <strong className="text-white">{formData.date || 'your chosen date'}</strong> at <strong className="text-white">{formData.time}</strong> has been logged.
                </p>
              </div>

              <div className="p-4 bg-[#0D0C0B] border border-neutral-800 rounded-2xl max-w-md mx-auto text-left text-xs font-mono space-y-1.5 text-neutral-400">
                <p><span className="text-[#D4AF37]">Confirmation ID:</span> RES-{Math.floor(100000 + Math.random() * 900000)}</p>
                <p><span className="text-[#D4AF37]">Hotline Concierge:</span> 0701537890</p>
                <p><span className="text-[#D4AF37]">Location:</span> KK 554, Kigali</p>
              </div>

              <button
                onClick={() => {
                  setConfirmed(false);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    date: '',
                    time: '19:30',
                    guests: '2',
                    seatingArea: 'Kigali Sunset Terrace',
                    specialRequests: ''
                  });
                }}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-[#E5C158] border border-neutral-700 transition-colors"
              >
                Make Another Reservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. eric@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Number of Guests *</span>
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="1">1 Guest (Solo Dining)</option>
                    <option value="2">2 Guests (Couple / Intimate)</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests (Family / Business)</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="8+">8+ Guests (VIP Suite Inquire)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Reservation Date *</span>
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
                    <span>Arrival Time *</span>
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="12:00">12:00 PM (Lunch)</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="18:00">6:00 PM (Sunset Seating)</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM (Prime Dinner)</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM (Late Dining)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300 block">
                  Select Seating Area
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {seatingOptions.map((seat) => (
                    <button
                      key={seat.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, seatingArea: seat.name })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        formData.seatingArea === seat.name
                          ? 'bg-[#1C1A17] border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                          : 'bg-[#0D0C0B] border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span className="font-semibold text-xs text-white block">{seat.name}</span>
                      <span className="text-[10px] text-neutral-500 line-clamp-2 mt-1">{seat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Special Occasion or Dietary Preferences</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Anniversary, birthday cake arrangement, window view request, dietary allergies..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
              >
                {submitting ? 'Confirming with Maître d\'...' : 'Confirm Table Reservation'}
              </button>
            </form>
          )}
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#141312] border border-neutral-800 p-6 rounded-3xl space-y-6">
            <h3 className="font-serif text-xl font-bold text-white">Direct Concierge Assistance</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Prefer speaking directly with our dining coordinator? We are available daily via call and WhatsApp for instant seating arrangements.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-[#0D0C0B] border border-neutral-800 flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Direct Line</span>
                  <a href="tel:0701537890" className="font-mono text-sm font-bold text-white hover:text-[#E5C158]">
                    0701537890
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0C0B] border border-neutral-800 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Physical Address</span>
                  <span className="font-semibold text-white">KK 554, Kigali, Rwanda</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0C0B] border border-neutral-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Operational Hours</span>
                  <span className="text-white">10:00 – 23:00 (Every Day)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1C1A17] to-[#121110] border border-[#D4AF37]/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E5C158]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VIP Policy</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-white">Private Events & Large Parties</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Parties of 8 or more can request custom sommelier wine pairings and personalized tasting menus with 24-hour advance notice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
