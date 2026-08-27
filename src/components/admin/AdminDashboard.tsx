import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Utensils, 
  Calendar, 
  ShoppingBag, 
  MessageSquare, 
  Settings, 
  Activity, 
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
  ChevronRight,
  Database
} from 'lucide-react';
import { AuthUser, MenuItemData, CategoryItem } from '../../types';
import { 
  fetchMenuItems, 
  fetchCategories, 
  fetchTableData, 
  fetchPublicInfo, 
  userLogout,
  verifyAdminAccess
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
  const [activeSection, setActiveSection] = useState<'overview' | 'menu' | 'reservations' | 'orders' | 'messages' | 'settings' | 'audit'>('overview');
  
  // Data states
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'all' | 'food' | 'drink'>('all');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock initial orders for rich operational management
  const [orders, setOrders] = useState([
    {
      id: 'ORD-10492',
      customer: 'Jean-Luc Bizimana',
      phone: '0788 123 456',
      address: 'Nyarutarama, Kigali',
      items: '2x Grilled Prime Ribeye, 1x Chateau Musar Red',
      total: 76000,
      status: 'In Kitchen',
      time: '12 mins ago'
    },
    {
      id: 'ORD-10491',
      customer: 'Aline Umutoni',
      phone: '0788 987 654',
      address: 'Kiyovu, Kigali KK 28',
      items: '1x Pan-Seared Salmon Fillet, 1x Sparkling San Pellegrino',
      total: 31000,
      status: 'Ready for Pickup',
      time: '28 mins ago'
    },
    {
      id: 'ORD-10490',
      customer: 'David Nshimiyimana',
      phone: '0788 444 333',
      address: 'Kimihurura, Kigali',
      items: '3x Kigali Sunset Cocktails, 1x Truffle Risotto',
      total: 48000,
      status: 'Delivered',
      time: '1 hour ago'
    }
  ]);

  // Mock initial reservations
  const [reservations, setReservations] = useState([
    {
      id: 'RES-8821',
      guestName: 'Eric Manzi',
      phone: '0701537890',
      email: 'eric.manzi@eko.rw',
      date: 'Tonight',
      time: '19:30',
      guests: 4,
      seating: 'Kigali Sunset Terrace',
      status: 'Confirmed'
    },
    {
      id: 'RES-8820',
      guestName: 'Grace Uwase',
      phone: '0788 555 111',
      email: 'grace@example.com',
      date: 'Tonight',
      time: '20:00',
      guests: 2,
      seating: 'VIP Private Suite',
      status: 'Confirmed'
    },
    {
      id: 'RES-8819',
      guestName: 'Marc Habimana',
      phone: '0788 222 999',
      email: 'marc@example.com',
      date: 'Tomorrow',
      time: '13:00',
      guests: 6,
      seating: 'Grand Dining Hall',
      status: 'Pending Review'
    }
  ]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [menuRes, catRes, infoRes, logsRes, msgRes, usersRes] = await Promise.all([
        fetchMenuItems(),
        fetchCategories(),
        fetchPublicInfo(),
        fetchTableData('activity_logs').catch(() => ({ data: [] })),
        fetchTableData('contact_messages').catch(() => ({ data: [] })),
        fetchTableData('users').catch(() => ({ count: 0 }))
      ]);

      setMenuItems(menuRes.data || []);
      setCategories(catRes.data || []);
      setRestaurantInfo(infoRes.data || null);
      setActivityLogs(logsRes.data || []);
      setContactMessages(msgRes.data || []);
      setUsersCount(usersRes.count || 0);
    } catch (err: any) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    setNotice({ type: 'success', text: `Order ${orderId} updated to '${newStatus}'` });
  };

  const handleUpdateReservationStatus = (resId: string, newStatus: string) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === resId ? { ...res, status: newStatus } : res))
    );
    setNotice({ type: 'success', text: `Reservation ${resId} marked as '${newStatus}'` });
  };

  const handleToggleItemAvailability = (itemId: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, is_available: !item.is_available } : item
      )
    );
    setNotice({ type: 'success', text: `Menu item availability toggled` });
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
      {/* Top Admin Navigation Header */}
      <header className="border-b border-[#27272a] bg-[#111114]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-black flex items-center justify-center font-serif font-bold text-xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-wider text-lg text-white">EKO RESTAURANT</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[#d4af37] text-[10px] font-mono uppercase font-bold tracking-wider">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-[#a1a1aa] font-mono">
                Kigali Executive Management Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {onOpenStageVerification && (
              <button
                onClick={onOpenStageVerification}
                className="px-3 py-1.5 rounded-lg bg-[#18181c] hover:bg-[#222228] border border-[#27272a] text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Verification Matrix</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-3 bg-[#18181c] border border-[#27272a] px-3.5 py-1.5 rounded-xl text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="font-semibold text-white">{currentUser.username || currentUser.full_name || 'Admin'}</span>
                <span className="text-[10px] text-[#d4af37] block font-mono">Role: Administrator</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 transition-colors"
              title="Logout from Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="p-3 bg-[#121216] border border-[#27272a] rounded-2xl space-y-1">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'overview'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold shadow-lg'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Operations Overview</span>
            </button>

            <button
              onClick={() => setActiveSection('menu')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'menu'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold shadow-lg'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Menu Items ({menuItems.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'orders'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold shadow-lg'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Live Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('reservations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'reservations'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold shadow-lg'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Reservations ({reservations.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('messages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'messages'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold shadow-lg'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries ({contactMessages.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'settings'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold shadow-lg'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Restaurant Details</span>
            </button>

            <button
              onClick={() => setActiveSection('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === 'audit'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold shadow-lg'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Audit Logs</span>
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 bg-[#121216] border border-[#27272a] rounded-2xl text-xs space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
              Kigali Concierge
            </span>
            <p className="text-neutral-300">
              Address: <strong className="text-white">KK 554</strong>
            </p>
            <p className="text-neutral-300">
              Hotline: <strong className="text-white">0701537890</strong>
            </p>
            <p className="text-neutral-300">
              Hours: <strong className="text-white">10:00 – 23:00</strong>
            </p>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 space-y-6">
          {notice && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              notice.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{notice.text}</span>
              </div>
              <button onClick={() => setNotice(null)} className="text-xs opacity-70 hover:opacity-100">
                Dismiss
              </button>
            </div>
          )}

          {/* SECTION 1: OVERVIEW METRICS */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#121216] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between text-[#a1a1aa]">
                    <span className="text-xs font-mono uppercase">Today's Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">
                    155,000 <span className="text-xs font-mono text-[#d4af37]">RWF</span>
                  </p>
                  <p className="text-[11px] text-emerald-400">+18% from yesterday</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#121216] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between text-[#a1a1aa]">
                    <span className="text-xs font-mono uppercase">Active Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">
                    {orders.length} <span className="text-xs font-mono text-neutral-400">orders</span>
                  </p>
                  <p className="text-[11px] text-amber-300">2 In Kitchen, 1 Ready</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#121216] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between text-[#a1a1aa]">
                    <span className="text-xs font-mono uppercase">Table Bookings</span>
                    <Calendar className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">
                    {reservations.length} <span className="text-xs font-mono text-neutral-400">tables</span>
                  </p>
                  <p className="text-[11px] text-emerald-400">Terrace & VIP Suite booked</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#121216] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between text-[#a1a1aa]">
                    <span className="text-xs font-mono uppercase">Menu Items</span>
                    <Utensils className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">
                    {menuItems.length} <span className="text-xs font-mono text-neutral-400">dishes/drinks</span>
                  </p>
                  <p className="text-[11px] text-neutral-400">Across {categories.length} categories</p>
                </div>
              </div>

              {/* Live Kitchen & Orders Board */}
              <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-serif text-lg font-bold text-white">Live Kitchen Orders</h3>
                  </div>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-xs text-[#d4af37] hover:underline font-mono"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-neutral-800">
                  {orders.map((ord) => (
                    <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#d4af37]">{ord.id}</span>
                          <span className="text-sm font-semibold text-white">{ord.customer}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">({ord.time})</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">{ord.items}</p>
                        <p className="text-[11px] text-neutral-500">{ord.address} • {ord.phone}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-white">
                          {ord.total.toLocaleString()} RWF
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-amber-300 font-semibold focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Kitchen">In Kitchen</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: MENU MANAGEMENT */}
          {activeSection === 'menu' && (
            <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272a] space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">Menu Catalog Management</h3>
                  <p className="text-xs text-neutral-400">Manage all 35 authentic Kigali food & beverage offerings</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      selectedType === 'all' ? 'bg-[#d4af37] text-black' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    All ({menuItems.length})
                  </button>
                  <button
                    onClick={() => setSelectedType('food')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      selectedType === 'food' ? 'bg-[#d4af37] text-black' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    Food
                  </button>
                  <button
                    onClick={() => setSelectedType('drink')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      selectedType === 'drink' ? 'bg-[#d4af37] text-black' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    Drinks
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dishes, beverages, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Table of Menu Items */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[11px]">
                      <th className="py-3 px-2">Item</th>
                      <th className="py-3 px-2">Type / Category</th>
                      <th className="py-3 px-2">Price (RWF)</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-900/40">
                        <td className="py-3 px-2 font-medium text-white flex items-center gap-3">
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80'}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-800 shrink-0"
                          />
                          <div>
                            <span className="font-semibold block">{item.name}</span>
                            <span className="text-[10px] text-neutral-500 line-clamp-1">{item.description}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                            item.type === 'food' ? 'bg-amber-500/10 text-amber-300' : 'bg-sky-500/10 text-sky-300'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-amber-300">
                          {item.price.toLocaleString()} RWF
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.is_available !== false
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {item.is_available !== false ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => handleToggleItemAvailability(item.id)}
                            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white"
                          >
                            Toggle Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: ORDERS */}
          {activeSection === 'orders' && (
            <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272a] space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Live Orders Management</h3>
                <p className="text-xs text-neutral-400">Track delivery dispatched orders & kitchen queue</p>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#d4af37]">{ord.id}</span>
                        <span className="font-semibold text-white">{ord.customer}</span>
                        <span className="text-xs text-neutral-400 font-mono">({ord.phone})</span>
                      </div>
                      <p className="text-xs text-neutral-300">{ord.items}</p>
                      <p className="text-xs text-neutral-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{ord.address}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 font-mono block">Order Total</span>
                        <span className="font-serif text-lg font-bold text-amber-300 font-mono">
                          {ord.total.toLocaleString()} RWF
                        </span>
                      </div>

                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white font-semibold focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Kitchen">In Kitchen</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: RESERVATIONS */}
          {activeSection === 'reservations' && (
            <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272a] space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Table Reservations Maître d'</h3>
                <p className="text-xs text-neutral-400">Review seating allocation and guest arrival times</p>
              </div>

              <div className="space-y-4">
                {reservations.map((res) => (
                  <div key={res.id} className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#d4af37]">{res.id}</span>
                        <span className="font-semibold text-white">{res.guestName}</span>
                        <span className="text-xs text-amber-300 font-bold font-mono">({res.guests} Guests)</span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        <strong className="text-white">{res.date} at {res.time}</strong> • Seating: {res.seating}
                      </p>
                      <p className="text-xs text-neutral-400 font-mono">
                        Phone: {res.phone} • Email: {res.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        res.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {res.status}
                      </span>

                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, res.status === 'Confirmed' ? 'Seated' : 'Confirmed')}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-white"
                      >
                        {res.status === 'Confirmed' ? 'Mark Seated' : 'Confirm Table'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: MESSAGES / INQUIRIES */}
          {activeSection === 'messages' && (
            <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272a] space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Customer Inquiries & Concierge</h3>
                <p className="text-xs text-neutral-400">Direct messages submitted by Kigali guests</p>
              </div>

              {contactMessages.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 bg-neutral-900/40 rounded-xl border border-neutral-800">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No new contact messages in the queue.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactMessages.map((msg: any) => (
                    <div key={msg.id} className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{msg.full_name}</span>
                          <span className="text-xs text-neutral-400 font-mono">({msg.email})</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#d4af37]">{msg.subject}</p>
                      <p className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-neutral-800">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 6: SETTINGS */}
          {activeSection === 'settings' && (
            <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272a] space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Restaurant Profile & Details</h3>
                <p className="text-xs text-neutral-400">Live configuration for Eko Restaurant Kigali</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Restaurant Slogan</span>
                  <p className="font-serif text-sm font-semibold text-white">
                    "A Symphony of Flavors, Where Kigali Meets Culinary Artistry"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Physical Location</span>
                  <p className="font-semibold text-white">Kigali, KK 554, Rwanda</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Official Phone / WhatsApp</span>
                  <p className="font-mono text-amber-300 font-semibold">0701537890</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Official Email</span>
                  <p className="text-sky-300 font-mono">mugishamp7@gmail.com</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Service Hours</span>
                  <p className="font-semibold text-white">Every day, 10:00 – 23:00</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Security Admin User</span>
                  <p className="font-mono text-emerald-400 font-semibold">{currentUser.username || 'admin'}</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: AUDIT LOGS */}
          {activeSection === 'audit' && (
            <div className="p-6 rounded-2xl bg-[#121216] border border-[#27272a] space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Security & Activity Audit Logs</h3>
                <p className="text-xs text-neutral-400">Server-side recorded administrative operations & logins</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                      <th className="py-2.5 px-2">ID</th>
                      <th className="py-2.5 px-2">Action</th>
                      <th className="py-2.5 px-2">User / Role</th>
                      <th className="py-2.5 px-2">Details</th>
                      <th className="py-2.5 px-2 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {activityLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-neutral-900/40">
                        <td className="py-2.5 px-2 text-neutral-500">#{log.id}</td>
                        <td className="py-2.5 px-2 font-bold text-amber-300">{log.action}</td>
                        <td className="py-2.5 px-2 text-white">{log.user_type || 'admin'}</td>
                        <td className="py-2.5 px-2 text-neutral-400">{log.details || '—'}</td>
                        <td className="py-2.5 px-2 text-right text-neutral-500">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
