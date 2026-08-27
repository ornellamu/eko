import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShoppingBag, 
  Calendar as CalendarIcon, 
  LogOut, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  RefreshCw,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { AuthUser, OrderData, ReservationData } from '../../types';
import { fetchMyOrders, fetchMyReservations } from '../../services/api';

interface CustomerDashboardProps {
  user: AuthUser;
  token: string;
  onLogout: () => void;
  onTrackOrder: (reference: string) => void;
  onNavigateToMenu: () => void;
  onNavigateToReservation: () => void;
}

export function CustomerDashboard({
  user,
  token,
  onLogout,
  onTrackOrder,
  onNavigateToMenu,
  onNavigateToReservation
}: CustomerDashboardProps) {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [orderRes, resRes] = await Promise.all([
        fetchMyOrders(token).catch(() => ({ data: { orders: [] } })),
        fetchMyReservations(token).catch(() => ({ data: { reservations: [] } }))
      ]);
      setOrders(orderRes.data?.orders || []);
      setReservations(resRes.data?.reservations || []);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans text-neutral-200">
      {/* Profile Header */}
      <div className="bg-[#141312] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-amber-300 text-black flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'E'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {user.full_name || user.username || 'Valued Guest'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1C1A17] border border-[#D4AF37]/40 text-[#E5C158] text-[10px] font-mono uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-1 flex items-center gap-3">
              <span>{user.email}</span>
              {user.phone && <span>• {user.phone}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
            title="Refresh Account Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-[#141312] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-neutral-400 uppercase">My Culinary Orders</span>
            <p className="font-serif text-2xl font-bold text-white">{orders.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0D0C0B] border border-neutral-800 text-[#D4AF37]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-[#141312] border border-neutral-800 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-neutral-400 uppercase">Table Reservations</span>
            <p className="font-serif text-2xl font-bold text-white">{reservations.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0D0C0B] border border-neutral-800 text-[#D4AF37]">
            <CalendarIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Reservations ({reservations.length})</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'orders' ? (
          orders.length === 0 ? (
            <div className="text-center py-16 bg-[#141312] rounded-3xl border border-neutral-800 space-y-4">
              <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="font-serif text-xl text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Explore our 35 authentic offerings priced in Rwandan Francs (RWF) to make your first order.
              </p>
              <button
                onClick={onNavigateToMenu}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase shadow-md"
              >
                Browse Culinary Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#141312] border border-neutral-800 hover:border-[#D4AF37]/50 rounded-2xl p-6 transition-all space-y-4 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-800">
                    <div>
                      <span className="text-[11px] font-mono text-[#D4AF37]">Reference: {ord.order_number}</span>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">
                        {new Date(ord.created_at).toLocaleDateString()} at {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#1C1A17] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono font-bold uppercase">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                      <button
                        onClick={() => onTrackOrder(ord.order_number)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono flex items-center gap-1 transition-colors"
                      >
                        <span>Track</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between items-center text-xs">
                    <div className="space-y-1">
                      <p className="text-neutral-300">
                        <strong>Fulfillment:</strong> <span className="uppercase text-neutral-400">{ord.order_type}</span>
                      </p>
                      {ord.delivery_address && (
                        <p className="text-neutral-400">Destination: {ord.delivery_address}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-500 font-mono text-[11px]">Total Paid:</span>
                      <p className="font-serif text-lg font-bold text-[#E5C158]">{ord.total_amount.toLocaleString()} RWF</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          reservations.length === 0 ? (
            <div className="text-center py-16 bg-[#141312] rounded-3xl border border-neutral-800 space-y-4">
              <CalendarIcon className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="font-serif text-xl text-white">No Table Reservations Found</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Reserve your table in the Grand Dining Hall, Kigali Sunset Terrace, or VIP Suite.
              </p>
              <button
                onClick={onNavigateToReservation}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase shadow-md"
              >
                Book Table Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-[#141312] border border-neutral-800 rounded-2xl p-6 space-y-3 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-800">
                    <div>
                      <span className="text-[11px] font-mono text-[#D4AF37]">Code: {res.reservation_code}</span>
                      <h4 className="font-serif text-lg font-bold text-white capitalize">
                        {res.seating_area.replace(/_/g, ' ')}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/40 text-xs font-mono font-bold uppercase">
                      {res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-neutral-300">
                    <p><span className="text-neutral-500">Date:</span> {res.reservation_date}</p>
                    <p><span className="text-neutral-500">Time:</span> {res.reservation_time}</p>
                    <p><span className="text-neutral-500">Party:</span> {res.party_size} Guests</p>
                    <p><span className="text-neutral-500">Venue:</span> KK 554, Kigali</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
