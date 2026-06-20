'use client'

import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ChevronDown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import WhatsAppModal from './WhatsAppModal';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [email, setEmail] = useState('mathewudochukwu656@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cartItems = [
    {
      id: 'mens-dasher-nz',
      name: "Men's Dasher NZ",
      price: 140,
      quantity: 3,
      size: '9',
      color: 'Seagrass (Parchment Sole)'
    }
  ];

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
          amount: 420, // Subtotal USD amount
          items: cartItems,
          callbackUrl: typeof window !== 'undefined' ? window.location.origin + '/?checkout=success' : '',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment.');
      }

      if (data.authorizationUrl) {
        // Redirect browser directly to Paystack's secure payment portal
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
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100 || info.velocity.x > 500) {
                onClose();
              }
            }}
            className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#fdfcfa] z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Progress bar at the top */}
            <div className="w-full h-1.5 bg-gray-200">
               <div className="h-full bg-black w-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white shadow-sm z-10">
               <h2 className="font-bold text-[11px] tracking-widest uppercase text-gray-900">Cart (3)</h2>
               <p className="text-xs text-gray-600 flex-1 text-center font-medium">You&apos;ve earned free shipping!</p>
               <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-700" />
               </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
               {/* Cart Item - Shoes */}
               <div className="bg-white p-4 rounded-xl flex gap-4 shadow-sm border border-gray-100 relative">
                  <div className="w-[84px] h-[84px] bg-[#e8e6df] rounded-lg overflow-hidden relative flex-shrink-0">
                     <Image src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=200&q=80" alt="Shoe" fill className="object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900 pr-4 leading-relaxed">Men&apos;s Dasher NZ</h3>
                        <span className="font-bold text-sm tracking-tight">$140</span>
                     </div>
                     <p className="text-xs text-gray-500 mt-1">Seagrass (Parchment Sole)</p>
                     <p className="text-xs text-gray-500 mt-0.5">Size: 9</p>
                     <div className="flex justify-between items-end mt-3">
                        <button className="text-xs underline text-gray-500 hover:text-gray-900 transition-colors">Remove</button>
                        <div className="flex items-center border border-gray-300 rounded-full h-8 px-1">
                           <button className="w-6 h-6 flex justify-center items-center text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors"><Minus className="w-3 h-3"/></button>
                           <span className="text-xs font-bold w-6 text-center">3</span>
                           <button className="w-6 h-6 flex justify-center items-center text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors"><Plus className="w-3 h-3"/></button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Cart Item - Returns Protection */}
               <div className="bg-[#f2f0e9] p-5 rounded-xl border border-gray-200/60 shadow-sm flex justify-between items-start">
                  <div className="pr-4">
                     <h4 className="font-bold text-sm text-gray-900 tracking-tight">Returns Protection</h4>
                     <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed">Buy returns protection to qualify for free returns. Does not apply to Final Sale items.</p>
                  </div>
                  <button className="bg-gray-900 text-white text-[10px] font-bold px-3 py-2 rounded-full whitespace-nowrap uppercase tracking-widest hover:bg-black transition-colors shadow-sm">
                     Add - $3
                  </button>
               </div>

               {/* Recommended for you */}
               <div className="pt-2">
                  <div className="flex justify-between items-center mb-4">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Recommended for you</h4>
                     <button className="p-1 rounded-full border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors"><ChevronDown className="w-3.5 h-3.5 text-gray-600"/></button>
                  </div>
                  {/* Horizontally scrollable list */}
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar -mx-5 px-5">
                     
                     {/* Recommendation item 1 */}
                     <div className="bg-white p-4 rounded-xl min-w-[260px] snap-start border border-gray-100 flex gap-4 shadow-sm relative">
                        <div className="w-[68px] h-[68px] bg-[#f9f9f9] rounded-lg relative flex-shrink-0 flex items-center justify-center">
                           <Image src="https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=150&q=80" alt="Sock" fill className="object-cover rounded-lg" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-900 tracking-tight">Anytime Ankle Sock</span>
                              <span className="text-sm font-bold tracking-tight">$16</span>
                           </div>
                           <div className="flex items-center gap-1.5 mt-2">
                              <div className="w-3.5 h-3.5 rounded-full bg-white border border-gray-300 ring-1 ring-gray-400 ring-offset-[1.5px] cursor-pointer"></div>
                              <div className="w-3.5 h-3.5 rounded-full bg-gray-900 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"></div>
                              <div className="w-3.5 h-3.5 rounded-full bg-gray-400 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"></div>
                           </div>
                           <div className="flex items-center justify-between mt-3">
                              <button className="text-[10px] font-medium border border-gray-300 rounded-full px-2.5 py-1 flex items-center gap-1 hover:bg-gray-50 transition-colors text-gray-700">
                                 Size: M <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60"/>
                              </button>
                              <button className="text-xs font-bold uppercase tracking-wide hover:text-gray-500 transition-colors">Add+</button>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>
            </div>

            {/* Footer Summary */}
            <div className="bg-[#f6f4f0] p-6 pb-8 md:pb-6 border-t border-gray-200">
               <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-900 tracking-tight font-playfair text-xl">Subtotal</span>
                  <span className="font-bold text-xl tracking-tight">$420</span>
               </div>
               <div className="flex justify-between mb-8">
                  <span className="font-bold text-gray-900 tracking-tight font-playfair text-xl">Shipping</span>
                  <div>
                     <span className="line-through text-gray-400 mr-2 text-sm">$5.00</span>
                     <span className="font-bold text-sm">FREE</span>
                  </div>
               </div>

               {/* Email inputs for secure transactions */}
               <div className="mb-4 bg-white/70 p-3.5 border border-gray-200 rounded-lg">
                  <label htmlFor="customer-email" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5 font-sans">
                     Email Address for Confirmation
                  </label>
                  <input
                     id="customer-email"
                     type="email"
                     value={email}
                     onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage('');
                     }}
                     disabled={isLoading}
                     placeholder="e.g. mathew@example.com"
                     className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black font-medium text-gray-800 disabled:opacity-60"
                  />
               </div>

               {errorMessage && (
                  <p className="text-xs text-red-600 font-bold mb-3 px-1">{errorMessage}</p>
               )}

               <button 
                  onClick={() => handleCheckout()}
                  disabled={isLoading}
                  className="w-full bg-[#1a1a1a] text-white py-4 rounded font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors mb-4 shadow-lg shadow-black/10 min-h-[44px] flex justify-center items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
               >
                  {isLoading ? (
                     <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Initializing Payment...</span>
                     </>
                  ) : (
                     <span>Proceed to Checkout</span>
                  )}
               </button>

               {/* Alternative Checkouts */}
               <div className="flex gap-2">
                  <button 
                     onClick={() => handleCheckout()}
                     disabled={isLoading}
                     className="flex-1 bg-[#ffc439] py-2.5 rounded-full flex justify-center items-center hover:brightness-95 transition-all min-h-[44px] shadow-sm border border-[#ffc439] disabled:opacity-60"
                  >
                     {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-amber-950" />
                     ) : (
                        <Image src="https://res.cloudinary.com/divndlntm/image/upload/v1779642159/Paystack-Logo-1_nsbxnv.png" alt="Paystack" width={140} height={32} className="h-9 w-auto object-contain" referrerPolicy="no-referrer" />
                     )}
                  </button>
                  <button 
                     onClick={() => setIsWhatsAppModalOpen(true)}
                     className="flex-1 bg-white py-2.5 rounded-full flex justify-center items-center gap-1.5 hover:bg-gray-50 transition-all min-h-[44px] shadow-sm border border-gray-200"
                  >
                     <Image src="https://res.cloudinary.com/divndlntm/image/upload/v1781891264/wa-whatsapp-icon_1_ulifdf.png" alt="WhatsApp" width={24} height={24} className="h-5 w-auto object-contain" referrerPolicy="no-referrer" />
                     <span className="font-bold text-sm text-gray-800">WhatsApp</span>
                  </button>
                  <button className="flex-1 bg-[#5a31f4] py-2.5 rounded-full flex justify-center items-center hover:brightness-110 transition-all min-h-[44px] shadow-sm border border-[#5a31f4]">
                     <Image src="https://res.cloudinary.com/divndlntm/image/upload/v1781891264/Shop_Pay_logo.svg_un1qqg.png" alt="Shop Pay" width={80} height={20} className="h-6 w-auto object-contain brightness-0 invert" referrerPolicy="no-referrer" />
                  </button>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    <WhatsAppModal isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)} />
    </>
  );
}
