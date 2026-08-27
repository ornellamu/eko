import React, { useState } from 'react';
import { 
  Search, 
  UtensilsCrossed, 
  Wine, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  Filter,
  Plus,
  Flame,
  Clock,
  Info,
  X,
  Award,
  ChevronRight
} from 'lucide-react';
import { MenuItemData, CategoryItem } from '../../types';

interface MenuPageProps {
  menuItems: MenuItemData[];
  categories: CategoryItem[];
  onAddToCart: (item: MenuItemData, quantity?: number) => void;
}

export function MenuPage({ menuItems, categories, onAddToCart }: MenuPageProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'food' | 'drink'>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSpecialOnly, setFilterSpecialOnly] = useState<boolean>(false);
  const [filterSpicyOnly, setFilterSpicyOnly] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [activeItemModal, setActiveItemModal] = useState<MenuItemData | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);

  const handleAddItem = (item: MenuItemData, qty: number = 1) => {
    onAddToCart(item, qty);
    setAddedNotice(`Added ${qty}x "${item.name}" to your basket`);
    setTimeout(() => {
      setAddedNotice(null);
    }, 2500);
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecial = !filterSpecialOnly || item.is_chef_special;
    const matchesSpicy = !filterSpicyOnly || (item.spicy_level && item.spicy_level > 0);
    return matchesType && matchesCategory && matchesSearch && matchesSpecial && matchesSpicy;
  });

  // Visible categories
  const visibleCategories = categories.filter((cat) => {
    if (selectedType === 'all') return true;
    return cat.type === selectedType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans text-neutral-200">
      {/* Menu Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181715] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Curated Gastronomy & Sommelier Reserve</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
          The Eko Culinary Menu
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
          Explore all 35 authentic offerings priced strictly in Rwandan Francs (RWF). Every plate, grilled delicacy, and vintage wine is prepared fresh upon your order.
        </p>
      </div>

      {/* Notice Toast */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#D4AF37] text-black font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-300 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-black stroke-[3]" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar Controls */}
      <div className="bg-[#141312] border border-neutral-800 p-6 rounded-2xl space-y-6 shadow-xl">
        {/* Type Toggle: All vs Food vs Drink */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#0D0C0B] p-1.5 rounded-xl border border-neutral-800">
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Offerings ({menuItems.length})
            </button>
            <button
              onClick={() => {
                setSelectedType('food');
                setSelectedCategory('all');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedType === 'food'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Cuisine</span>
            </button>
            <button
              onClick={() => {
                setSelectedType('drink');
                setSelectedCategory('all');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedType === 'drink'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Wine className="w-3.5 h-3.5" />
              <span>Beverages & Wines</span>
            </button>
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterSpecialOnly(!filterSpecialOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                filterSpecialOnly 
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#E5C158]' 
                  : 'bg-[#0D0C0B] border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Chef's Choice</span>
            </button>
            <button
              onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                filterSpicyOnly 
                  ? 'bg-rose-950/40 border-rose-600/60 text-rose-300' 
                  : 'bg-[#0D0C0B] border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Spicy Dishes</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, cocktails, wine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0D0C0B] border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800/60">
          <span className="text-[11px] font-mono uppercase text-[#D4AF37] mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#E5C158] text-black font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            All Categories
          </button>
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#E5C158] text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-[#141312] rounded-3xl border border-neutral-800 space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="font-serif text-lg text-white">No culinary items matched your criteria</h3>
          <p className="text-xs text-neutral-400">Try adjusting your search query or category filters.</p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedCategory('all');
              setSearchQuery('');
              setFilterSpecialOnly(false);
              setFilterSpicyOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-[#E5C158] hover:bg-neutral-700 mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#141312] border border-neutral-800 hover:border-[#D4AF37]/60 rounded-2xl overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)] cursor-pointer"
              onClick={() => {
                setActiveItemModal(item);
                setModalQuantity(1);
              }}
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#E5C158] font-mono text-xs font-bold shadow-lg">
                  {item.price.toLocaleString()} RWF
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-[#0D0C0B]/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-neutral-300 border border-neutral-800">
                    {item.type}
                  </span>
                  {item.is_chef_special && (
                    <span className="bg-[#D4AF37] text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 shadow-md">
                      <Sparkles className="w-2.5 h-2.5" />
                      Special
                    </span>
                  )}
                  {item.spicy_level && item.spicy_level > 0 && (
                    <span className="bg-rose-900/90 text-rose-200 border border-rose-700/60 px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 text-rose-400" />
                      {item.spicy_level > 1 ? `${item.spicy_level}x` : 'Hot'}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#E5C158] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>~{item.prep_time_minutes || 20} mins</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddItem(item, 1);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add to Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      {activeItemModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto"
          onClick={() => setActiveItemModal(null)}
        >
          <div 
            className="bg-[#141312] border border-[#D4AF37]/40 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar with Close Button */}
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setActiveItemModal(null)}
                className="p-2 rounded-full bg-black/80 text-white hover:bg-neutral-800 border border-neutral-700 hover:border-[#D4AF37] transition-colors shadow-lg"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Image Section */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-900 overflow-hidden">
                <img
                  src={activeItemModal.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'}
                  alt={activeItemModal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-md px-3.5 py-1 rounded-xl border border-[#D4AF37]/60 text-[#E5C158] font-mono text-sm sm:text-base font-bold shadow-xl">
                  {activeItemModal.price.toLocaleString()} RWF
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-[#0D0C0B]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase text-neutral-300 border border-neutral-800">
                    {activeItemModal.type}
                  </span>
                  {activeItemModal.is_chef_special && (
                    <span className="bg-[#D4AF37] text-black px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      Chef Special
                    </span>
                  )}
                </div>
              </div>

              {/* Dish Information */}
              <div className="p-5 sm:p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] px-2 py-0.5 rounded bg-[#1C1A17] border border-[#D4AF37]/30">
                      {activeItemModal.type === 'food' ? 'Culinary Creation' : 'Artisanal Beverage'}
                    </span>
                    {activeItemModal.is_chef_special && (
                      <span className="text-[10px] font-mono uppercase text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        Executive Recommendation
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">{activeItemModal.name}</h2>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-2.5">{activeItemModal.description}</p>
                </div>

                {/* Culinary Details Badges */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-[#0D0C0B] rounded-2xl border border-neutral-800/80 text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Prep: <strong className="text-white">~{activeItemModal.prep_time_minutes || 20} mins</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Spice: <strong className="text-white">{activeItemModal.spicy_level ? `${activeItemModal.spicy_level}/3` : 'Mild'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Origin: <strong className="text-white">Authentic Kigali</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <UtensilsCrossed className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Fulfillment: <strong className="text-white">Dine-in / Delivery</strong></span>
                  </div>
                </div>

                {/* Additional Culinary Notes */}
                <div className="p-3 bg-[#181715] rounded-xl border border-neutral-800/60 text-[11px] text-neutral-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Dietary & Kitchen Notes</span>
                  </div>
                  <p>Prepared fresh at Eko Restaurant Kigali (KK 554). Custom dietary preferences or allergen inquiries can also be noted during checkout.</p>
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer for Instant Order Action */}
            <div className="p-4 sm:p-5 bg-[#100F0E] border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center bg-[#0D0C0B] border border-neutral-700 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white font-bold text-base hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono font-bold text-white text-sm">{modalQuantity}</span>
                <button
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white font-bold text-base hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  handleAddItem(activeItemModal, modalQuantity);
                  setActiveItemModal(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-amber-300 hover:to-amber-400 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="truncate">Add {modalQuantity} to Order • {(activeItemModal.price * modalQuantity).toLocaleString()} RWF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
