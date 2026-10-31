import React, { useState, useEffect } from 'react';
import { PageView, MenuItemData, CategoryItem, AuthUser } from '../types';
import { 
  fetchMenuItems, 
  fetchCategories, 
  fetchPublicInfo,
  userLogout,
  getMe
} from '../services/api';
import { Navbar } from './public/Navbar';
import { Footer } from './public/Footer';
import { HomePage } from './public/HomePage';
import { MenuPage } from './public/MenuPage';
import { ReservationPage } from './public/ReservationPage';
import { AboutPage } from './public/AboutPage';
import { GalleryPage } from './public/GalleryPage';
import { ContactPage } from './public/ContactPage';
import { CustomerDashboard } from './public/CustomerDashboard';
import { AuthModal } from './public/AuthModal';
import { AdminPortalPage } from './admin/AdminPortalPage';
import { StageVerification } from './StageVerification';
import { Sparkles } from 'lucide-react';

const checkIsAdminRoute = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' || 
    path.startsWith('/admin/') || 
    hash === '#admin' || 
    hash === '#/admin' || 
    hash.startsWith('#/admin/')
  );
};

export function EkoApp() {
  const [isAdminRoute, setIsAdminRoute] = useState(checkIsAdminRoute);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  // Toggle between public live restaurant and Dev Verification Matrix
  const [showDevTracker, setShowDevTracker] = useState(false);

  // Sync route changes (popstate & hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Load initial data
  useEffect(() => {
    const token = localStorage.getItem('ecco_auth_token') || localStorage.getItem('eko_auth_token');
    if (token) {
      setAuthToken(token);
      getMe(token)
        .then((res) => {
          if (res.data && res.data.user) {
            setCurrentUser(res.data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('ecco_auth_token');
          localStorage.removeItem('eko_auth_token');
          setAuthToken(null);
          setCurrentUser(null);
        });
    }

    Promise.all([
      fetchMenuItems().catch(() => ({ data: [] })),
      fetchCategories().catch(() => ({ data: [] })),
      fetchPublicInfo().catch(() => ({ data: null }))
    ]).then(([menuRes, catRes]) => {
      setMenuItems(menuRes.data || []);
      setCategories(catRes.data || []);
    });
  }, []);

  const handleLogout = async () => {
    await userLogout().catch(() => {});
    localStorage.removeItem('ecco_auth_token');
    localStorage.removeItem('eko_auth_token');
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  // If developer toggles the Verification Matrix
  if (showDevTracker) {
    return (
      <div className="relative">
        {/* Floating return to live restaurant button */}
        <button
          onClick={() => setShowDevTracker(false)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase rounded-xl shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Sparkles className="w-4 h-4" />
          <span>Return to Live Ecco Restaurant</span>
        </button>
        <StageVerification />
      </div>
    );
  }

  // SPECIAL ROUTE: If accessing /admin or #/admin, render isolated AdminPortalPage without user page
  if (isAdminRoute) {
    return (
      <AdminPortalPage
        currentUser={currentUser}
        authToken={authToken}
        onAdminLoginSuccess={(adminUser, token) => {
          setCurrentUser(adminUser);
          setAuthToken(token);
        }}
        onLogout={handleLogout}
        onNavigateToPublic={() => {
          if (window.location.hash.toLowerCase().includes('admin')) {
            window.location.hash = '';
          }
          window.history.pushState(null, '', '/');
          setIsAdminRoute(false);
          setCurrentPage('home');
        }}
        onOpenStageVerification={() => setShowDevTracker(true)}
      />
    );
  }

  return (
    <div className="min-h-screen relative text-neutral-200 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB]">
      {/* Global Cinematic Website Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/aistudio/Chef_Apron_Design___Restaurant_Uniform_Branding_for_Principino_5105f53f.jpg"
          alt="Ecco Fine Dining Culinary Background"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.24] contrast-[1.15] saturate-[1.1]"
        />
        {/* Luxury Vignette & Deep Atmosphere Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080706]/92 via-[#0A0908]/82 to-[#080706]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_75%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentUser={currentUser}
          onOpenAuth={(mode) => {
            setAuthMode(mode || 'login');
            setIsAuthOpen(true);
          }}
          onLogout={handleLogout}
          onToggleDevTracker={() => setShowDevTracker(true)}
        />

        {/* Main Page View Router */}
        <main className="flex-1">
          {currentPage === 'home' && (
            <HomePage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            featuredItems={menuItems}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            menuItems={menuItems}
            categories={categories}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'reservation' && (
          <ReservationPage 
            authToken={authToken}
            currentUser={currentUser}
            onOpenAuth={(mode) => {
              setAuthMode(mode || 'login');
              setIsAuthOpen(true);
            }}
            onAuthSuccess={(user, token) => {
              setCurrentUser(user);
              setAuthToken(token);
            }}
          />
        )}

        {currentPage === 'account' && currentUser && authToken && (
          <CustomerDashboard
            user={currentUser}
            token={authToken}
            onLogout={handleLogout}
            onNavigateToMenu={() => setCurrentPage('menu')}
            onNavigateToReservation={() => setCurrentPage('reservation')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Footer (without admin portal button) */}
      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'login');
          setIsAuthOpen(true);
        }}
      />

      {/* Auth Modal (client registration and login only) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onLoginSuccess={(user, token) => {
          setCurrentUser(user);
          setAuthToken(token);
          setCurrentPage('account');
        }}
      />
      </div>
    </div>
  );
}

export const EccoApp = EkoApp;

