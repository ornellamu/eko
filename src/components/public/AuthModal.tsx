import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { AuthUser } from '../../types';
import { customerLogin, customerRegister } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onLoginSuccess: (user: AuthUser, token: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');

  // Sync mode whenever initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setPassword('');
      setUsername('');
      setEmail('');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await customerRegister({
          email: email.trim(),
          password: password.trim(),
          fullName: fullName.trim(),
          phone: phone.trim()
        });
        if (res.data.token && res.data.user) {
          localStorage.setItem('ecco_auth_token', res.data.token);
          localStorage.setItem('eko_auth_token', res.data.token);
          onLoginSuccess(res.data.user, res.data.token);
          onClose();
        }
      } else {
        const res = await customerLogin({
          emailOrUsername: email.trim(),
          password: password.trim()
        });
        if (res.data.token && (res.data.user || res.data.admin)) {
          const authenticatedUser = res.data.user || res.data.admin!;
          localStorage.setItem('ecco_auth_token', res.data.token);
          localStorage.setItem('eko_auth_token', res.data.token);
          onLoginSuccess(authenticatedUser, res.data.token);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
      />

      <div className="relative bg-[#141312] border border-[#D4AF37]/30 text-neutral-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6B0D] p-[1px] overflow-hidden flex items-center justify-center bg-[#0D0C0B]">
              <img 
                src="/images/ecco-logo.svg" 
                alt="Ecco Logo" 
                referrerPolicy="no-referrer" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                {mode === 'register' ? 'Join Ecco Kigali' : 'Client Sign In'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {mode === 'register' ? 'Register to reserve tables and track dining' : 'Sign in to access your table bookings'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1 bg-[#0D0C0B] p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-lg font-semibold transition-all ${
              mode === 'login' ? 'bg-[#D4AF37] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 rounded-lg font-semibold transition-all ${
              mode === 'register' ? 'bg-[#D4AF37] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eric Manzi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0788 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-neutral-300 font-medium">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300 font-medium">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
            <span>
              {mode === 'register' ? 'Create Client Profile' : 'Sign In as Client'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
