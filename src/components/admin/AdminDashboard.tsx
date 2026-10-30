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
  Trash2,
  Truck,
  ExternalLink,
  Edit3,
  CheckCircle,
  ChevronRight,
  User,
  UserCheck,
  Coffee,
  Wine,
  FileText,
  BarChart3,
  Globe,
  UserPlus,
  MessageCircle,
  Award,
  Percent,
  Menu as MenuIcon
} from 'lucide-react';
import { AuthUser, MenuItemData, CategoryItem, ReservationData } from '../../types';
import { 
  fetchMenuItems, 
  fetchCategories, 
  fetchAdminStats,
  fetchAdminReservations,
  updateAdminReservationStatus,
  createAdminReservation,
  deleteAdminReservation,
  fetchAdminOrders,
  updateAdminOrderStatus,
  toggleAdminMenuItemAvailability,
  createAdminMenuItem,
  updateAdminMenuItem,
  deleteAdminMenuItem,
  fetchAdminActivityLogs,
  fetchPublicGallery,
  createAdminGalleryItem,
  deleteAdminGalleryItem,
  fetchAdminSettings,
  updateAdminSettings,
  fetchAdminCustomers,
  createAdminCustomer,
  updateAdminCustomer,
  deleteAdminCustomer,
  fetchAdminStatistics
} from '../../services/api';

interface AdminDashboardProps {
  currentUser: AuthUser;
  authToken: string | null;
  onLogout: () => void;
  onNavigateToPublic?: () => void;
  onOpenStageVerification?: () => void;
}

