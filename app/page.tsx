'use client'

import { useState, useEffect } from 'react';
import ProductGallery from '@/components/ProductGallery';
import ProductDetails from '@/components/ProductDetails';
import CartSidebar from '@/components/CartSidebar';
import { CheckCircle2, X, ChevronLeft, Search, ShoppingBag } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export default function ProductPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedColorLabel, setSelectedColorLabel] = useState('Seagrass (Parchment Sole)');
  const [selectedSize, setSelectedSize] = useState('9');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkout') === 'success') {
        // Clear cart on success
        setCartItems([]);
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 50);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  const handleAddToCart = () => {
    setCartItems(prev => {
      const existing = prev.find(item => item.size === selectedSize && item.color === selectedColorLabel);
      if (existing) {
        return prev.map(item => 
          item.size === selectedSize && item.color === selectedColorLabel
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          id: `dasher-nz-${selectedColorLabel}-${selectedSize}`,
          name: "Men's Dasher NZ",
          price: 140,
          quantity: 1,
          size: selectedSize,
          color: selectedColorLabel,
          image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=200&q=80"
        }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-brand-charcoal selection:bg-brand-sand-dark relative">
      {/* Premium Responsive Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="font-playfair text-2xl font-black italic tracking-tighter text-brand-charcoal select-none">
          allbirds
        </div>
        <nav className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-brand-charcoal/70">
          <a href="#" className="hover:text-brand-charcoal transition-colors">Men</a>
          <a href="#" className="hover:text-brand-charcoal transition-colors">Women</a>
          <a href="#" className="hover:text-brand-charcoal transition-colors">Sale</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-1.5 hover:bg-black/5 rounded-full transition-colors" aria-label="Search">
            <Search className="w-5 h-5 text-brand-charcoal" />
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-1.5 hover:bg-black/5 rounded-full transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 text-brand-charcoal" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-in scale-in duration-200">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="pb-4">
          <div className="text-[10px] font-black tracking-widest uppercase text-brand-charcoal/40 flex gap-2">
            <a href="#" className="hover:text-brand-charcoal transition-colors">Home</a>
            <span>/</span>
            <a href="#" className="hover:text-brand-charcoal transition-colors">Mens</a>
            <span>/</span>
            <span className="text-brand-charcoal/80">Dasher NZ</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Gallery - Column span 7 */}
          <div className="md:col-span-7">
            <ProductGallery />
          </div>

          {/* Details - Column span 5, Sticky Top */}
          <div className="md:col-span-5 md:sticky md:top-24 pb-20 md:pb-6">
            <ProductDetails 
              onAddToCart={handleAddToCart}
              selectedColorLabel={selectedColorLabel}
              setSelectedColorLabel={setSelectedColorLabel}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>
        </div>
      </main>

      {/* Drawer & Modal Components */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Payment Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-gray-100 text-center relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
            </div>

            <h3 className="font-playfair text-xl font-bold tracking-tight mb-1 text-gray-900">
              Payment Confirmed
            </h3>
            <p className="text-[9px] font-mono text-emerald-600 font-bold tracking-widest uppercase mb-4">
              Authorized via Paystack
            </p>

            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Thank you for your purchase! Your payment has been securely initialized. Order confirmation receipt as well as delivery tracker estimates are being compiled and dispatched to your inbox right now.
            </p>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#1e1e1e] hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl uppercase tracking-wider text-[10px] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
