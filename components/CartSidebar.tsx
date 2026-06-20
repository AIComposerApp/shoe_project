'use client'

import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ChevronDown, Loader2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import WhatsAppModal from './WhatsAppModal';
import { CartItem } from '@/app/page';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartSidebar({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem 
}: CartSidebarProps) {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [email, setEmail] = useState('mathewudochukwu656@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async (alternativeType?: 'paystack' | 'whatsapp') => {
    if (alternativeType === 'whatsapp') {
      setIsWhatsAppModalOpen(true);
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: subtotal,
          items: cartItems,
          callbackUrl: typeof window !== 'undefined' ? window.location.origin + '/?checkout=success' : '',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment.');
      }

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error('Transaction authorization URL was not received.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'An error occurred during checkout processing.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-[2px]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#fdfcfa] z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Top Indicator bar */}
            <div className="w-full h-1 bg-black/10">
               <div className="h-full bg-brand-charcoal w-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-black/5 bg-white shadow-sm flex-shrink-0">
               <div className="flex items-center gap-2">
                 <h2 className="font-extrabold text-[11px] tracking-widest uppercase text-brand-charcoal">Cart</h2>
                 <span className="bg-brand-charcoal text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                   {totalQuantity}
                 </span>
               </div>
               {subtotal >= 75 ? (
                 <p className="text-[10px] text-emerald-600 font-extrabold tracking-wide">✓ Free Shipping Earned!</p>
               ) : (
                 <p className="text-[10px] text-brand-charcoal/50 font-bold">Add ${75 - subtotal} more for Free Shipping</p>
               )}
               <button onClick={onClose} className="p-1.5 hover:bg-black/5 rounded-full transition-colors">
                  <X className="w-4 h-4 text-brand-charcoal" />
               </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
               {cartItems.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center py-12">
                   <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                     <ShoppingBag className="w-6 h-6 text-brand-charcoal/40" />
                   </div>
                   <h3 className="font-playfair text-lg font-bold text-brand-charcoal mb-1">Your bag is empty</h3>
                   <p className="text-xs text-brand-charcoal/50 max-w-[200px] mb-6">Looks like you haven&apos;t added any items yet.</p>
                   <button 
                     onClick={onClose}
                     className="bg-brand-charcoal text-white text-[10px] font-bold tracking-widest uppercase px-6 py-3 rounded-xl hover:bg-black transition-colors"
                   >
                     Start Shopping
                   </button>
                 </div>
               ) : (
                 cartItems.map((item) => (
                   <div key={item.id} className="bg-white p-4 rounded-2xl flex gap-4 border border-black/5 shadow-sm">
                     <div className="w-[72px] h-[72px] bg-[#e8e6df] rounded-xl overflow-hidden relative flex-shrink-0 border border-black/5">
                        <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                     </div>
                     <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                           <div>
                             <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-brand-charcoal">{item.name}</h3>
                             <p className="text-[10px] text-brand-charcoal/40 font-bold mt-0.5">{item.color}</p>
                             <p className="text-[10px] text-brand-charcoal/40 font-bold">Size: {item.size}</p>
                           </div>
                           <span className="font-extrabold text-sm tracking-tight">${item.price}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                           <button 
                             onClick={() => onRemoveItem(item.id)}
                             className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/40 hover:text-red-500 transition-colors"
                           >
                             Remove
                           </button>
                           <div className="flex items-center border border-black/10 rounded-full h-8 px-1">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex justify-center items-center text-brand-charcoal/50 hover:text-black rounded-full hover:bg-black/5 transition-colors"
                              >
                                <Minus className="w-2.5 h-2.5"/>
                              </button>
                              <span className="text-xs font-extrabold w-6 text-center select-none">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex justify-center items-center text-brand-charcoal/50 hover:text-black rounded-full hover:bg-black/5 transition-colors"
                              >
                                <Plus className="w-2.5 h-2.5"/>
                              </button>
                           </div>
                        </div>
                     </div>
                   </div>
                 ))
               )}

               {cartItems.length > 0 && (
                 <>
                   {/* Returns Protection Block */}
                   <div className="bg-brand-sand-dark/30 p-4 rounded-2xl border border-black/5 flex justify-between items-center">
                      <div>
                         <h4 className="font-bold text-xs text-brand-charcoal">Add Returns Protection</h4>
                         <p className="text-[10px] text-brand-charcoal/50 mt-1 leading-relaxed">Qualify for free returns on all items.</p>
                      </div>
                      <button className="bg-brand-charcoal text-white text-[9px] font-bold px-3 py-2 rounded-lg uppercase tracking-wider hover:bg-black transition-colors">
                         Add +$3
                      </button>
                   </div>

                   {/* Recommended Horizontal Scroll */}
                   <div className="pt-2">
                      <div className="flex justify-between items-center mb-3">
                         <h4 className="text-[9px] font-black uppercase tracking-widest text-brand-charcoal/40">Complementary Accessories</h4>
                      </div>
                      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 hide-scrollbar -mx-5 px-5">
                         <div className="bg-white p-3 rounded-2xl min-w-[240px] snap-start border border-black/5 flex gap-3 shadow-sm">
                            <div className="w-[60px] h-[60px] bg-brand-sand/50 rounded-xl relative flex-shrink-0 flex items-center justify-center">
                               <Image src="https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=150&q=80" alt="Sock" fill className="object-cover rounded-xl" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                               <div className="flex justify-between">
                                  <span className="text-[11px] font-bold text-brand-charcoal">Anytime Ankle Sock</span>
                                  <span className="text-[11px] font-extrabold text-brand-charcoal">$16</span>
                                </div>
                               <div className="flex items-center justify-between mt-2">
                                  <span className="text-[9px] text-brand-charcoal/50 font-bold">Size: M</span>
                                  <button className="text-[9px] font-black uppercase tracking-wider hover:text-brand-charcoal/60 transition-colors">Add+</button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                 </>
               )}
            </div>

            {/* Footer checkout details */}
            {cartItems.length > 0 && (
              <div className="bg-white p-5 border-t border-black/5 flex-shrink-0">
                 <div className="space-y-1.5 mb-4">
                   <div className="flex justify-between text-xs text-brand-charcoal/60 font-bold">
                      <span>Subtotal</span>
                      <span>${subtotal}.00</span>
                   </div>
                   <div className="flex justify-between text-xs text-brand-charcoal/60 font-bold">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-extrabold">FREE</span>
                   </div>
                   <div className="flex justify-between text-sm text-brand-charcoal font-extrabold pt-1 border-t border-black/5">
                      <span>Total (USD)</span>
                      <span>${subtotal}.00</span>
                   </div>
                 </div>

                 {/* Secure Email Input */}
                 <div className="mb-4 bg-brand-sand/35 p-3 border border-black/5 rounded-xl">
                    <label htmlFor="customer-email" className="block text-[9px] font-black uppercase tracking-widest text-brand-charcoal/50 mb-1">
                       Receipt Email Address
                    </label>
                    <input
                       id="customer-email"
                       type="email"
                       required
                       value={email}
                       onChange={(e) => {
                          setEmail(e.target.value);
                          setErrorMessage('');
                       }}
                       disabled={isLoading}
                       placeholder="your.email@example.com"
                       className="w-full px-3 py-1.5 text-xs bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold text-brand-charcoal disabled:opacity-60"
                    />
                 </div>

                 {errorMessage && (
                    <p className="text-[10px] text-red-500 font-bold mb-3 px-1">{errorMessage}</p>
                 )}

                 {/* Checkout Action Button */}
                 <button 
                    onClick={() => handleCheckout()}
                    disabled={isLoading}
                    className="w-full bg-brand-charcoal text-white py-3.5 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-black transition-colors mb-3 shadow-lg shadow-black/10 min-h-[46px] flex justify-center items-center gap-2 disabled:bg-black/25 disabled:cursor-not-allowed"
                 >
                    {isLoading ? (
                       <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Initializing Payment...</span>
                       </>
                    ) : (
                       <span>Secure Checkout</span>
                    )}
                 </button>

                 {/* Alternative Native Payment Sheets */}
                 <div className="flex gap-2">
                    <button 
                       onClick={() => handleCheckout()}
                       disabled={isLoading}
                       className="flex-1 bg-[#ffc439] py-2.5 rounded-xl flex justify-center items-center hover:brightness-95 transition-all min-h-[44px] shadow-sm border border-[#ffc439] disabled:opacity-60 cursor-pointer"
                    >
                       {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin text-amber-950" />
                       ) : (
                          <Image src="https://res.cloudinary.com/divndlntm/image/upload/v1779642159/Paystack-Logo-1_nsbxnv.png" alt="Paystack" width={110} height={24} className="h-6 w-auto object-contain" referrerPolicy="no-referrer" />
                       )}
                    </button>
                    <button 
                       onClick={() => handleCheckout('whatsapp')}
                       className="flex-1 bg-[#25D366] py-2.5 rounded-xl flex justify-center items-center gap-1 hover:bg-[#22c35e] transition-all min-h-[44px] shadow-sm border border-[#25D366] cursor-pointer"
                    >
                       <Image src="https://res.cloudinary.com/divndlntm/image/upload/v1781891264/wa-whatsapp-icon_1_ulifdf.png" alt="WhatsApp" width={20} height={20} className="h-5 w-auto object-contain brightness-0 invert" referrerPolicy="no-referrer" />
                       <span className="font-extrabold text-xs text-white uppercase tracking-wider">Transfer</span>
                    </button>
                 </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    <WhatsAppModal isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)} />
    </>
  );
}
