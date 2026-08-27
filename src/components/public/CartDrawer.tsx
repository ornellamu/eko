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
  ShieldCheck
} from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [orderMode, setOrderMode] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'airtel' | 'card' | 'cash'>('momo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.menu_item.price * item.quantity, 0);
  const deliveryFee = orderMode === 'delivery' ? 3000 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCompletedOrder({
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        name: customerName,
        phone: customerPhone,
        total: total,
        mode: orderMode,
        address: orderMode === 'delivery' ? deliveryAddress : 'Pickup at Eko KK 554',
        payment: paymentMethod
      });
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121110] border-l border-[#D4AF37]/30 text-neutral-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-[#161514]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-bold text-white">Your Culinary Basket</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {completedOrder ? (
              <div className="text-center py-10 space-y-4 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-black flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Order Received!</h3>
                <p className="text-xs text-neutral-300">
                  Thank you, <strong className="text-white">{completedOrder.name}</strong>. The Eko kitchen is preparing your dishes.
                </p>

                <div className="p-4 bg-[#0D0C0B] border border-neutral-800 rounded-xl text-left text-xs font-mono space-y-1.5 text-neutral-400">
                  <p><span className="text-[#D4AF37]">Order Ref:</span> {completedOrder.id}</p>
                  <p><span className="text-[#D4AF37]">Amount:</span> {completedOrder.total.toLocaleString()} RWF</p>
                  <p><span className="text-[#D4AF37]">Fulfillment:</span> {completedOrder.mode.toUpperCase()}</p>
                  <p><span className="text-[#D4AF37]">Location:</span> {completedOrder.address}</p>
                  <p><span className="text-[#D4AF37]">Hotline:</span> 0701537890</p>
                </div>

                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase"
                >
                  Return to Menu
                </button>
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
                    <div key={item.menu_item.id} className="py-3.5 flex items-center justify-between gap-3">
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

                {/* Checkout Details Form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-neutral-800 text-xs">
                  {/* Delivery vs Pickup Toggle */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#0D0C0B] rounded-xl border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setOrderMode('delivery')}
                      className={`py-2 rounded-lg font-semibold transition-all ${
                        orderMode === 'delivery' ? 'bg-[#D4AF37] text-black' : 'text-neutral-400'
                      }`}
                    >
                      Kigali Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderMode('pickup')}
                      className={`py-2 rounded-lg font-semibold transition-all ${
                        orderMode === 'pickup' ? 'bg-[#D4AF37] text-black' : 'text-neutral-400'
                      }`}
                    >
                      Pickup at Eko (KK 554)
                    </button>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp (e.g. 0788 123 456) *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    {orderMode === 'delivery' && (
                      <input
                        type="text"
                        required
                        placeholder="Delivery Address in Kigali (e.g. Nyarutarama, KK 28) *"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-mono uppercase text-neutral-400 block">Payment Method</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`p-2 rounded-lg border text-left ${
                          paymentMethod === 'momo' ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158]' : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                        }`}
                      >
                        <span className="font-bold block">MTN MoMo</span>
                        <span className="text-[10px] text-neutral-500">Instant Mobile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('airtel')}
                        className={`p-2 rounded-lg border text-left ${
                          paymentMethod === 'airtel' ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158]' : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                        }`}
                      >
                        <span className="font-bold block">Airtel Money</span>
                        <span className="text-[10px] text-neutral-500">Rwanda Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2 rounded-lg border text-left ${
                          paymentMethod === 'card' ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158]' : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                        }`}
                      >
                        <span className="font-bold block">Visa / Master</span>
                        <span className="text-[10px] text-neutral-500">Card POS</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-2 rounded-lg border text-left ${
                          paymentMethod === 'cash' ? 'border-[#D4AF37] bg-[#1C1A17] text-[#E5C158]' : 'border-neutral-800 bg-[#0D0C0B] text-neutral-400'
                        }`}
                      >
                        <span className="font-bold block">Cash on Delivery</span>
                        <span className="text-[10px] text-neutral-500">Pay Courier</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="p-4 bg-[#0D0C0B] border border-neutral-800 rounded-xl space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal:</span>
                      <span>{subtotal.toLocaleString()} RWF</span>
                    </div>
                    {orderMode === 'delivery' && (
                      <div className="flex justify-between text-neutral-400">
                        <span>Kigali Delivery:</span>
                        <span>{deliveryFee.toLocaleString()} RWF</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-neutral-800">
                      <span>Total Amount:</span>
                      <span className="text-[#E5C158]">{total.toLocaleString()} RWF</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Placing Order in Kitchen...' : `Place Order (${total.toLocaleString()} RWF)`}
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
