import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Copy,
  Clock,
  Sparkles
} from 'lucide-react';
import { CartItem, OrderData } from '../../types';
import { createOrder } from '../../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  authToken?: string | null;
  currentUser?: any | null;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onTrackOrder: (reference: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  authToken,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onTrackOrder
}: CartDrawerProps) {
  const [orderMode, setOrderMode] = useState<'delivery' | 'pickup' | 'dine_in'>('delivery');
  const [customerName, setCustomerName] = useState(currentUser?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLandmark, setDeliveryLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'airtel' | 'card' | 'cash'>('momo');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [showMomoPrompt, setShowMomoPrompt] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.menu_item.price * item.quantity, 0);
  const deliveryFee = orderMode === 'delivery' ? 3000 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setErrorMessage(null);

    // If Momo selected, simulate brief prompt dialog
    if (paymentMethod === 'momo') {
      setShowMomoPrompt(true);
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName || 'Valued Guest',
        customerEmail: customerEmail || 'guest@eko-kigali.rw',
        customerPhone: customerPhone || '0788000000',
        orderType: orderMode,
        deliveryAddress: orderMode === 'delivery' ? deliveryAddress : undefined,
        deliveryLandmark: orderMode === 'delivery' ? deliveryLandmark : undefined,
        deliveryNotes: deliveryNotes || undefined,
        tableNumber: orderMode === 'dine_in' ? tableNumber : undefined,
        paymentMethod,
        paymentPhone: paymentPhone || customerPhone,
        items: items.map(item => ({
          menuItemId: item.menu_item.id,
          quantity: item.quantity,
          specialInstructions: ''
        }))
      };

      const res = await createOrder(payload, authToken || undefined);
      if (res.data && res.data.order) {
        setCompletedOrder(res.data.order);
        onClearCart();
      } else {
        throw new Error('Order creation did not return order details');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowMomoPrompt(false);
    }
  };

  const copyOrderReference = () => {
    if (!completedOrder) return;
    navigator.clipboard.writeText(completedOrder.order_number);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#121110] border-l border-[#D4AF37]/30 text-neutral-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-[#161514]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-bold text-white">Your Culinary Basket</h2>
              <span className="text-xs font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#1C1A17] border border-[#D4AF37]/30">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {completedOrder ? (
              <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-amber-300 text-black flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">Order Confirmed!</h3>
                  <p className="text-xs text-neutral-300 mt-1">
                    Thank you, <strong className="text-white">{completedOrder.customer_name}</strong>. The Eko kitchen has received your order ticket.
                  </p>
                </div>

                <div className="p-5 bg-[#0D0C0B] border border-[#D4AF37]/40 rounded-2xl text-left text-xs font-mono space-y-2 text-neutral-300 relative shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-[#D4AF37] font-bold">Order Reference</span>
                    <button
                      onClick={copyOrderReference}
                      className="flex items-center gap-1 text-white bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded text-[11px]"
                    >
                      <Copy className="w-3 h-3 text-[#D4AF37]" />
                      <span>{copiedRef ? 'Copied!' : completedOrder.order_number}</span>
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Amount:</span>
                    <span className="text-[#E5C158] font-bold">{completedOrder.total_amount.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Fulfillment:</span>
                    <span className="text-white uppercase">{completedOrder.order_type}</span>
                  </div>
                  {completedOrder.delivery_address && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Destination:</span>
                      <span className="text-white truncate max-w-[200px]">{completedOrder.delivery_address}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Est. Time:</span>
                    <span className="text-white">{completedOrder.estimated_time_minutes || 35} mins</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-800/80">
                    <span className="text-neutral-500">Hotline:</span>
                    <span className="text-amber-400">0701537890</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => {
                      onTrackOrder(completedOrder.order_number);
                      onClose();
                      setCompletedOrder(null);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:brightness-110"
                  >
                    <span>Track Live Delivery Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/250701537890?text=${encodeURIComponent(`Hello Eko Kigali Concierge, I just placed order ${completedOrder.order_number} for ${completedOrder.total_amount.toLocaleString()} RWF.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#1C1A17] border border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Concierge (0701537890)</span>
                  </a>

                  <button
                    onClick={() => {
                      setCompletedOrder(null);
                      onClose();
                    }}
                    className="w-full py-2 text-neutral-500 hover:text-neutral-400 text-xs"
                  >
                    Close Basket
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-3 text-neutral-500">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 opacity-60" />
                <p className="text-sm font-medium text-neutral-300">Your basket is empty</p>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore our 35 authentic culinary cuts and drinks to add items.
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="divide-y divide-neutral-800">
                  {items.map((item) => (
                    <div key={item.menu_item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">{item.menu_item.name}</h4>
                        <p className="text-[11px] font-mono text-[#E5C158]">
                          {item.menu_item.price.toLocaleString()} RWF
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#0D0C0B] border border-neutral-800 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.menu_item.id, -1)}
                            className="p-1 text-neutral-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.menu_item.id, 1)}
                            className="p-1 text-neutral-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.menu_item.id)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Checkout Details Form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-neutral-800 text-xs">
                  {/* Fulfillment Mode Toggle */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0D0C0B] rounded-xl border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setOrderMode('delivery')}
                      className={`py-2 rounded-lg font-semibold text-[11px] transition-all ${
                        orderMode === 'delivery' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Kigali Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderMode('pickup')}
                      className={`py-2 rounded-lg font-semibold text-[11px] transition-all ${
                        orderMode === 'pickup' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400'
                      }`}
                    >
                      KK 554 Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderMode('dine_in')}
                      className={`py-2 rounded-lg font-semibold text-[11px] transition-all ${
                        orderMode === 'dine_in' ? 'bg-[#D4AF37] text-black font-bold' : 'text-neutral-400'
                      }`}
                    >
                      Dine-in Table
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Your Email *"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp (e.g. 0788 123 456) *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                    />

                    {orderMode === 'delivery' && (
                      <>
                        <input
                          type="text"
                          required
                          placeholder="Delivery Address (e.g. Nyarutarama KG 9 Ave, Kiyovu) *"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                        />
                        <input
                          type="text"
                          placeholder="Nearest Landmark / Gate Color (Optional)"
                          value={deliveryLandmark}
                          onChange={(e) => setDeliveryLandmark(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </>
                    )}

                    {orderMode === 'dine_in' && (
                      <input
                        type="text"
                        required
                        placeholder="Table Number / Hall Area (e.g. Table 8 - Terrace) *"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    )}

                    <input
                      type="text"
                      placeholder="Special Culinary Requests or Delivery Notes..."
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-mono uppercase text-[#D4AF37] block">Payment Method</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          paymentMethod === 'momo' ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158] shadow-md' : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                        }`}
                      >
                        <span className="font-bold block text-xs">MTN MoMo</span>
                        <span className="text-[10px] text-neutral-500">*182# Instant Push</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('airtel')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          paymentMethod === 'airtel' ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158] shadow-md' : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                        }`}
                      >
                        <span className="font-bold block text-xs">Airtel Money</span>
                        <span className="text-[10px] text-neutral-500">Rwanda Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          paymentMethod === 'card' ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158] shadow-md' : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                        }`}
                      >
                        <span className="font-bold block text-xs">Visa / Master</span>
                        <span className="text-[10px] text-neutral-500">Card POS</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          paymentMethod === 'cash' ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158] shadow-md' : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                        }`}
                      >
                        <span className="font-bold block text-xs">Cash on Delivery</span>
                        <span className="text-[10px] text-neutral-500">Pay Courier / Table</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="p-4 bg-[#0D0C0B] border border-neutral-800 rounded-xl space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal ({items.length} items):</span>
                      <span>{subtotal.toLocaleString()} RWF</span>
                    </div>
                    {orderMode === 'delivery' && (
                      <div className="flex justify-between text-neutral-400">
                        <span>Kigali Delivery Fee:</span>
                        <span>{deliveryFee.toLocaleString()} RWF</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-neutral-800">
                      <span>Total to Pay:</span>
                      <span className="text-[#E5C158]">{total.toLocaleString()} RWF</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <span>Placing Order with Executive Kitchen...</span>
                    ) : (
                      <span>Confirm Order ({total.toLocaleString()} RWF)</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
