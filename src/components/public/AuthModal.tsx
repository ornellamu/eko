import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Key, 
  Sparkles, 
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { AuthUser } from '../../types';
import { customerLogin, customerRegister, adminLogin } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'admin';
  onLoginSuccess: (user: AuthUser, token: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('Admin');

  // Sync mode whenever initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      if (initialMode === 'admin') {
        setUsername('Admin');
        setPassword('admin123');
      }
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'admin') {
        const res = await adminLogin({
          emailOrUsername: username || 'Admin',
          password: password || 'admin123'
        });
        if (res.data.token && res.data.admin) {
          localStorage.setItem('eko_auth_token', res.data.token);
          onLoginSuccess({ ...res.data.admin, role: 'admin' }, res.data.token);
          onClose();
        }
      } else if (mode === 'register') {
        const res = await customerRegister({
          email,
          password,
          fullName,
          phone
        });
        if (res.data.token && res.data.user) {
          localStorage.setItem('eko_auth_token', res.data.token);
          onLoginSuccess(res.data.user, res.data.token);
          onClose();
        }
      } else {
        const res = await customerLogin({
          emailOrUsername: email,
          password
        });
        if (res.data.token && (res.data.user || res.data.admin)) {
          const authenticatedUser = res.data.user || res.data.admin!;
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

  const handle1ClickAdmin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await adminLogin({
        emailOrUsername: 'Admin',
        password: 'admin123'
      });
      if (res.data.token && res.data.admin) {
        localStorage.setItem('eko_auth_token', res.data.token);
        onLoginSuccess({ ...res.data.admin, role: 'admin' }, res.data.token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Quick Admin login failed');
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
                src="/images/eko-logo.jpg" 
                alt="Eko Logo" 
                referrerPolicy="no-referrer" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              {mode === 'admin' ? 'Administrator Login' : mode === 'register' ? 'Join Eko Kigali' : 'Guest Sign In'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-3 gap-1 bg-[#0D0C0B] p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-1.5 rounded-lg font-semibold transition-all ${
              mode === 'login' ? 'bg-[#D4AF37] text-black' : 'text-neutral-400 hover:text-white'
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
            className={`py-1.5 rounded-lg font-semibold transition-all ${
              mode === 'register' ? 'bg-[#D4AF37] text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin');
              setError(null);
            }}
            className={`py-1.5 rounded-lg font-semibold transition-all ${
              mode === 'admin' ? 'bg-[#D4AF37] text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Admin
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
                  placeholder="e.g. 0788 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </>
          )}

          {mode === 'admin' ? (
            <div className="space-y-1">
              <label className="text-neutral-300 font-medium">Admin Username or Email</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-neutral-300 font-medium">Email Address</label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}

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
              {mode === 'admin' ? 'Login as Admin' : mode === 'register' ? 'Create Guest Profile' : 'Sign In to Eko'}
            </span>
          </button>

          {mode === 'admin' && (
            <button
              type="button"
              onClick={handle1ClickAdmin}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1C1A17] border border-[#D4AF37]/50 text-[#E5C158] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#252320]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant 1-Click Master Admin Login (Admin / admin123)</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
