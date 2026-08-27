import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Utensils, 
  Calendar, 
  ShoppingBag, 
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
import { AuthUser, MenuItemData, CategoryItem, OrderData, ReservationData } from '../../types';
import { 
  fetchMenuItems, 
  fetchCategories, 
  fetchAdminStats,
  fetchAdminOrders,
  updateAdminOrderStatus,
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
  const [activeSection, setActiveSection] = useState<'overview' | 'menu' | 'reservations' | 'orders' | 'gallery' | 'settings' | 'logs'>('overview');
  
  // Data states
  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
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
      const [statsRes, ordersRes, resRes, menuRes, catRes, logsRes, galRes, setRes] = await Promise.all([
        fetchAdminStats(authToken).catch(() => ({ data: { metrics: null } })),
        fetchAdminOrders(authToken).catch(() => ({ data: { orders: [] } })),
        fetchAdminReservations(authToken).catch(() => ({ data: { reservations: [] } })),
        fetchMenuItems().catch(() => ({ data: [] })),
        fetchCategories().catch(() => ({ data: [] })),
        fetchAdminActivityLogs(authToken).catch(() => ({ data: { logs: [] } })),
        fetchPublicGallery().catch(() => ({ data: { gallery: [] } })),
        fetchAdminSettings(authToken).catch(() => ({ data: { settings: {} } }))
      ]);

      setMetrics(statsRes.data?.metrics || null);
      setOrders(ordersRes.data?.orders || []);
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

  const handleOrderStatusUpdate = async (orderId: number, newStatus: string) => {
    if (!authToken) return;
    try {
      await updateAdminOrderStatus(authToken, orderId, newStatus);
      showToast('success', `Order #${orderId} marked as ${newStatus}`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update order');
    }
  };

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

  const handleToggleItem = async (itemId: number) => {
    if (!authToken) return;
    try {
      await toggleAdminMenuItemAvailability(authToken, itemId);
      showToast('success', 'Item availability updated in live menu');
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to toggle item');
    }
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      await createAdminMenuItem(authToken, newMenuItem);
      showToast('success', `"${newMenuItem.name}" created and added to live menu`);
      setShowAddMenuModal(false);
      setNewMenuItem({
        categoryId: 1,
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
      showToast('error', err.message || 'Failed to create item');
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
                  Admin • Master Suite
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-light">Kigali KK 554 • Live Operations & Governance</p>
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
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'orders'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders Dispatch ({orders.length})</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                  <span>Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {(metrics?.totalRevenueRwf || 0).toLocaleString()} <span className="text-xs font-sans text-amber-300">RWF</span>
                </div>
                <p className="text-[11px] text-neutral-500">Combined Kigali delivery & dine-in orders</p>
              </div>

              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                  <span>Total Placed Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {orders.length}
                </div>
                <p className="text-[11px] text-emerald-400">
                  {orders.filter(o => o.status === 'delivered' || o.status === 'completed').length} completed
                </p>
              </div>

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
                  <span>Active Menu Dishes</span>
                  <Utensils className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {menuItems.filter(m => m.is_available).length} / {menuItems.length}
                </div>
                <p className="text-[11px] text-neutral-500">Live on customer ordering menu</p>
              </div>
            </div>

            {/* Quick Orders & Reservations Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h3 className="font-serif text-lg font-bold text-white">Live Dispatches</h3>
                  <button onClick={() => setActiveSection('orders')} className="text-xs text-[#D4AF37] hover:underline">
                    View all orders
                  </button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="p-3 bg-[#0D0C0B] border border-neutral-800/80 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-amber-300 font-bold block">{o.order_number}</span>
                        <span className="text-neutral-400">{o.customer_name} • {o.order_type}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white block">{o.total_amount.toLocaleString()} RWF</span>
                        <span className="text-[10px] uppercase font-bold text-amber-400">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reservations */}
              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h3 className="font-serif text-lg font-bold text-white">Upcoming Table Bookings</h3>
                  <button onClick={() => setActiveSection('reservations')} className="text-xs text-[#D4AF37] hover:underline">
                    View all bookings
                  </button>
                </div>
                <div className="space-y-3">
                  {reservations.slice(0, 5).map((r) => (
                    <div key={r.id} className="p-3 bg-[#0D0C0B] border border-neutral-800/80 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-amber-300 font-bold block">{r.reservation_code}</span>
                        <span className="text-neutral-400">{r.guest_name} • {r.guests_count} Guests</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white block">{r.reservation_date} @ {r.reservation_time}</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-400">{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Orders Management */}
        {activeSection === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Live Orders Dispatch</h3>
                <p className="text-xs text-neutral-400">Track and advance order states across Kigali delivery, pickup, and dine-in</p>
              </div>
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Orders</span>
              </button>
            </div>

            <div className="bg-[#141312] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 uppercase bg-[#0D0C0B]/60">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Advance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="p-4 font-bold text-amber-300">{o.order_number}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{o.customer_name}</span>
                        <span className="text-[11px] text-neutral-400">{o.customer_phone}</span>
                      </td>
                      <td className="p-4 uppercase text-neutral-400">{o.order_type}</td>
                      <td className="p-4 font-bold text-white">{o.total_amount.toLocaleString()} RWF</td>
                      <td className="p-4 uppercase text-neutral-400">{o.payment_method}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.status === 'delivered' || o.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                            : o.status === 'preparing' || o.status === 'out_for_delivery'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)}
                          className="bg-[#0D0C0B] border border-neutral-700 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Reservations Management */}
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
                    <th className="p-4">Code</th>
                    <th className="p-4">Guest</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Guests</th>
                    <th className="p-4">Zone</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Seating Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="p-4 font-bold text-amber-300">{r.reservation_code}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{r.guest_name}</span>
                        <span className="text-[11px] text-neutral-400">{r.guest_phone}</span>
                      </td>
                      <td className="p-4 text-white">{r.reservation_date} • {r.reservation_time}</td>
                      <td className="p-4 text-amber-300 font-bold">{r.guests_count} Guests</td>
                      <td className="p-4 capitalize text-neutral-300">{r.seating_preference || 'Grand Hall'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.status === 'confirmed' || r.status === 'seated'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={r.status}
                          onChange={(e) => handleReservationStatusUpdate(r.id, e.target.value)}
                          className="bg-[#0D0C0B] border border-neutral-700 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="seated">Seated</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 4: Menu Items Management */}
        {activeSection === 'menu' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Menu Catalog & Pricing</h3>
                <p className="text-xs text-neutral-400">Control availability and exact RWF pricing for all dishes and beverages</p>
              </div>
              <button
                onClick={() => setShowAddMenuModal(true)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish / Wine</span>
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141312] p-4 rounded-2xl border border-neutral-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedType === 'all' ? 'bg-[#D4AF37] text-black font-bold' : 'bg-neutral-900 text-neutral-400'
                  }`}
                >
                  All Items ({menuItems.length})
                </button>
                <button
                  onClick={() => setSelectedType('food')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedType === 'food' ? 'bg-[#D4AF37] text-black font-bold' : 'bg-neutral-900 text-neutral-400'
                  }`}
                >
                  Cuisine Only
                </button>
                <button
                  onClick={() => setSelectedType('drink')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedType === 'drink' ? 'bg-[#D4AF37] text-black font-bold' : 'bg-neutral-900 text-neutral-400'
                  }`}
                >
                  Beverages & Wines
                </button>
              </div>

              <div className="relative w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="bg-[#141312] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 uppercase bg-[#0D0C0B]/60">
                    <th className="p-4">Dish / Beverage</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Price (RWF)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Availability Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredMenu.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80'}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-900"
                          />
                          <div>
                            <p className="font-serif text-sm font-bold text-white">{item.name}</p>
                            <p className="text-[11px] text-neutral-400 truncate max-w-xs font-sans">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 uppercase text-neutral-400">{item.type}</td>
                      <td className="p-4 font-bold text-amber-300">{item.price.toLocaleString()} RWF</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.is_available 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                            : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                        }`}>
                          {item.is_available ? 'Available' : 'Sold Out'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleItem(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            item.is_available
                              ? 'bg-neutral-800 hover:bg-rose-950 hover:text-rose-300 text-neutral-300'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                          }`}
                        >
                          {item.is_available ? 'Disable Item' : 'Enable Item'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 5: Gallery Management (Stage 13) */}
        {activeSection === 'gallery' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Ambiance Gallery Management</h3>
                <p className="text-xs text-neutral-400">Curate photo visual assets across Sunset Terrace, Dining Halls, Bar, and Cuisine</p>
              </div>
              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gallery Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item.id} className="bg-[#141312] border border-neutral-800 rounded-3xl overflow-hidden shadow-xl group">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-neutral-700 text-[#D4AF37] text-[10px] font-mono uppercase px-2.5 py-1 rounded-full">
                      {item.category || 'Interior'}
                    </div>
                    <button
                      onClick={() => handleDeleteGalleryItem(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/80 text-neutral-400 hover:text-rose-400 border border-neutral-700 hover:border-rose-900 transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 space-y-1">
                    <h4 className="font-serif text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Restaurant Settings Management (Stage 13) */}
        {activeSection === 'settings' && (
          <div className="space-y-6 animate-in fade-in max-w-3xl">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Dynamic Restaurant Metadata</h3>
              <p className="text-xs text-neutral-400">Edit real-time location address, contact numbers, slogan, opening hours and delivery fees</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 font-mono">Restaurant Name</label>
                  <input
                    type="text"
                    value={restaurantSettings.restaurant_name || 'Eko Restaurant'}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, restaurant_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 font-mono">Location Address</label>
                  <input
                    type="text"
                    value={restaurantSettings.address || 'Kigali, KK 554'}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 font-mono">Phone Number</label>
                  <input
                    type="text"
                    value={restaurantSettings.phone || '0701537890'}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 font-mono">WhatsApp Concierge</label>
                  <input
                    type="text"
                    value={restaurantSettings.whatsapp || '0701537890'}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 font-mono">Email Address</label>
                  <input
                    type="email"
                    value={restaurantSettings.email || 'mugishamp7@gmail.com'}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 font-mono">Opening Hours</label>
                  <input
                    type="text"
                    value={restaurantSettings.opening_hours || 'Every day, 10:00–23:00'}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, opening_hours: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 font-mono">Brand Slogan</label>
                <input
                  type="text"
                  value={restaurantSettings.slogan || 'A Symphony of Flavors, Where Kigali Meets Culinary Artistry'}
                  onChange={(e) => setRestaurantSettings({ ...restaurantSettings, slogan: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 font-mono">About Story</label>
                <textarea
                  rows={3}
                  value={restaurantSettings.about_story || 'Eko Restaurant celebrates the vibrant tapestry of Kigali fine-dining with artisanal local ingredients and international culinary technique.'}
                  onChange={(e) => setRestaurantSettings({ ...restaurantSettings, about_story: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Restaurant Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section 7: Activity Logs */}
        {activeSection === 'logs' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">System & Security Audit Trail</h3>
              <p className="text-xs text-neutral-400">Security audit trail of administrator and automated dispatch events</p>
            </div>

            <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-3 font-mono text-xs shadow-2xl">
              {activityLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-[#0D0C0B] border border-neutral-800 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-[#D4AF37] font-bold text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-neutral-300">{log.details}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Menu Item Modal */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141312] border border-[#D4AF37]/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-serif text-xl font-bold text-white">Add New Menu Item</h3>
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
                <label className="text-neutral-300 font-medium">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rwandan Lake Kivu Brochettes"
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
                  placeholder="Culinary notes, marinade, origin..."
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
