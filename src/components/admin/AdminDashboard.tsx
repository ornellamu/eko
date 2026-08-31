import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Utensils, 
  Calendar, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Mail, 
  DollarSign, 
  TrendingUp, 
  Users, 
  RefreshCw,
  Eye,
  AlertCircle,
  Sparkles,
  Database,
  ArrowRight,
  Sliders,
  Check,
  X,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { AuthUser, MenuItemData, CategoryItem, ReservationData } from '../../types';
import { 
  fetchMenuItems, 
  fetchCategories, 
  fetchAdminStats,
  fetchAdminReservations,
  updateAdminReservationStatus,
  toggleAdminMenuItemAvailability,
  createAdminMenuItem,
  fetchAdminActivityLogs,
  fetchPublicGallery,
  createAdminGalleryItem,
  deleteAdminGalleryItem,
  fetchAdminSettings,
  updateAdminSettings
} from '../../services/api';

interface AdminDashboardProps {
  currentUser: AuthUser;
  authToken: string | null;
  onLogout: () => void;
  onOpenStageVerification?: () => void;
}

export function AdminDashboard({
  currentUser,
  authToken,
  onLogout,
  onOpenStageVerification
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'menu' | 'reservations' | 'gallery' | 'settings' | 'logs'>('overview');
  
  // Data states
  const [metrics, setMetrics] = useState<any>(null);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [restaurantSettings, setRestaurantSettings] = useState<Record<string, string>>({});
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'all' | 'food' | 'drink'>('all');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Menu Item Form Modal
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    categoryId: 1,
    name: '',
    description: '',
    price: 15000,
    imageUrl: '',
    isChefSpecial: false,
    spicyLevel: 0,
    prepTimeMinutes: 20
  });

  // New Gallery Item Modal
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'Interior',
    displayOrder: 1
  });

  const showToast = (type: 'success' | 'error', text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  const loadData = async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      const [statsRes, resRes, menuRes, catRes, logsRes, galRes, setRes] = await Promise.all([
        fetchAdminStats(authToken).catch(() => ({ data: { metrics: null } })),
        fetchAdminReservations(authToken).catch(() => ({ data: { reservations: [] } })),
        fetchMenuItems().catch(() => ({ data: [] })),
        fetchCategories().catch(() => ({ data: [] })),
        fetchAdminActivityLogs(authToken).catch(() => ({ data: { logs: [] } })),
        fetchPublicGallery().catch(() => ({ data: { gallery: [] } })),
        fetchAdminSettings(authToken).catch(() => ({ data: { settings: {} } }))
      ]);

      setMetrics(statsRes.data?.metrics || null);
      setReservations(resRes.data?.reservations || []);
      setMenuItems(menuRes.data || []);
      setCategories(catRes.data || []);
      setActivityLogs(logsRes.data?.logs || []);
      setGalleryItems(galRes.data?.gallery || []);
      setRestaurantSettings(setRes.data?.settings || {});
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [authToken]);

  const handleReservationStatusUpdate = async (resId: number, newStatus: string) => {
    if (!authToken) return;
    try {
      await updateAdminReservationStatus(authToken, resId, newStatus);
      showToast('success', `Reservation #${resId} marked as ${newStatus}`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update reservation');
    }
  };

  const handleToggleAvailability = async (itemId: number, _currentStatus: boolean) => {
    if (!authToken) return;
    try {
      await toggleAdminMenuItemAvailability(authToken, itemId);
      showToast('success', `Dish status updated`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to toggle availability');
    }
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      await createAdminMenuItem(authToken, newMenuItem);
      showToast('success', `Dish "${newMenuItem.name}" created successfully`);
      setShowAddMenuModal(false);
      setNewMenuItem({
        categoryId: categories[0]?.id || 1,
        name: '',
        description: '',
        price: 15000,
        imageUrl: '',
        isChefSpecial: false,
        spicyLevel: 0,
        prepTimeMinutes: 20
      });
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create menu item');
    }
  };

  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      await createAdminGalleryItem(authToken, newGalleryItem);
      showToast('success', `Gallery photo "${newGalleryItem.title}" published`);
      setShowAddGalleryModal(false);
      setNewGalleryItem({
        title: '',
        description: '',
        imageUrl: '',
        category: 'Interior',
        displayOrder: 1
      });
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to add gallery item');
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!authToken) return;
    try {
      await deleteAdminGalleryItem(authToken, id);
      showToast('success', 'Gallery photo deleted');
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete gallery item');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      await updateAdminSettings(authToken, restaurantSettings);
      showToast('success', 'Restaurant settings saved and live');
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save settings');
    }
  };

  // Filtered menu
  const filteredMenu = menuItems.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0908] text-neutral-200 font-sans">
      {/* Toast Notice */}
      {notice && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-semibold text-xs border animate-in fade-in slide-in-from-bottom-2 ${
          notice.type === 'success' ? 'bg-[#D4AF37] text-black border-amber-300' : 'bg-rose-900 text-rose-100 border-rose-700'
        }`}>
          {notice.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="border-b border-neutral-800/80 bg-[#121110]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-wider text-white">EKO EXECUTIVE PORTAL</span>
                <span className="text-[10px] font-mono uppercase bg-amber-950/70 border border-amber-800/50 text-[#D4AF37] px-2 py-0.5 rounded-full">
                  Admin • Operations Suite
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-light">Kigali KK 554 • Live Dining Governance & Sommelier Catalog</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenStageVerification && (
              <button
                onClick={onOpenStageVerification}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#D4AF37]/60 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Verification Matrix</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-medium">{currentUser.full_name || currentUser.username}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="border-b border-neutral-800/60 bg-[#0E0D0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'overview'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Overview Metrics</span>
          </button>

          <button
            onClick={() => setActiveSection('reservations')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'reservations'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Maître d' Reservations ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'menu'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Menu Catalog ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'gallery'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Ambiance Gallery ({galleryItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'settings'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Restaurant Settings</span>
          </button>

          <button
            onClick={() => setActiveSection('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'logs'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Section 1: Overview Metrics */}
        {activeSection === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                  <span>Table Reservations</span>
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {reservations.length}
                </div>
                <p className="text-[11px] text-neutral-500">Terrace, Grand Hall & VIP Suite</p>
              </div>

              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                  <span>Active Menu Offerings</span>
                  <Utensils className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {menuItems.filter(m => m.is_available).length} / {menuItems.length}
                </div>
                <p className="text-[11px] text-neutral-500">Live on customer dining menu</p>
              </div>

              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                  <span>Ambiance Visuals</span>
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {galleryItems.length}
                </div>
                <p className="text-[11px] text-neutral-500">Photographs in live gallery</p>
              </div>
            </div>

            {/* Quick Reservations Overview */}
            <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="font-serif text-lg font-bold text-white">Upcoming Table Bookings</h3>
                <button onClick={() => setActiveSection('reservations')} className="text-xs text-[#D4AF37] hover:underline">
                  View all bookings
                </button>
              </div>
              <div className="space-y-3">
                {reservations.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4">No reservations logged yet.</p>
                ) : (
                  reservations.slice(0, 6).map((r: any) => (
                    <div key={r.id} className="p-3 bg-[#0D0C0B] border border-neutral-800/80 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-amber-300 font-bold block">{r.reference || `#RES-${r.id}`}</span>
                        <span className="text-neutral-400">{r.customer_name || r.guest_name || 'Guest'} • {r.party_size || r.guests_count || 2} Guests</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white block">{r.reservation_date} @ {r.reservation_time}</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-400">{r.status || 'confirmed'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Reservations Management */}
        {activeSection === 'reservations' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Maître d' Table Reservations</h3>
                <p className="text-xs text-neutral-400">Manage seating across Kigali Sunset Terrace, Grand Hall, and VIP Suite</p>
              </div>
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Reservations</span>
              </button>
            </div>

            <div className="bg-[#141312] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 uppercase bg-[#0D0C0B]/60">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Guest</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Party Size</th>
                    <th className="p-4">Seating</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-neutral-500 font-sans">
                        No reservations registered in database.
                      </td>
                    </tr>
                  ) : (
                    reservations.map((r: any) => (
                      <tr key={r.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="p-4 font-bold text-amber-300">{r.reference || `#RES-${r.id}`}</td>
                        <td className="p-4">
                          <span className="font-bold text-white block">{r.customer_name || r.guest_name || 'Guest'}</span>
                          <span className="text-[11px] text-neutral-400">{r.customer_phone || r.guest_phone || '—'}</span>
                        </td>
                        <td className="p-4 text-white">{r.reservation_date} • {r.reservation_time}</td>
                        <td className="p-4 text-amber-300 font-bold">{r.party_size || r.guests_count || 2} Guests</td>
                        <td className="p-4 capitalize text-neutral-300">{r.table_location || r.seating_preference || 'Main Hall'}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                            {r.status || 'confirmed'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={r.status || 'confirmed'}
                            onChange={(e) => handleReservationStatusUpdate(r.id, e.target.value)}
                            className="bg-[#0D0C0B] border border-neutral-700 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#D4AF37]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="seated">Seated</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Menu Catalog Management */}
        {activeSection === 'menu' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Menu & Beverage Catalog</h3>
                <p className="text-xs text-neutral-400">Total {menuItems.length} curated dishes & drinks at KK 554 Kigali</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddMenuModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:brightness-110"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Dish / Drink</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141312] p-4 rounded-2xl border border-neutral-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedType === 'all' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({menuItems.length})
                </button>
                <button
                  onClick={() => setSelectedType('food')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedType === 'food' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Food Only ({menuItems.filter(m => m.type === 'food').length})
                </button>
                <button
                  onClick={() => setSelectedType('drink')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedType === 'drink' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Drinks Only ({menuItems.filter(m => m.type === 'drink').length})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="bg-[#141312] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 uppercase font-mono bg-[#0D0C0B]/60">
                    <th className="p-4">Dish Details</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Price (RWF)</th>
                    <th className="p-4">Chef Special</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-sans">
                  {filteredMenu.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80'}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block text-sm">{item.name}</span>
                            <span className="text-[11px] text-neutral-400 line-clamp-1">{item.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono uppercase text-neutral-400">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${item.type === 'food' ? 'bg-amber-950 text-amber-300' : 'bg-purple-950 text-purple-300'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white text-sm">
                        {item.price.toLocaleString()} RWF
                      </td>
                      <td className="p-4">
                        {item.is_chef_special ? (
                          <span className="text-amber-300 font-bold flex items-center gap-1 text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Special</span>
                          </span>
                        ) : (
                          <span className="text-neutral-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleAvailability(item.id, item.is_available)}
                          className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold transition-all ${
                            item.is_available
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-900'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/50 hover:bg-rose-900'
                          }`}
                        >
                          {item.is_available ? 'Available' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="p-4 text-right font-mono">
                        <span className="text-neutral-500 text-xs">ID #{item.id}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 4: Ambiance Gallery Management */}
        {activeSection === 'gallery' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Ambiance Gallery Management</h3>
                <p className="text-xs text-neutral-400">Manage high-resolution restaurant photos showcased to patrons</p>
              </div>
              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:brightness-110"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ambiance Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((g) => (
                <div key={g.id} className="bg-[#141312] border border-neutral-800 rounded-2xl overflow-hidden group shadow-xl">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={g.image_url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#D4AF37]">
                      {g.category}
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-white text-sm">{g.title}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-1">{g.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteGalleryItem(g.id)}
                      className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-rose-400 transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Restaurant Settings */}
        {activeSection === 'settings' && (
          <div className="space-y-6 animate-in fade-in max-w-3xl">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Restaurant Operational Settings</h3>
              <p className="text-xs text-neutral-400">Configure global metadata, contact numbers, and opening schedules</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-neutral-300">Restaurant Name</label>
                <input
                  type="text"
                  value={restaurantSettings['restaurant_name'] || 'Eko Restaurant & Lounge'}
                  onChange={(e) => setRestaurantSettings({ ...restaurantSettings, restaurant_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-neutral-300">Phone Hotline</label>
                  <input
                    type="text"
                    value={restaurantSettings['contact_phone'] || '0701537890'}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, contact_phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-neutral-300">Contact Email</label>
                  <input
                    type="email"
                    value={restaurantSettings['contact_email'] || 'contact@ekorestaurant.rw'}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, contact_email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-neutral-300">Kigali Address</label>
                <input
                  type="text"
                  value={restaurantSettings['restaurant_address'] || 'KK 554, Kigali, Rwanda'}
                  onChange={(e) => setRestaurantSettings({ ...restaurantSettings, restaurant_address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-neutral-300">Opening Hours</label>
                <input
                  type="text"
                  value={restaurantSettings['opening_hours'] || 'Monday - Sunday: 10:00 AM - 11:00 PM'}
                  onChange={(e) => setRestaurantSettings({ ...restaurantSettings, opening_hours: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase shadow-md hover:brightness-110"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section 6: Audit Trail */}
        {activeSection === 'logs' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">System Audit Trail</h3>
              <p className="text-xs text-neutral-400">Detailed records of administrative changes and operations</p>
            </div>

            <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-2xl">
              {activityLogs.length === 0 ? (
                <p className="text-xs text-neutral-500 font-mono py-4">No audit logs recorded yet.</p>
              ) : (
                activityLogs.map((l: any, i: number) => (
                  <div key={i} className="p-3 bg-[#0D0C0B] border border-neutral-800/80 rounded-2xl flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[#D4AF37] font-bold block">{l.action || l.activity}</span>
                      <span className="text-neutral-400 text-[11px]">{l.details || l.description}</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">{l.created_at || l.timestamp || 'Recent'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Menu Item Modal */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141312] border border-[#D4AF37]/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-serif text-xl font-bold text-white">Add New Menu Dish or Drink</h3>
              <button
                onClick={() => setShowAddMenuModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Category</label>
                <select
                  value={newMenuItem.categoryId}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, categoryId: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Dish / Drink Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rwandan Volcano Flank"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Culinary composition and flavor notes..."
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Price in RWF *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Prep Time (mins)</label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={newMenuItem.prepTimeMinutes}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, prepTimeMinutes: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newMenuItem.imageUrl}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase shadow-md hover:brightness-110"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Gallery Item Modal */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141312] border border-[#D4AF37]/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-serif text-xl font-bold text-white">Add New Ambiance Photo</h3>
              <button
                onClick={() => setShowAddGalleryModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGalleryItem} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Category</label>
                <select
                  value={newGalleryItem.category}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Interior">Interior (Dining Halls)</option>
                  <option value="Terrace">Terrace (Sunset Views)</option>
                  <option value="Food">Food (Plated Artistry)</option>
                  <option value="Bar">Bar (Cocktails & Sommelier)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Champagne Lounge"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Caption / Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Atmosphere details..."
                  value={newGalleryItem.description}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newGalleryItem.imageUrl}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase shadow-md hover:brightness-110"
                >
                  Publish Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
