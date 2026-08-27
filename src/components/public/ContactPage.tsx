import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans text-neutral-200">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181715] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Kigali Guest Concierge</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Contact & Location Details
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
          We welcome your inquiries, feedback, VIP private event reservations, and catering inquiries. Reach our concierge team in Kigali directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Contact Form */}
        <div className="lg:col-span-7 bg-[#141312] border border-neutral-800 p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl">
          <h3 className="font-serif text-2xl font-bold text-white">Send Us a Direct Message</h3>

          {sent ? (
            <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-black flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-white">Inquiry Received</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Thank you, <strong className="text-[#E5C158]">{formData.name}</strong>. Our Kigali maître d' will review your message and respond promptly.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="px-5 py-2 rounded-xl bg-neutral-800 text-xs text-[#E5C158]"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jean-Luc"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jean@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Private Banquet Request / Sommelier Consultation"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can our hospitality team assist you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending...' : 'Submit Message to Concierge'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Details Strip */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#141312] border border-neutral-800 p-8 rounded-3xl space-y-6">
            <h3 className="font-serif text-xl font-bold text-white">Direct Contacts</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0D0C0B] border border-neutral-800 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Location</span>
                  <span className="font-semibold text-white">KK 554, Kigali, Rwanda</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0D0C0B] border border-neutral-800 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Phone / WhatsApp</span>
                  <a href="tel:0701537890" className="font-mono text-sm font-bold text-white hover:text-[#E5C158]">
                    0701537890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0D0C0B] border border-neutral-800 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Official Email</span>
                  <a href="mailto:mugishamp7@gmail.com" className="font-mono text-white hover:text-[#E5C158]">
                    mugishamp7@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0D0C0B] border border-neutral-800 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">Hours of Service</span>
                  <span className="text-white">Every day, 10:00 – 23:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
