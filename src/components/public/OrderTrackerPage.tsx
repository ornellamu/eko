import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  UtensilsCrossed, 
  Smartphone,
  Copy,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { trackOrder } from '../../services/api';
import { OrderData } from '../../types';

interface OrderTrackerPageProps {
  initialReference?: string | null;
  onNavigateToMenu: () => void;
}

export function OrderTrackerPage({ initialReference, onNavigateToMenu }: OrderTrackerPageProps) {
  const [referenceInput, setReferenceInput] = useState(initialReference || '');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchOrder = async (ref: string) => {
    if (!ref.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await trackOrder(ref.trim());
      if (res.data && res.data.order) {
        setOrder(res.data.order);
      } else {
        throw new Error('Order not found');
      }
    } catch (err: any) {
      setError(err.message || 'Could not locate order. Please check the reference code.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialReference) {
      setReferenceInput(initialReference);
      fetchOrder(initialReference);
    }
  }, [initialReference]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(referenceInput);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
      case 'out_for_delivery':
        return 3;
      case 'delivered':
      case 'completed':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 1;

  const copyRef = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans text-neutral-200">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181715] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono uppercase">
          <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Real-Time Kitchen & Dispatch Tracking</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Track Your Eko Order
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light">
          Enter your order reference code (e.g. <strong className="text-neutral-300">EKO-2026-XXXX</strong>) to view real-time preparation progress and delivery status.
        </p>
      </div>

      {/* Reference Input Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2 p-2 bg-[#141312] border border-[#D4AF37]/30 rounded-2xl shadow-xl">
        <div className="relative flex-1">
          <Package className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            placeholder="Enter Order Ref (e.g. EKO-2026-8942)"
            value={referenceInput}
            onChange={(e) => setReferenceInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-white placeholder-neutral-500 focus:outline-none uppercase font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          {isLoading ? 'Tracking...' : 'Track'}
        </button>
      </form>

      {/* Error View */}
      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <p className="font-semibold">Order Not Found</p>
            <p className="text-[11px] text-rose-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-[#141312] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl animate-in fade-in">
          {/* Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#D4AF37] uppercase">Order Reference</span>
                <button
                  onClick={copyRef}
                  className="flex items-center gap-1 text-white bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 rounded text-[11px] font-mono"
                >
                  <Copy className="w-3 h-3 text-[#D4AF37]" />
                  <span>{copied ? 'Copied' : order.order_number}</span>
                </button>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">
                {order.customer_name}
              </h2>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 rounded-full bg-[#1C1A17] border border-[#D4AF37]/40 text-[#E5C158] text-xs font-mono font-bold uppercase">
                {order.status.replace(/_/g, ' ')}
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">
                Placed {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase text-[#D4AF37] tracking-wider">Live Kitchen & Dispatch Timeline</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                currentStep >= 1 
                  ? 'bg-[#181715] border-[#D4AF37]/50 text-white shadow-md' 
                  : 'bg-[#0D0C0B] border-neutral-800 text-neutral-500'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className={`w-4 h-4 ${currentStep >= 1 ? 'text-[#D4AF37]' : 'text-neutral-600'}`} />
                  <span className="font-bold text-xs">1. Confirmed</span>
                </div>
                <p className="text-[11px] text-neutral-400">Order logged & sent to head chef</p>
              </div>

              {/* Step 2 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                currentStep >= 2 
                  ? 'bg-[#181715] border-[#D4AF37]/50 text-white shadow-md' 
                  : 'bg-[#0D0C0B] border-neutral-800 text-neutral-500'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <UtensilsCrossed className={`w-4 h-4 ${currentStep >= 2 ? 'text-[#D4AF37]' : 'text-neutral-600'}`} />
                  <span className="font-bold text-xs">2. In Kitchen</span>
                </div>
                <p className="text-[11px] text-neutral-400">Dishes simmering & grilled fresh</p>
              </div>

              {/* Step 3 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                currentStep >= 3 
                  ? 'bg-[#181715] border-[#D4AF37]/50 text-white shadow-md' 
                  : 'bg-[#0D0C0B] border-neutral-800 text-neutral-500'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Truck className={`w-4 h-4 ${currentStep >= 3 ? 'text-[#D4AF37]' : 'text-neutral-600'}`} />
                  <span className="font-bold text-xs">3. Out on Route</span>
                </div>
                <p className="text-[11px] text-neutral-400">Courier dispatched in Kigali</p>
              </div>

              {/* Step 4 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                currentStep >= 4 
                  ? 'bg-emerald-950/30 border-emerald-500/60 text-white shadow-md' 
                  : 'bg-[#0D0C0B] border-neutral-800 text-neutral-500'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className={`w-4 h-4 ${currentStep >= 4 ? 'text-emerald-400' : 'text-neutral-600'}`} />
                  <span className="font-bold text-xs">4. Delivered</span>
                </div>
                <p className="text-[11px] text-neutral-400">Enjoy your gourmet meal</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Items Summary */}
            <div className="bg-[#0D0C0B] border border-neutral-800 rounded-2xl p-5 space-y-3">
              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#D4AF37]" />
                <span>Culinary Selection</span>
              </h4>
              <div className="divide-y divide-neutral-800/80 text-xs">
                {order.items && order.items.map((item: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.quantity}x {item.item_name || item.name}</p>
                      {item.special_instructions && (
                        <p className="text-[10px] text-neutral-500 italic">"{item.special_instructions}"</p>
                      )}
                    </div>
                    <span className="font-mono text-[#E5C158] font-bold">
                      {(item.subtotal || (item.unit_price * item.quantity)).toLocaleString()} RWF
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-800 font-mono text-xs space-y-1 text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{order.subtotal_amount.toLocaleString()} RWF</span>
                </div>
                {order.delivery_fee > 0 && (
                  <div className="flex justify-between">
                    <span>Kigali Delivery:</span>
                    <span>{order.delivery_fee.toLocaleString()} RWF</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-neutral-800">
                  <span>Total Paid:</span>
                  <span className="text-[#E5C158]">{order.total_amount.toLocaleString()} RWF</span>
                </div>
              </div>
            </div>

            {/* Delivery & Concierge Info */}
            <div className="bg-[#0D0C0B] border border-neutral-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>Fulfillment & Destination</span>
                </h4>
                <div className="text-xs font-mono space-y-2 text-neutral-300">
                  <p><span className="text-neutral-500">Method:</span> <strong className="text-white uppercase">{order.order_type}</strong></p>
                  {order.delivery_address && (
                    <p><span className="text-neutral-500">Address:</span> <strong className="text-white">{order.delivery_address}</strong></p>
                  )}
                  {order.delivery_landmark && (
                    <p><span className="text-neutral-500">Landmark:</span> {order.delivery_landmark}</p>
                  )}
                  {order.table_number && (
                    <p><span className="text-neutral-500">Table:</span> {order.table_number}</p>
                  )}
                  <p><span className="text-neutral-500">Recipient Phone:</span> {order.customer_phone}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <a
                  href={`https://wa.me/250701537890?text=${encodeURIComponent(`Hello Eko Concierge, inquiry regarding order ${order.order_number}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#1C1A17] border border-[#D4AF37]/30 text-white font-mono text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Chat with Concierge (0701537890)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return to Menu */}
      <div className="text-center pt-4">
        <button
          onClick={onNavigateToMenu}
          className="text-xs font-mono text-[#D4AF37] hover:underline"
        >
          ← Return to Culinary Menu
        </button>
      </div>
    </div>
  );
}
