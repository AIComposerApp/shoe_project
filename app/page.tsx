'use client'

import { useState, useEffect } from 'react';
import ProductGallery from '@/components/ProductGallery';
import ProductDetails from '@/components/ProductDetails';
import CartSidebar from '@/components/CartSidebar';
import { CheckCircle2, X } from 'lucide-react';

export default function ProductPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkout') === 'success') {
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 50);
        // Clean URL cleanly without trigger page reloads
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1a1a1a] selection:bg-gray-200 relative">
       {/* Simple header bar mimicking the brand */}
       <header className="px-6 py-4 flex items-center justify-between pointer-events-none opacity-50">
          <div className="font-playfair text-2xl font-bold italic lowercase tracking-tighter">allbirds</div>
          <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase">
             <span>Men</span>
             <span>Women</span>
             <span>Sale</span>
          </div>
          <div className="w-8"></div> {/* Spacer for symmetry if needed */}
       </header>

       {/* Breadcrumbs */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-xs text-gray-500 flex gap-2">
            <a href="#" className="hover:text-gray-900 transition-colors">Home</a>
            <span>/</span>
            <a href="#" className="hover:text-gray-900 transition-colors">Mens</a>
          </div>
       </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4 lg:flex lg:gap-12 xl:gap-16 relative">
        <div className="lg:w-[60%] xl:w-[65%]">
          <ProductGallery />
        </div>
        <div className="lg:w-[40%] xl:w-[35%] mt-8 lg:mt-0 relative z-10 w-full max-w-md mx-auto lg:max-w-none">
          <ProductDetails onAddToCart={() => setIsCartOpen(true)} />
        </div>
      </main>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Beautiful High-Fidelity Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100 text-center relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
            </div>

            <h3 className="font-playfair text-2xl font-bold tracking-tight mb-2 text-gray-900">
              Payment Confirmed
            </h3>
            <p className="text-xs font-mono text-emerald-600 font-bold tracking-widest uppercase mb-4">
              Authorized via Paystack
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Thank you for your purchase! Your payment has been securely initialized. Order confirmation receipt as well as delivery tracker estimates are being compiled and dispatched to your inbox right now.
            </p>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#1a1a1a] hover:bg-black text-white font-bold py-3.5 px-6 rounded-lg uppercase tracking-wider text-xs transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
