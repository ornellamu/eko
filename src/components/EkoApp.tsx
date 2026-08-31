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
import { AdminDashboard } from './admin/AdminDashboard';
import { StageVerification } from './StageVerification';
import { Sparkles } from 'lucide-react';

export function EkoApp() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  // Toggle between public live restaurant and Dev Verification Matrix
  const [showDevTracker, setShowDevTracker] = useState(false);

  // Load initial data
  useEffect(() => {
    const token = localStorage.getItem('eko_auth_token');
    if (token) {
      setAuthToken(token);
      getMe(token)
        .then((res) => {
          if (res.data && res.data.user) {
            setCurrentUser(res.data.user);
          }
        })
        .catch(() => {
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
    localStorage.removeItem('eko_auth_token');
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const isAdmin = currentUser?.role === 'admin' || (currentUser as any)?.role === 'superadmin';

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
          <span>Return to Live Eko Restaurant</span>
        </button>
        <StageVerification />
      </div>
    );
  }

  // If Admin is active on Admin Dashboard
  if (currentPage === 'admin' && isAdmin) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        authToken={authToken}
        onLogout={handleLogout}
        onOpenStageVerification={() => setShowDevTracker(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0C0B] text-neutral-200 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB]">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'admin' && !isAdmin) {
            setAuthMode('admin');
            setIsAuthOpen(true);
          } else {
            setCurrentPage(page);
          }
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

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          if (page === 'admin' && !isAdmin) {
            setAuthMode('admin');
            setIsAuthOpen(true);
          } else {
            setCurrentPage(page);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'login');
          setIsAuthOpen(true);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onLoginSuccess={(user, token) => {
          setCurrentUser(user);
          setAuthToken(token);
          const userIsAdmin = user.role === 'admin' || (user as any).role === 'superadmin';
          if (userIsAdmin) {
            setCurrentPage('admin');
          } else {
            setCurrentPage('account');
          }
        }}
      />
    </div>
  );
}
