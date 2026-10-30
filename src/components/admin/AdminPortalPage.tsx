import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  RefreshCw, 
  ArrowLeft, 
  AlertCircle,
  Sparkles,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { AuthUser } from '../../types';
import { adminLogin } from '../../services/api';
import { AdminDashboard } from './AdminDashboard';

interface AdminPortalPageProps {
  currentUser: AuthUser | null;
  authToken: string | null;
  onAdminLoginSuccess: (admin: AuthUser, token: string) => void;
  onLogout: () => void;
  onNavigateToPublic: () => void;
  onOpenStageVerification: () => void;
}

export function AdminPortalPage({
  currentUser,
  authToken,
  onAdminLoginSuccess,
  onLogout,
  onNavigateToPublic,
  onOpenStageVerification
}: AdminPortalPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = currentUser && (currentUser.role === 'admin' || (currentUser as any).role === 'superadmin') && !!authToken;

  // If already authenticated with valid admin credentials, show the dashboard
  if (isAdmin) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        authToken={authToken}
        onLogout={onLogout}
        onNavigateToPublic={onNavigateToPublic}
        onOpenStageVerification={onOpenStageVerification}
      />
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide your administrator username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await adminLogin({
        emailOrUsername: username.trim(),
        password: password.trim()
      });

      if (res.data && res.data.token && res.data.admin) {
        localStorage.setItem('eko_auth_token', res.data.token);
        onAdminLoginSuccess({ ...res.data.admin, role: 'admin' }, res.data.token);
      } else {
        throw new Error('Administrative credentials could not be verified.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrator username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070706] text-neutral-200 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB]">
      {/* Top Bar with quick back navigation */}
      <header className="border-b border-[#262420] bg-[#0c0b0a]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button
          onClick={onNavigateToPublic}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-[#D4AF37] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Exit to Public Restaurant</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Secure Admin Gateway • Route: <code className="text-[#D4AF37]">/admin</code>
          </span>
        </div>
      </header>

      {/* Main Login Screen */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-[#121110] border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-8 relative overflow-hidden">
          {/* Subtle gold decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Brand & Security Header */}
          <div className="text-center space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#AA7C11] to-[#593E07] p-[1.5px] mx-auto shadow-[0_0_24px_rgba(212,175,55,0.35)] flex items-center justify-center bg-[#070706]">
              <img 
                src="/images/eko-logo.jpg" 
                alt="Eko Emblem" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Executive Operations</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                Admin Management Portal
              </h1>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Dedicated management access for Éko Restaurant Kigali. Please authenticate with executive credentials.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span>Username or Admin Email</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin or mucyo357@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0909] border border-neutral-700/80 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0909] border border-neutral-700/80 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B8860B] hover:brightness-110 active:scale-[0.99] text-black font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-black" />
                  <span>Authenticate & Enter Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 border-t border-neutral-800/80 text-center space-y-3">
            <p className="text-[11px] text-neutral-500">
              Direct access restricted to authorized general managers & concierge staff.
            </p>
            <div>
              <button
                type="button"
                onClick={onNavigateToPublic}
                className="text-xs text-neutral-400 hover:text-[#D4AF37] underline decoration-neutral-700 hover:decoration-[#D4AF37] transition-colors"
              >
                Go to Éko Kigali Public Menu & Dining Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