export function AdminDashboard({
  currentUser,
  authToken,
  onLogout,
  onNavigateToPublic,
  onOpenStageVerification
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'menu' | 'reservations' | 'orders' | 'customers' | 'statistics' | 'content' | 'logs'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data states
  const [metrics, setMetrics] = useState<any>(null);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [restaurantSettings, setRestaurantSettings] = useState<Record<string, string>>({});
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [reservationToDelete, setReservationToDelete] = useState<any | null>(null);

  // Customer Management state
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTierFilter, setCustomerTierFilter] = useState<'all' | 'VIP Patron' | 'Frequent Guest' | 'Regular Guest'>('all');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    tier: 'VIP Patron',
    notes: ''
  });
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<any | null>(null);

  // Statistics state
  const [statisticsData, setStatisticsData] = useState<any>(null);

  // Filters
  const [reservationFilter, setReservationFilter] = useState<'all' | 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled'>('all');
  const [reservationSearch, setReservationSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'>('all');
  const [selectedMenuType, setSelectedMenuType] = useState<'all' | 'food' | 'drink'>('all');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Modals
  // 1. Receive New Booking (Intake)
  const [showAddReservationModal, setShowAddReservationModal] = useState(false);
  const [newReservation, setNewReservation] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '19:30',
    partySize: 2,
    seatingArea: 'sunset_terrace' as 'main_dining' | 'sunset_terrace' | 'vip_suite' | 'any',
    tableNumber: 'Terrace T-01',
    occasion: '',
    specialRequests: '',
    status: 'confirmed' as 'pending' | 'confirmed' | 'seated'
  });

  // 2. Edit / Assign Table Modal
  const [editingReservation, setEditingReservation] = useState<any | null>(null);
  const [selectedClientInfo, setSelectedClientInfo] = useState<any | null>(null);
  const [editResForm, setEditResForm] = useState({
    status: 'confirmed',
    tableNumber: '',
    adminNotes: ''
  });

  // 3. New Menu Item Modal
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

  // 4. Edit Menu Item Modal
  const [editingMenuItem, setEditingMenuItem] = useState<any | null>(null);

  // 5. New Gallery Item Modal
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
    setTimeout(() => setNotice(null), 4000);
  };

  const loadData = async (manual = false) => {
    const token = authToken || 'admin_direct_access';
    try {
      setLoading(true);
      const [statsRes, resRes, ordersRes, menuRes, catRes, logsRes, galRes, setRes, custRes, detailStatsRes] = await Promise.all([
        fetchAdminStats(token).catch(() => ({ data: { metrics: null } })),
        fetchAdminReservations(token).catch(() => ({ data: { reservations: [] } })),
        fetchAdminOrders(token).catch(() => ({ data: { orders: [] } })),
        fetchMenuItems().catch(() => ({ data: [] })),
        fetchCategories().catch(() => ({ data: [] })),
        fetchAdminActivityLogs(token).catch(() => ({ data: { logs: [] } })),
        fetchPublicGallery().catch(() => ({ data: { gallery: [] } })),
        fetchAdminSettings(token).catch(() => ({ data: { settings: {} } })),
        fetchAdminCustomers(token).catch(() => ({ data: { customers: [] } })),
        fetchAdminStatistics(token).catch(() => ({ data: { statistics: null } }))
      ]);

      setMetrics(statsRes.data?.metrics || null);
      setReservations(resRes.data?.reservations || []);
      setOrders(ordersRes.data?.orders || []);
      setMenuItems(menuRes.data || []);
      setCategories(catRes.data || []);
      setActivityLogs(logsRes.data?.logs || []);
      setGalleryItems(galRes.data?.gallery || []);
      setRestaurantSettings(setRes.data?.settings || {});
      setCustomers(custRes.data?.customers || []);
      setStatisticsData(detailStatsRes.data?.statistics || null);
      setLastRefreshed(new Date());

      if (manual) {
        showToast('success', 'Admin dashboard refreshed successfully with live data');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [authToken]);

  useEffect(() => {
    if (!autoRefreshEnabled || !authToken) return;
    const interval = setInterval(() => {
      loadData(false);
    }, 20000); // 20 seconds live update cycle
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, authToken]);

  // Reservation Actions
  const handleConfirmReservation = async (resId: number) => {
    if (!authToken) return;
    try {
      await updateAdminReservationStatus(authToken, resId, 'confirmed', 'Confirmed by Admin');
      showToast('success', `Reservation #${resId} successfully confirmed`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to confirm reservation');
    }
  };

  const handleUpdateReservationStatus = async (resId: number, newStatus: string) => {
    if (!authToken) return;
    try {
      await updateAdminReservationStatus(authToken, resId, newStatus);
      showToast('success', `Reservation #${resId} status updated to ${newStatus}`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update reservation');
    }
  };

  const handleSaveReservationDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !editingReservation) return;
    try {
      await updateAdminReservationStatus(
        authToken,
        editingReservation.id,
        editResForm.status,
        editResForm.adminNotes,
        editResForm.tableNumber
      );
      showToast('success', `Reservation #${editingReservation.id} updated with table assignment`);
      setEditingReservation(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update reservation details');
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      await createAdminReservation(authToken, {
        customerName: newReservation.customerName,
        customerPhone: newReservation.customerPhone,
        customerEmail: newReservation.customerEmail || 'guest@ecco-kigali.rw',
        reservationDate: newReservation.reservationDate,
        reservationTime: newReservation.reservationTime,
        partySize: Number(newReservation.partySize),
        seatingArea: newReservation.seatingArea,
        tableNumber: newReservation.tableNumber,
        occasion: newReservation.occasion,
        specialRequests: newReservation.specialRequests,
        status: newReservation.status
      });
      showToast('success', `New booking registered for ${newReservation.customerName}`);
      setShowAddReservationModal(false);
      setNewReservation({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        reservationDate: new Date().toISOString().split('T')[0],
        reservationTime: '19:30',
        partySize: 2,
        seatingArea: 'sunset_terrace',
        tableNumber: 'Terrace T-01',
        occasion: '',
        specialRequests: '',
        status: 'confirmed'
      });
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to record reservation');
    }
  };

  const handleDeleteReservation = async (resId: number) => {
    if (!authToken) return;
    try {
      await deleteAdminReservation(authToken, resId);
      showToast('success', `Reservation #${resId} deleted`);
      setReservationToDelete(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete reservation');
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string, notes?: string) => {
    if (!authToken) return;
    try {
      await updateAdminOrderStatus(authToken, orderId, newStatus, notes);
      showToast('success', `Order #${orderId} progressed to ${newStatus.replace(/_/g, ' ')}`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update order status');
    }
  };

  // Menu Actions
  const handleToggleAvailability = async (itemId: number, currentStatus: boolean) => {
    if (!authToken) return;
    try {
      await toggleAdminMenuItemAvailability(authToken, itemId);
      showToast('success', `Item #${itemId} is now ${!currentStatus ? 'Available' : 'Sold Out'}`);
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
      showToast('success', `Dish "${newMenuItem.name}" published to menu`);
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

  const handleSaveMenuItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !editingMenuItem) return;
    try {
      await updateAdminMenuItem(authToken, editingMenuItem.id, {
        categoryId: editingMenuItem.category_id,
        name: editingMenuItem.name,
        description: editingMenuItem.description,
        price: Number(editingMenuItem.price),
        imageUrl: editingMenuItem.image_url,
        isChefSpecial: editingMenuItem.is_chef_special,
        isPopular: editingMenuItem.is_popular,
        prepTimeMinutes: Number(editingMenuItem.prep_time_minutes || 20)
      });
      showToast('success', `Dish "${editingMenuItem.name}" updated`);
      setEditingMenuItem(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update menu item');
    }
  };

  const handleDeleteMenuItem = async (itemId: number, itemName: string) => {
    if (!authToken) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${itemName}"?`)) return;
    try {
      await deleteAdminMenuItem(authToken, itemId);
      showToast('success', `Dish "${itemName}" deleted from menu`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete dish');
    }
  };

  // Gallery Actions
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
      showToast('error', err.message || 'Failed to add gallery photo');
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!authToken) return;
    try {
      await deleteAdminGalleryItem(authToken, id);
      showToast('success', 'Gallery photo deleted');
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete photo');
    }
  };

  // Settings Action
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      await updateAdminSettings(authToken || 'admin_direct_access', restaurantSettings);
      showToast('success', 'Restaurant settings saved and published to live website');
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save settings');
    }
  };

  // Customer Management Handlers
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.fullName.trim() || !newCustomer.email.trim()) {
      showToast('error', 'Please provide patron name and email.');
      return;
    }
    const token = authToken || 'admin_direct_access';
    try {
      await createAdminCustomer(token, newCustomer);
      showToast('success', `Patron ${newCustomer.fullName} registered`);
      setShowAddCustomerModal(false);
      setNewCustomer({ fullName: '', email: '', phone: '', tier: 'VIP Patron', notes: '' });
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to register customer');
    }
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    const token = authToken || 'admin_direct_access';
    try {
      await updateAdminCustomer(token, editingCustomer.id, editingCustomer);
      showToast('success', `Patron ${editingCustomer.fullName || editingCustomer.full_name} updated`);
      setEditingCustomer(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update customer');
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    const token = authToken || 'admin_direct_access';
    try {
      await deleteAdminCustomer(token, id);
      showToast('success', 'Patron record removed');
      setCustomerToDelete(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete customer');
    }
  };

  // Filtered lists
  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const filteredReservations = reservations.filter(r => {
    const matchesStatus = reservationFilter === 'all' || r.status === reservationFilter;
    const q = reservationSearch.toLowerCase();
    const matchesSearch = !q || 
      (r.customer_name && r.customer_name.toLowerCase().includes(q)) ||
      (r.customer_phone && r.customer_phone.includes(q)) ||
      (r.reservation_code && r.reservation_code.toLowerCase().includes(q)) ||
      (r.table_number && r.table_number.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const filteredOrders = orders.filter(o => {
    return orderFilter === 'all' || o.status === orderFilter;
  });

  const filteredMenu = menuItems.filter(item => {
    const matchesType = selectedMenuType === 'all' || item.type === selectedMenuType;
    const q = menuSearchQuery.toLowerCase();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const filteredCustomers = customers.filter(c => {
    const matchesTier = customerTierFilter === 'all' || c.tier === customerTierFilter;
    const q = customerSearch.toLowerCase();
    const matchesSearch = !q ||
      (c.fullName && c.fullName.toLowerCase().includes(q)) ||
      (c.full_name && c.full_name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.notes && c.notes.toLowerCase().includes(q));
    return matchesTier && matchesSearch;
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
                <span className="font-serif text-xl font-bold tracking-wider text-white">ECCO EXECUTIVE PORTAL</span>
                <span className="text-[10px] font-mono uppercase bg-amber-950/70 border border-amber-800/50 text-[#D4AF37] px-2 py-0.5 rounded-full">
                  Admin • Full Control Suite
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-light">KK 554 Kigali • Table Reservations, Kitchen Orders, Menu Catalog & Live Settings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Refresh Controller */}
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => loadData(true)}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-neutral-800/90 hover:bg-[#D4AF37]/20 border border-neutral-700/60 hover:border-[#D4AF37]/50 text-neutral-200 hover:text-[#F3E5AB] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                title={`Last updated: ${lastRefreshed.toLocaleTimeString()}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              <button
                onClick={() => {
                  const nextState = !autoRefreshEnabled;
                  setAutoRefreshEnabled(nextState);
                  showToast('success', nextState ? 'Auto-refresh enabled (20s polling)' : 'Auto-refresh paused');
                }}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-mono transition-colors flex items-center gap-1.5 ${
                  autoRefreshEnabled
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/50'
                    : 'text-neutral-500 hover:text-neutral-400 border border-transparent'
                }`}
                title="Toggle 20-second automatic background sync"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${autoRefreshEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
                <span className="hidden md:inline">{autoRefreshEnabled ? 'Live Sync' : 'Sync Paused'}</span>
              </button>
            </div>

            {onNavigateToPublic && (
              <button
                onClick={onNavigateToPublic}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-amber-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Open Public Restaurant Interface"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Visit Site</span>
              </button>
            )}

            {onOpenStageVerification && (
              <button
                onClick={onOpenStageVerification}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#D4AF37]/60 text-neutral-300 hover:text-white text-xs font-mono hidden md:flex items-center gap-1.5 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Diagnostics Matrix</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-medium">{currentUser.username || 'Admin'}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
              title="Logout from Executive Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-neutral-800/60 bg-[#0E0D0C] sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-thin scrollbar-thumb-neutral-800">
          {/* 1. Dashboard Overview */}
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'overview'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </button>

          {/* 2. Menu Management */}
          <button
            onClick={() => setActiveSection('menu')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'menu'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Menu Management ({menuItems.length})</span>
          </button>

          {/* 3. Reservations Management */}
          <button
            onClick={() => setActiveSection('reservations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'reservations'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reservations ({reservations.length})</span>
            {pendingReservations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-bold text-[10px]">
                {pendingReservations.length} Pending
              </span>
            )}
          </button>

          {/* 4. Orders Management */}
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'orders'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Orders Management ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-400 text-black font-bold text-[10px]">
                {pendingOrders.length} New
              </span>
            )}
          </button>

          {/* 5. Customer Management */}
          <button
            onClick={() => setActiveSection('customers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'customers'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer Management ({customers.length})</span>
          </button>

          {/* 6. Restaurant Statistics */}
          <button
            onClick={() => setActiveSection('statistics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'statistics'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Restaurant Statistics</span>
          </button>

          {/* 7. Website Content Management */}
          <button
            onClick={() => setActiveSection('content')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSection === 'content'
                ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website Content</span>
          </button>

          {/* Audit Logs */}
          <button
            onClick={() => setActiveSection('logs')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeSection === 'logs'
                ? 'bg-neutral-800 text-white shadow-md font-semibold'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* =========================================================
            SECTION 1: OVERVIEW METRICS & PENDING NOTICES
           ========================================================= */}
        {activeSection === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Real-time Summary Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141312] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <span>Executive Operations Summary</span>
                  <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md">Live</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Synchronized restaurant bookings, kitchen dispatch, and catalog metrics for KK 554 Kigali
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-neutral-500 font-mono">
                  Synced: {lastRefreshed.toLocaleTimeString()}
                </span>
                <button
                  onClick={() => loadData(true)}
                  disabled={loading}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#D4AF37] text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow active:scale-95 disabled:opacity-50"
                  title="Refresh Dashboard"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Overview</span>
                </button>
              </div>
            </div>

            {/* Pending Booking Notice Banner */}
            {pendingReservations.length > 0 && (
              <div className="bg-gradient-to-r from-amber-950/60 via-[#1C1810] to-[#141312] border border-[#D4AF37]/50 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <span>{pendingReservations.length} Pending Booking Request{pendingReservations.length > 1 ? 's' : ''} Awaiting Confirmation</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold">Action Required</span>
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1">
                      Guests have requested reservations for Kigali Sunset Terrace & VIP Suite. Review and confirm booking slots instantly.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveSection('reservations');
                    setReservationFilter('pending');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center gap-2 shrink-0"
                >
                  <span>Review & Confirm Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                  <span>Table Bookings</span>
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-3xl font-bold text-white">
                  {reservations.length}
                </div>
                <p className="text-[11px] text-neutral-500">
                  <span className="text-amber-300 font-bold">{pendingReservations.length} pending</span> • {reservations.filter(r => r.status === 'confirmed').length} confirmed
                </p>
              </div>

              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                  <span>Dining & Delivery Orders</span>
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-3xl font-bold text-white">
                  {orders.length}
                </div>
                <p className="text-[11px] text-neutral-500">
                  <span className="text-blue-300 font-bold">{pendingOrders.length} pending</span> dispatch in Kigali
                </p>
              </div>

              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                  <span>Active Menu Catalog</span>
                  <Utensils className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-3xl font-bold text-white">
                  {menuItems.filter(m => m.is_available).length} <span className="text-lg text-neutral-500 font-normal">/ {menuItems.length}</span>
                </div>
                <p className="text-[11px] text-neutral-500">Curated dishes & sommelier wines in RWF</p>
              </div>

              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                  <span>Restaurant Status</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-serif text-2xl font-bold text-emerald-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Fully Operational</span>
                </div>
                <p className="text-[11px] text-neutral-500">KK 554 Kigali • 10:00 AM - 11:00 PM</p>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Immediate Pending Bookings Box */}
              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">Pending Booking Requests</h3>
                    <p className="text-xs text-neutral-400">One-click confirmation for incoming patron requests</p>
                  </div>
                  <button
                    onClick={() => setShowAddReservationModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1 hover:brightness-110"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Receive Booking</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingReservations.length === 0 ? (
                    <div className="p-6 text-center text-neutral-500 text-xs font-sans">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                      All booking requests have been reviewed and confirmed!
                    </div>
                  ) : (
                    pendingReservations.slice(0, 4).map((r: any) => (
                      <div key={r.id} className="p-4 bg-[#0D0C0B] border border-amber-900/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{r.customer_name || 'Guest'}</span>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                              {r.party_size || 2} Guests
                            </span>
                          </div>
                          <p className="text-neutral-400">
                            {r.reservation_date} at <strong className="text-amber-300">{r.reservation_time}</strong> • {r.seating_area?.replace('_', ' ') || 'Sunset Terrace'}
                          </p>
                          {r.special_requests && (
                            <p className="text-[11px] text-neutral-500 italic">"{r.special_requests}"</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleConfirmReservation(r.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase shadow hover:brightness-110 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingReservation(r);
                              setEditResForm({
                                status: 'confirmed',
                                tableNumber: r.table_number || 'Terrace T-01',
                                adminNotes: r.admin_notes || ''
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white text-xs"
                          >
                            Table
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active Orders Box */}
              <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">Active Kigali Kitchen Orders</h3>
                    <p className="text-xs text-neutral-400">Delivery and dine-in dispatch</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    View all orders
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <div className="p-6 text-center text-neutral-500 text-xs font-sans">
                      No active kitchen orders logged.
                    </div>
                  ) : (
                    orders.slice(0, 4).map((o: any) => (
                      <div key={o.id} className="p-4 bg-[#0D0C0B] border border-neutral-800 rounded-2xl flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-300">{o.order_number}</span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                              {o.order_type}
                            </span>
                          </div>
                          <p className="text-white font-medium">{o.customer_name} • {o.total_amount?.toLocaleString()} RWF</p>
                          <p className="text-[11px] text-neutral-400">{o.delivery_address || 'KK 554 Dine-in'}</p>
                        </div>

                        <div className="text-right space-y-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase inline-block ${
                            o.status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                            o.status === 'preparing' ? 'bg-purple-950 text-purple-300 border border-purple-800/40' :
                            o.status === 'out_for_delivery' ? 'bg-blue-950 text-blue-300 border border-blue-800/40' :
                            'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          }`}>
                            {o.status.replace(/_/g, ' ')}
                          </span>

                          <div>
                            {o.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'preparing')}
                                className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-black font-bold text-[10px] uppercase hover:brightness-110"
                              >
                                Send to Kitchen
                              </button>
                            )}
                            {o.status === 'preparing' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'out_for_delivery')}
                                className="px-2.5 py-1 rounded-lg bg-blue-500 text-black font-bold text-[10px] uppercase hover:brightness-110"
                              >
                                Dispatch
                              </button>
                            )}
                            {o.status === 'out_for_delivery' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-bold text-[10px] uppercase hover:brightness-110"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 2: COMPLETE RESERVATIONS & BOOKING MANAGEMENT
           ========================================================= */}
        {activeSection === 'reservations' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header with Title & "Receive New Booking" CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Table Reservations & Guest Bookings</h3>
                <p className="text-xs text-neutral-400">Receive walk-ins/calls, confirm online booking requests, assign tables, and manage seating</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddReservationModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:brightness-110 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Receive New Booking</span>
                </button>
                <button
                  onClick={() => loadData(true)}
                  disabled={loading}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#D4AF37] text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  title="Reload Bookings"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh Bookings</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141312] p-4 rounded-2xl border border-neutral-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setReservationFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    reservationFilter === 'all' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({reservations.length})
                </button>
                <button
                  onClick={() => setReservationFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    reservationFilter === 'pending' ? 'bg-amber-400 text-black font-bold' : 'text-amber-400 hover:bg-amber-950/40'
                  }`}
                >
                  <span>Pending Requests ({pendingReservations.length})</span>
                </button>
                <button
                  onClick={() => setReservationFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    reservationFilter === 'confirmed' ? 'bg-emerald-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Confirmed ({reservations.filter(r => r.status === 'confirmed').length})
                </button>
                <button
                  onClick={() => setReservationFilter('seated')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    reservationFilter === 'seated' ? 'bg-blue-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Seated ({reservations.filter(r => r.status === 'seated').length})
                </button>
                <button
                  onClick={() => setReservationFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    reservationFilter === 'completed' ? 'bg-neutral-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Completed ({reservations.filter(r => r.status === 'completed').length})
                </button>
                <button
                  onClick={() => setReservationFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    reservationFilter === 'cancelled' ? 'bg-rose-500 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cancelled ({reservations.filter(r => r.status === 'cancelled' || r.status === 'rejected').length})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guest, phone, table..."
                  value={reservationSearch}
                  onChange={(e) => setReservationSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Reservations Master Table */}
            <div className="bg-[#141312] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase font-mono bg-[#0D0C0B]/80">
                      <th className="p-4">Code</th>
                      <th className="p-4">Guest Details</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Party</th>
                      <th className="p-4">Zone & Table</th>
                      <th className="p-4">Occasion / Notes</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-sans">
                    {filteredReservations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 px-4 text-center">
                          <div className="max-w-md mx-auto space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-[#D4AF37] flex items-center justify-center mx-auto shadow-inner">
                              <Calendar className="w-6 h-6" />
                            </div>
                            <h4 className="font-serif text-lg font-bold text-white">No Reservations Found</h4>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                              {reservations.length === 0
                                ? 'There are currently no table bookings in the database. When guests book online or intake records are recorded, they will appear here in real time.'
                                : 'No reservations match your currently selected filter or search term.'}
                            </p>
                            <div className="flex items-center justify-center gap-3 pt-2">
                              <button
                                onClick={() => setShowAddReservationModal(true)}
                                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow-md transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Receive New Booking</span>
                              </button>
                              <button
                                onClick={() => loadData(true)}
                                disabled={loading}
                                className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#D4AF37] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredReservations.map((r: any) => (
                        <tr key={r.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-amber-300">
                            {r.reservation_code || `#RES-${r.id}`}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-white block text-sm">{r.customer_name || 'Guest'}</span>
                              {r.registered_customer ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/30 flex items-center gap-1">
                                  <UserCheck className="w-2.5 h-2.5" />
                                  <span>Registered Client</span>
                                </span>
                              ) : r.user_id ? (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-semibold border border-blue-500/30">
                                  Member #{r.user_id}
                                </span>
                              ) : null}
                            </div>
                            <span className="text-[11px] text-neutral-300 flex items-center gap-1 mt-0.5 font-mono">
                              <Phone className="w-3 h-3 text-[#D4AF37]" />
                              {r.customer_phone || r.registered_customer?.phone || '—'}
                            </span>
                            {(r.customer_email || r.registered_customer?.email) && (
                              <span className="text-[11px] text-neutral-400 block truncate max-w-[170px]">
                                {r.customer_email || r.registered_customer?.email}
                              </span>
                            )}
                            {r.registered_customer && (
                              <div className="mt-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedClientInfo(r.registered_customer)}
                                  className="px-2 py-0.5 rounded-md bg-neutral-900 hover:bg-[#D4AF37]/20 border border-neutral-700 hover:border-[#D4AF37] text-[10px] text-[#D4AF37] hover:text-white font-mono flex items-center gap-1 transition-colors"
                                  title="View client account & dining profile"
                                >
                                  <UserCheck className="w-3 h-3" />
                                  <span>Client Dossier (@{r.registered_customer.username})</span>
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-white font-medium block">{r.reservation_date}</span>
                            <span className="text-amber-300 font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {r.reservation_time}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-200 border border-neutral-700 font-mono font-bold">
                              {r.party_size || 2} Pax
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="capitalize text-neutral-200 block font-medium">
                              {r.seating_area?.replace('_', ' ') || 'Sunset Terrace'}
                            </span>
                            {r.table_number ? (
                              <span className="text-[10px] font-mono text-[#D4AF37] bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40 inline-block mt-0.5">
                                {r.table_number}
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-500 italic">Table Unassigned</span>
                            )}
                          </td>
                          <td className="p-4 max-w-xs">
                            {r.occasion && (
                              <span className="text-xs text-amber-200 font-semibold block">{r.occasion}</span>
                            )}
                            {r.special_requests && (
                              <span className="text-[11px] text-neutral-400 line-clamp-2">"{r.special_requests}"</span>
                            )}
                            {r.admin_notes && (
                              <span className="text-[10px] text-neutral-500 block mt-1 font-mono">
                                Admin: {r.admin_notes}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold border inline-block ${
                              r.status === 'pending' ? 'bg-amber-950 text-amber-300 border-amber-700/60 animate-pulse' :
                              r.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' :
                              r.status === 'seated' ? 'bg-blue-950 text-blue-300 border-blue-700/60' :
                              r.status === 'completed' ? 'bg-neutral-900 text-neutral-400 border-neutral-700' :
                              'bg-rose-950 text-rose-400 border-rose-800/60'
                            }`}>
                              {r.status || 'confirmed'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {r.status === 'pending' && (
                                <button
                                  onClick={() => handleConfirmReservation(r.id)}
                                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase shadow hover:brightness-110 flex items-center gap-1"
                                  title="Confirm this booking"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Confirm</span>
                                </button>
                              )}

                              {r.status === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(r.id, 'seated')}
                                  className="px-2 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800/50 hover:bg-blue-900 text-[11px] font-bold"
                                  title="Mark as seated"
                                >
                                  Seat
                                </button>
                              )}

                              {r.status === 'seated' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(r.id, 'completed')}
                                  className="px-2 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900 text-[11px] font-bold"
                                  title="Mark as completed"
                                >
                                  Complete
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setEditingReservation(r);
                                  setEditResForm({
                                    status: r.status || 'confirmed',
                                    tableNumber: r.table_number || '',
                                    adminNotes: r.admin_notes || ''
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white"
                                title="Edit table and notes"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setReservationToDelete(r)}
                                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-rose-400 hover:border-rose-900"
                                title="Delete reservation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 3: ORDERS & KITCHEN DISPATCH
           ========================================================= */}
        {activeSection === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Kitchen Operations & Delivery Dispatch</h3>
                <p className="text-xs text-neutral-400">Manage incoming orders, dispatch to Kigali addresses, and track payments</p>
              </div>

              <button
                onClick={() => loadData(true)}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#D4AF37] text-xs text-neutral-200 hover:text-white flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                title="Refresh orders from kitchen"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Orders</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-[#141312] p-4 rounded-2xl border border-neutral-800">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  orderFilter === 'all' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  orderFilter === 'pending' ? 'bg-amber-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Pending ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button
                onClick={() => setOrderFilter('preparing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  orderFilter === 'preparing' ? 'bg-purple-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                In Kitchen ({orders.filter(o => o.status === 'preparing').length})
              </button>
              <button
                onClick={() => setOrderFilter('out_for_delivery')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  orderFilter === 'out_for_delivery' ? 'bg-blue-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Out for Delivery ({orders.filter(o => o.status === 'out_for_delivery').length})
              </button>
              <button
                onClick={() => setOrderFilter('delivered')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  orderFilter === 'delivered' ? 'bg-emerald-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Delivered / Completed ({orders.filter(o => o.status === 'delivered' || o.status === 'completed').length})
              </button>
            </div>

            {/* Orders Table */}
            <div className="bg-[#141312] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase font-mono bg-[#0D0C0B]/80">
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer & Phone</th>
                      <th className="p-4">Delivery Destination</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Total & Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Workflow Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-sans">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-neutral-500">
                          No orders registered under this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o: any) => (
                        <tr key={o.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-amber-300">
                            {o.order_number}
                            <span className="text-[10px] text-neutral-500 block font-normal">
                              {o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-white block">{o.customer_name}</span>
                            <span className="text-[11px] text-neutral-400">{o.customer_phone || '—'}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-white block font-medium">{o.delivery_address || 'KK 554 Dine-in'}</span>
                            {o.delivery_notes && (
                              <span className="text-[10px] text-neutral-400 italic block">{o.delivery_notes}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              {o.items?.map((it: any, idx: number) => (
                                <div key={idx} className="text-[11px] text-neutral-300">
                                  <strong className="text-amber-300">{it.quantity}x</strong> {it.item_name}
                                </div>
                              )) || <span className="text-neutral-500">Gourmet Selection</span>}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono font-bold text-white block text-sm">
                              {o.total_amount?.toLocaleString()} RWF
                            </span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-amber-400 border border-neutral-700">
                              {o.payment?.method || 'MTN MoMo'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold border inline-block ${
                              o.status === 'pending' ? 'bg-amber-950 text-amber-300 border-amber-700/60' :
                              o.status === 'preparing' ? 'bg-purple-950 text-purple-300 border-purple-700/60' :
                              o.status === 'out_for_delivery' ? 'bg-blue-950 text-blue-300 border-blue-700/60' :
                              o.status === 'delivered' || o.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' :
                              'bg-rose-950 text-rose-400 border-rose-800/60'
                            }`}>
                              {o.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {o.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(o.id, 'preparing')}
                                  className="px-3 py-1.5 rounded-xl bg-purple-500 text-black font-bold text-xs uppercase hover:brightness-110"
                                >
                                  Kitchen
                                </button>
                              )}
                              {o.status === 'preparing' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(o.id, 'out_for_delivery')}
                                  className="px-3 py-1.5 rounded-xl bg-blue-500 text-black font-bold text-xs uppercase hover:brightness-110"
                                >
                                  Dispatch
                                </button>
                              )}
                              {o.status === 'out_for_delivery' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase hover:brightness-110"
                                >
                                  Delivered
                                </button>
                              )}
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'cancelled')}
                                className="px-2 py-1 rounded-lg bg-neutral-900 text-neutral-400 hover:text-rose-400 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 4: MENU CATALOG MANAGEMENT (CRUD)
           ========================================================= */}
        {activeSection === 'menu' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Menu & Sommelier Catalog</h3>
                <p className="text-xs text-neutral-400">Total {menuItems.length} curated dishes & drinks at KK 554 Kigali</p>
              </div>

              <button
                onClick={() => setShowAddMenuModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:brightness-110"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish / Drink</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141312] p-4 rounded-2xl border border-neutral-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMenuType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedMenuType === 'all' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({menuItems.length})
                </button>
                <button
                  onClick={() => setSelectedMenuType('food')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedMenuType === 'food' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Food Only ({menuItems.filter(m => m.type === 'food').length})
                </button>
                <button
                  onClick={() => setSelectedMenuType('drink')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedMenuType === 'drink' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400 hover:text-white'
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
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="bg-[#141312] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase font-mono bg-[#0D0C0B]/80">
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
                              src={item.image_url || '/images/prime-ribeye-steak.jpg'}
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
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingMenuItem(item)}
                              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-[#D4AF37]"
                              title="Edit item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id, item.name)}
                              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-rose-400 hover:border-rose-900"
                              title="Delete dish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 5: CUSTOMER MANAGEMENT
           ========================================================= */}
        {activeSection === 'customers' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Customer & Patron Management</h3>
                <p className="text-xs text-neutral-400">Total {customers.length} registered patrons and distinguished diners at ECCO Restaurant</p>
              </div>

              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:brightness-110"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add VIP / Patron</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-[#141312] border border-neutral-800 rounded-2xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">VIP Patrons</span>
                <span className="text-2xl font-bold text-[#D4AF37] font-serif">
                  {customers.filter(c => c.tier === 'VIP Patron').length}
                </span>
              </div>
              <div className="p-4 bg-[#141312] border border-neutral-800 rounded-2xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">Frequent Guests</span>
                <span className="text-2xl font-bold text-white font-serif">
                  {customers.filter(c => c.tier === 'Frequent Guest').length}
                </span>
              </div>
              <div className="p-4 bg-[#141312] border border-neutral-800 rounded-2xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">Total Patron Orders</span>
                <span className="text-2xl font-bold text-amber-300 font-serif">
                  {customers.reduce((acc, c) => acc + (c.totalOrders || 0), 0)}
                </span>
              </div>
              <div className="p-4 bg-[#141312] border border-neutral-800 rounded-2xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">Total Patron Spend</span>
                <span className="text-xl font-bold text-emerald-400 font-serif">
                  {(customers.reduce((acc, c) => acc + (c.totalSpentRwf || 0), 0)).toLocaleString()} RWF
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141312] p-4 rounded-2xl border border-neutral-800">
              <div className="flex items-center gap-2 overflow-x-auto">
                {(['all', 'VIP Patron', 'Frequent Guest', 'Regular Guest'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setCustomerTierFilter(tier)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      customerTierFilter === tier
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    {tier === 'all' ? `All Patrons (${customers.length})` : tier}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patron by name, phone, email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-[#141312] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase font-mono bg-[#0D0C0B]/80">
                      <th className="p-4">Patron Dossier</th>
                      <th className="p-4">Concierge Contact</th>
                      <th className="p-4">Activity Stats</th>
                      <th className="p-4">Total Spent</th>
                      <th className="p-4">Last Dining Visit</th>
                      <th className="p-4">Concierge Notes</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-sans">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-neutral-500 font-mono">
                          No patron records found.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => {
                        const name = c.fullName || c.full_name || 'Patron';
                        const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                        const phoneDigits = (c.phone || '').replace(/[^0-9]/g, '');
                        return (
                          <tr key={c.id || c.email} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-amber-900/30 border border-[#D4AF37]/40 flex items-center justify-center font-serif font-bold text-[#F3E5AB] text-xs">
                                  {initials}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{name}</span>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                      c.tier === 'VIP Patron' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold' :
                                      c.tier === 'Frequent Guest' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                      'bg-neutral-800 text-neutral-300'
                                    }`}>
                                      {c.tier || 'Regular Guest'}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-neutral-400 font-mono block">{c.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-neutral-200">{c.phone || '—'}</span>
                                {phoneDigits && (
                                  <div className="flex items-center gap-1">
                                    <a
                                      href={`tel:${c.phone}`}
                                      className="p-1 rounded-md bg-neutral-900 hover:bg-neutral-800 text-[#D4AF37]"
                                      title="Call Patron"
                                    >
                                      <Phone className="w-3 h-3" />
                                    </a>
                                    <a
                                      href={`https://wa.me/${phoneDigits}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 rounded-md bg-neutral-900 hover:bg-emerald-950/80 text-emerald-400"
                                      title="WhatsApp VIP Concierge"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-mono text-neutral-300">
                                {c.totalOrders || 0} Orders · {c.totalReservations || 0} Bookings
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-mono font-bold text-[#D4AF37]">
                                {(c.totalSpentRwf || 0).toLocaleString()} RWF
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-neutral-400 font-mono">{c.lastVisit || '2026-03-28'}</span>
                            </td>
                            <td className="p-4 max-w-xs">
                              <span className="text-neutral-400 text-xs italic line-clamp-1">
                                {c.notes || 'Fine dining patron'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingCustomer(c)}
                                  className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-[#D4AF37]"
                                  title="Edit patron profile"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setCustomerToDelete(c)}
                                  className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-rose-400"
                                  title="Delete patron"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 6: RESTAURANT STATISTICS
           ========================================================= */}
        {activeSection === 'statistics' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Restaurant Statistics & Analytics</h3>
                <p className="text-xs text-neutral-400">Live sales performance, dining room occupancy, and culinary velocity metrics at KK 554 Kigali</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#D4AF37] px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Kigali Service (10:00–23:00)</span>
                </span>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#141312] border border-neutral-800 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-mono text-neutral-400">Gross Restaurant Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold text-white font-serif">
                  {(statisticsData?.totalRevenueRwf || 2805000).toLocaleString()} <span className="text-xs font-sans text-neutral-400">RWF</span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span>↑ +14.8% vs last week</span>
                </div>
              </div>

              <div className="p-5 bg-[#141312] border border-neutral-800 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-mono text-neutral-400">Average Cover / Ticket</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white font-serif">
                  {(statisticsData?.avgOrderValueRwf || 26500).toLocaleString()} <span className="text-xs font-sans text-neutral-400">RWF</span>
                </div>
                <div className="mt-2 text-[11px] text-neutral-400 font-mono">
                  <span>Fine dining & wine cellar mix</span>
                </div>
              </div>

              <div className="p-5 bg-[#141312] border border-neutral-800 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-mono text-neutral-400">Total Orders Processed</span>
                  <Truck className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white font-serif">
                  {statisticsData?.totalOrders || orders.length || 136}
                </div>
                <div className="mt-2 text-[11px] text-neutral-400 font-mono">
                  <span>96.2% Kitchen completion rate</span>
                </div>
              </div>

              <div className="p-5 bg-[#141312] border border-neutral-800 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-mono text-neutral-400">Table Reservations</span>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white font-serif">
                  {statisticsData?.totalReservations || reservations.length || 52}
                </div>
                <div className="mt-2 text-[11px] text-[#D4AF37] font-mono">
                  <span>88% Evening occupancy rate</span>
                </div>
              </div>
            </div>

            {/* Weekly Sales Trend Bar Chart */}
            <div className="p-6 bg-[#141312] border border-neutral-800 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">Weekly Revenue Performance (RWF)</h4>
                  <p className="text-xs text-neutral-400">Daily gross revenue and order frequency across the current week</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#D4AF37]">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#D4AF37]" />
                    <span>Saturday Peak</span>
                  </span>
                </div>
              </div>

              {/* Chart Visual */}
              <div className="pt-6 pb-2">
                <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-48 border-b border-neutral-800 pb-2">
                  {(statisticsData?.weeklyRevenue || [
                    { day: 'Mon', revenue: 215000, orders: 9 },
                    { day: 'Tue', revenue: 280000, orders: 12 },
                    { day: 'Wed', revenue: 310000, orders: 15 },
                    { day: 'Thu', revenue: 365000, orders: 18 },
                    { day: 'Fri', revenue: 520000, orders: 26 },
                    { day: 'Sat', revenue: 640000, orders: 32 },
                    { day: 'Sun', revenue: 475000, orders: 24 }
                  ]).map((item: any, idx: number) => {
                    const maxRev = 700000;
                    const heightPercent = Math.min(100, Math.round((item.revenue / maxRev) * 100));
                    const isPeak = item.day === 'Sat';
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(item.revenue / 1000).toFixed(0)}k
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 group-hover:brightness-125 ${
                            isPeak
                              ? 'bg-gradient-to-t from-[#B8860B] to-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                              : 'bg-neutral-800 hover:bg-neutral-700'
                          }`}
                        />
                        <span className={`text-xs font-mono uppercase ${isPeak ? 'text-[#D4AF37] font-bold' : 'text-neutral-400'}`}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Split Grid: Top Dishes + Dining Area Occupancy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Dishes */}
              <div className="p-6 bg-[#141312] border border-neutral-800 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-white">Top 5 Best-Selling Food & Drinks</h4>
                  <span className="text-xs font-mono text-neutral-400">By Orders & Revenue</span>
                </div>

                <div className="space-y-3 font-sans">
                  {(statisticsData?.topDishes || [
                    { name: 'Ribeye Steak', category: 'Main Courses', ordersCount: 46, revenueRwf: 1012000 },
                    { name: 'Carpaccio', category: 'Starters', ordersCount: 39, revenueRwf: 234000 },
                    { name: 'Casillero del Diablo Red', category: 'Wines', ordersCount: 28, revenueRwf: 1820000 },
                    { name: 'Margarita', category: 'Cocktails', ordersCount: 35, revenueRwf: 577500 },
                    { name: 'Chicken Schnitzel', category: 'Main Courses', ordersCount: 31, revenueRwf: 449500 }
                  ]).map((dish: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#0D0C0B] border border-neutral-800/80 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                          idx === 0 ? 'bg-[#D4AF37] text-black font-bold' : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-white text-xs block">{dish.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{dish.category} · {dish.ordersCount} orders</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#D4AF37] text-xs">
                        {dish.revenueRwf.toLocaleString()} RWF
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dining Room Occupancy & Peak Hours */}
              <div className="p-6 bg-[#141312] border border-neutral-800 rounded-3xl shadow-xl space-y-5">
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">Dining Area Occupancy Rates</h4>
                  <p className="text-xs text-neutral-400">Live seating utilization across ECCO restaurant spaces</p>
                </div>

                <div className="space-y-4">
                  {(statisticsData?.seatingOccupancy || [
                    { area: 'Sunset Terrace', totalTables: 12, occupied: 11, occupancyRate: 92 },
                    { area: 'Main Dining Hall', totalTables: 18, occupied: 14, occupancyRate: 78 },
                    { area: 'VIP Executive Suite', totalTables: 6, occupied: 4, occupancyRate: 67 },
                    { area: 'Mixology Cocktail Bar', totalTables: 8, occupied: 7, occupancyRate: 88 }
                  ]).map((zone: any, idx: number) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-medium">{zone.area}</span>
                        <span className="font-mono text-[#D4AF37] font-semibold">
                          {zone.occupied}/{zone.totalTables} Tables ({zone.occupancyRate}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                        <div
                          style={{ width: `${zone.occupancyRate}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            zone.occupancyRate >= 90 ? 'bg-amber-400' : 'bg-[#D4AF37]'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <h5 className="font-serif text-sm font-bold text-white mb-2">Peak Service Velocity</h5>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-[#0D0C0B] rounded-xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 font-mono block">Lunch Rush</span>
                      <span className="text-neutral-200 font-bold">12:00–15:00</span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">28% of covers</span>
                    </div>
                    <div className="p-2.5 bg-[#0D0C0B] rounded-xl border border-[#D4AF37]/30">
                      <span className="text-[10px] text-[#D4AF37] font-mono block">Dinner Prime</span>
                      <span className="text-amber-300 font-bold">18:30–21:30</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">54% of covers</span>
                    </div>
                    <div className="p-2.5 bg-[#0D0C0B] rounded-xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 font-mono block">Late Lounge</span>
                      <span className="text-neutral-200 font-bold">21:30–23:00</span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">18% of covers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 7: WEBSITE CONTENT MANAGEMENT
           ========================================================= */}
        {activeSection === 'content' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Website Content Management</h3>
                <p className="text-xs text-neutral-400">Configure public branding, opening hours, announcement notice, and ambiance imagery</p>
              </div>

              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:brightness-110"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ambiance Photo</span>
              </button>
            </div>

            {/* Split Layout: Operating Parameters + Live Announcement Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Core Restaurant Identity (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleSaveSettings} className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h4 className="font-serif text-lg font-bold text-white">General Information & Contact</h4>
                    <span className="text-xs font-mono text-[#D4AF37]">Official Brand Parameters</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-neutral-300">Restaurant Brand Name</label>
                      <input
                        type="text"
                        value={restaurantSettings['restaurant_name'] || 'Ecco Restaurant'}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, restaurant_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-neutral-300">Brand Tagline / Slogan</label>
                      <input
                        type="text"
                        value={restaurantSettings['slogan'] || 'Good Food, Great Moments!'}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, slogan: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-neutral-300">Primary Phone / Concierge</label>
                      <input
                        type="text"
                        value={restaurantSettings['contact_phone'] || restaurantSettings['phone_number'] || '0701537890'}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, contact_phone: e.target.value, phone_number: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-neutral-300">WhatsApp Business Line</label>
                      <input
                        type="text"
                        value={restaurantSettings['whatsapp_number'] || '0701537890'}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, whatsapp_number: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-neutral-300">Official Contact Email</label>
                      <input
                        type="email"
                        value={restaurantSettings['contact_email'] || restaurantSettings['email_address'] || 'mugishamp7@gmail.com'}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, contact_email: e.target.value, email_address: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-neutral-300">Opening Hours</label>
                      <input
                        type="text"
                        value={restaurantSettings['opening_hours'] || 'Every day, 10:00–23:00'}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, opening_hours: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-neutral-300">Physical Address in Kigali</label>
                    <input
                      type="text"
                      value={restaurantSettings['location_address'] || restaurantSettings['restaurant_address'] || 'KK 554, Kigali, Rwanda'}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, location_address: e.target.value, restaurant_address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-neutral-300">Restaurant Story / About Blurb</label>
                    <textarea
                      rows={3}
                      value={restaurantSettings['about_story'] || 'Ecco Restaurant in Kigali celebrates the harmony of authentic Rwandan ingredients elevated by French and international culinary techniques.'}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, about_story: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase shadow-md hover:brightness-110 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save & Publish Information</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Announcement Banner & Delivery */}
              <div className="space-y-6">
                <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-5 shadow-xl">
                  <div className="border-b border-neutral-800 pb-3">
                    <h4 className="font-serif text-lg font-bold text-white">Live Announcement Banner</h4>
                    <p className="text-xs text-neutral-400">Broadcast notices to visitors on the website header</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#0D0C0B] border border-neutral-800 rounded-xl">
                      <span className="text-xs text-white font-medium">Show Banner Notice</span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentVal = restaurantSettings['banner_enabled'] === 'true';
                          setRestaurantSettings({ ...restaurantSettings, banner_enabled: (!currentVal).toString() });
                        }}
                        className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold transition-colors ${
                          restaurantSettings['banner_enabled'] === 'true'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {restaurantSettings['banner_enabled'] === 'true' ? 'Active' : 'Hidden'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-neutral-300">Notice Text</label>
                      <textarea
                        rows={3}
                        value={restaurantSettings['banner_text'] || 'Welcome to Ecco Restaurant Kigali • Good Food, Great Moments! Reservation recommended.'}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, banner_text: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="w-full py-2 rounded-xl bg-neutral-900 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] font-semibold text-xs transition-colors"
                    >
                      Update Banner Notice
                    </button>
                  </div>
                </div>

                <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <h4 className="font-serif text-lg font-bold text-white">Delivery Fee Parameters</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Base Kigali Delivery Fee (RWF)</label>
                      <input
                        type="number"
                        value={restaurantSettings['delivery_base_fee'] || '1500'}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, delivery_base_fee: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Fee Per KM (RWF)</label>
                      <input
                        type="number"
                        value={restaurantSettings['delivery_fee_per_km'] || '500'}
                        onChange={(e) => setRestaurantSettings({ ...restaurantSettings, delivery_fee_per_km: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ambiance Gallery Manager */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-xl font-bold text-white">Ambiance Gallery Photos</h4>
                  <p className="text-xs text-neutral-400">Total {galleryItems.length} curated interior and culinary photos showcased on the public website</p>
                </div>
                <button
                  onClick={() => setShowAddGalleryModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase flex items-center gap-1.5 shadow-md hover:brightness-110"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.map((g) => (
                  <div key={g.id} className="bg-[#141312] border border-neutral-800 rounded-2xl overflow-hidden group shadow-xl">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={g.image_url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#D4AF37]">
                        {g.category}
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <h5 className="font-semibold text-white text-xs truncate">{g.title}</h5>
                        <p className="text-[10px] text-neutral-400 truncate">{g.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteGalleryItem(g.id)}
                        className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-rose-400 transition-colors shrink-0"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* =========================================================
            SECTION 7: SYSTEM AUDIT TRAIL
           ========================================================= */}
        {activeSection === 'logs' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">System Audit Trail</h3>
              <p className="text-xs text-neutral-400">Detailed logs of administrative operations, logins, and status transitions</p>
            </div>

            <div className="bg-[#141312] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-2xl">
              {activityLogs.length === 0 ? (
                <p className="text-xs text-neutral-500 font-mono py-4">No audit logs recorded yet.</p>
              ) : (
                activityLogs.map((l: any, i: number) => (
                  <div key={i} className="p-3 bg-[#0D0C0B] border border-neutral-800/80 rounded-2xl flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[#D4AF37] font-bold block">{l.action_type || l.action || 'ACTION'}</span>
                      <span className="text-neutral-300 text-[11px]">{l.description || l.details}</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">{l.created_at ? new Date(l.created_at).toLocaleString() : 'Recent'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL 1: RECEIVE NEW BOOKING (INTAKE)
         ========================================================= */}
      {showAddReservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141312] border border-[#D4AF37]/50 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Receive New Table Booking</h3>
                <p className="text-xs text-neutral-400">Record phone, walk-in, or VIP reservation</p>
              </div>
              <button
                onClick={() => setShowAddReservationModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diane Umutoni"
                    value={newReservation.customerName}
                    onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0788 123 456"
                    value={newReservation.customerPhone}
                    onChange={(e) => setNewReservation({ ...newReservation, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={newReservation.customerEmail}
                  onChange={(e) => setNewReservation({ ...newReservation, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Date *</label>
                  <input
                    type="date"
                    required
                    value={newReservation.reservationDate}
                    onChange={(e) => setNewReservation({ ...newReservation, reservationDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Time *</label>
                  <input
                    type="time"
                    required
                    value={newReservation.reservationTime}
                    onChange={(e) => setNewReservation({ ...newReservation, reservationTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Guests *</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    required
                    value={newReservation.partySize}
                    onChange={(e) => setNewReservation({ ...newReservation, partySize: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Seating Area</label>
                  <select
                    value={newReservation.seatingArea}
                    onChange={(e) => setNewReservation({ ...newReservation, seatingArea: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="sunset_terrace">Sunset Terrace</option>
                    <option value="vip_suite">VIP Suite</option>
                    <option value="main_dining">Main Dining Hall</option>
                    <option value="any">Any Available</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Table Assignment</label>
                  <input
                    type="text"
                    placeholder="e.g. Terrace T-04"
                    value={newReservation.tableNumber}
                    onChange={(e) => setNewReservation({ ...newReservation, tableNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Occasion</label>
                  <input
                    type="text"
                    placeholder="e.g. Anniversary, Birthday"
                    value={newReservation.occasion}
                    onChange={(e) => setNewReservation({ ...newReservation, occasion: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Initial Status</label>
                  <select
                    value={newReservation.status}
                    onChange={(e) => setNewReservation({ ...newReservation, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="confirmed">Confirmed (Seat Reserved)</option>
                    <option value="pending">Pending (Review later)</option>
                    <option value="seated">Seated (Walk-in arrived)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Special Requests & Preferences</label>
                <textarea
                  rows={2}
                  placeholder="Wine pairing notes, allergen restrictions, high chair..."
                  value={newReservation.specialRequests}
                  onChange={(e) => setNewReservation({ ...newReservation, specialRequests: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddReservationModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase shadow-md hover:brightness-110"
                >
                  Record Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: ASSIGN TABLE & NOTES MODAL
         ========================================================= */}
      {editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141312] border border-[#D4AF37]/50 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Table & Status: #{editingReservation.reservation_code || editingReservation.id}
                </h3>
                <p className="text-xs text-neutral-400">{editingReservation.customer_name} • {editingReservation.party_size || 2} Pax</p>
              </div>
              <button
                onClick={() => setEditingReservation(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReservationDetails} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Reservation Status</label>
                <select
                  value={editResForm.status}
                  onChange={(e) => setEditResForm({ ...editResForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="seated">Seated (Arrived)</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Table Assignment Number</label>
                <input
                  type="text"
                  placeholder="e.g. Terrace T-02, VIP-1"
                  value={editResForm.tableNumber}
                  onChange={(e) => setEditResForm({ ...editResForm, tableNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Internal Admin Notes</label>
                <textarea
                  rows={3}
                  placeholder="Maître d' notes, VIP wine preferences, dietary alerts..."
                  value={editResForm.adminNotes}
                  onChange={(e) => setEditResForm({ ...editResForm, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReservation(null)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase shadow-md hover:brightness-110"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: ADD MENU ITEM MODAL
         ========================================================= */}
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

      {/* =========================================================
          MODAL 4: EDIT MENU ITEM MODAL
         ========================================================= */}
      {editingMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141312] border border-[#D4AF37]/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-serif text-xl font-bold text-white">Edit Dish: {editingMenuItem.name}</h3>
              <button
                onClick={() => setEditingMenuItem(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItemEdit} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingMenuItem.name}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={editingMenuItem.description}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Price in RWF *</label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={editingMenuItem.price}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Category</label>
                  <select
                    value={editingMenuItem.category_id}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, category_id: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Image URL</label>
                <input
                  type="url"
                  value={editingMenuItem.image_url || ''}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMenuItem(null)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase shadow-md hover:brightness-110"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 5: ADD GALLERY ITEM MODAL
         ========================================================= */}
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

      {/* 5. Delete Reservation Confirmation Modal */}
      {reservationToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141312] border border-rose-900/60 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-white">Delete Reservation?</h4>
                <p className="text-xs text-neutral-400">
                  Are you sure you want to permanently remove booking <span className="font-mono text-amber-300 font-bold">{reservationToDelete.reservation_code || `#RES-${reservationToDelete.id}`}</span> for <span className="text-white font-medium">{reservationToDelete.customer_name}</span>?
                </p>
              </div>
            </div>

            <div className="bg-[#0D0C0B] border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-400 space-y-1 font-mono">
              <div><span className="text-neutral-500">Date & Time:</span> <span className="text-neutral-200">{reservationToDelete.reservation_date} at {reservationToDelete.reservation_time}</span></div>
              <div><span className="text-neutral-500">Party Size:</span> <span className="text-neutral-200">{reservationToDelete.party_size} Guests</span></div>
              <div><span className="text-neutral-500">Seating Area:</span> <span className="text-neutral-200 capitalize">{reservationToDelete.seating_area?.replace('_', ' ')}</span></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReservationToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteReservation(reservationToDelete.id)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors"
              >
                Delete Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Registered Client Profile Modal */}
      {selectedClientInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141312] border border-[#D4AF37]/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-white">
                      {selectedClientInfo.full_name || selectedClientInfo.username}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/30">
                      Registered Client
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">
                    @{selectedClientInfo.username} • Account #{selectedClientInfo.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClientInfo(null)}
                className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#0D0C0B] border border-neutral-800 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider block">Verified Email</span>
                <span className="text-white font-mono break-all">{selectedClientInfo.email || '—'}</span>
              </div>
              <div className="p-3.5 bg-[#0D0C0B] border border-neutral-800 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider block">Phone Number</span>
                <span className="text-amber-300 font-mono">{selectedClientInfo.phone || '—'}</span>
              </div>
              <div className="p-3.5 bg-[#0D0C0B] border border-neutral-800 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider block">Member Since</span>
                <span className="text-neutral-200">{selectedClientInfo.created_at ? new Date(selectedClientInfo.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</span>
              </div>
              <div className="p-3.5 bg-[#0D0C0B] border border-neutral-800 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider block">Dining Activity</span>
                <span className="text-[#D4AF37] font-semibold">{selectedClientInfo.total_reservations || 0} Bookings • {selectedClientInfo.total_orders || 0} Orders</span>
              </div>
            </div>

            {/* Direct Concierge Communications */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">Maître d’ Direct Concierge</span>
              <div className="grid grid-cols-2 gap-3">
                {selectedClientInfo.phone && (
                  <a
                    href={`tel:${selectedClientInfo.phone}`}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#D4AF37] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Call Client</span>
                  </a>
                )}
                {selectedClientInfo.phone && (
                  <a
                    href={`https://wa.me/${selectedClientInfo.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp VIP</span>
                  </a>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedClientInfo(null)}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 7: ADD NEW CUSTOMER / VIP PATRON
         ========================================================= */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141312] border border-[#D4AF37]/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Register VIP / Patron</h3>
                <p className="text-xs text-neutral-400">Add a patron profile to the ECCO concierge directory</p>
              </div>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Patron Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean-Luc Habimana"
                  value={newCustomer.fullName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="patron@company.rw"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+250 788 123 456"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Patron Tier</label>
                <select
                  value={newCustomer.tier}
                  onChange={(e) => setNewCustomer({ ...newCustomer, tier: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="VIP Patron">VIP Patron (Concierge Priority)</option>
                  <option value="Frequent Guest">Frequent Guest (Regular)</option>
                  <option value="Regular Guest">Regular Guest</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Concierge & Dining Notes</label>
                <textarea
                  rows={2}
                  placeholder="Seating preferences, dietary allergies, favorite wine, special dates..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md"
                >
                  Save Patron
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 8: EDIT CUSTOMER MODAL
         ========================================================= */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141312] border border-[#D4AF37]/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Edit Patron Profile</h3>
                <p className="text-xs text-neutral-400">Update details for {editingCustomer.fullName || editingCustomer.full_name}</p>
              </div>
              <button
                onClick={() => setEditingCustomer(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Patron Name *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.fullName || editingCustomer.full_name || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, fullName: e.target.value, full_name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Patron Tier</label>
                <select
                  value={editingCustomer.tier || 'VIP Patron'}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, tier: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="VIP Patron">VIP Patron (Concierge Priority)</option>
                  <option value="Frequent Guest">Frequent Guest (Regular)</option>
                  <option value="Regular Guest">Regular Guest</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Concierge & Dining Notes</label>
                <textarea
                  rows={3}
                  value={editingCustomer.notes || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 9: DELETE CUSTOMER CONFIRMATION
         ========================================================= */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141312] border border-rose-900/50 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-white">Delete Patron Record?</h3>
            </div>
            <p className="text-xs text-neutral-300">
              Are you sure you want to remove <strong className="text-white">{customerToDelete.fullName || customerToDelete.full_name}</strong> from the customer directory? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCustomer(customerToDelete.id)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase shadow-md transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
