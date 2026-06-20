'use client'

import { Star, StarHalf, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

const colors = [
  { id: 1, color: '#4a4a4a', label: 'Charcoal' },
  { id: 2, color: '#e5e0cf', label: 'Oat' },
  { id: 3, color: '#a6a196', label: 'Grey' },
  { id: 4, color: '#97825b', label: 'Tan' },
  { id: 5, color: '#a15c4b', label: 'Rust' },
  { id: 6, color: '#889f92', label: 'Seagrass (Parchment Sole)', limited: true }, 
  { id: 7, color: '#1a2a3a', label: 'Navy' },
  { id: 8, color: '#eef0f2', label: 'White' },
  { id: 9, color: '#d0d4d8', label: 'Light Grey' },
  { id: 10, color: '#2c2c2c', label: 'Black' },
  { id: 11, color: '#b98751', label: 'Brown', sale: true },
  { id: 12, color: '#7b8c7c', label: 'Olive', sale: true },
];

const sizes = [
  { size: '8', available: true },
  { size: '8.5', available: true },
  { size: '9', available: true },
  { size: '9.5', available: true },
  { size: '10', available: true },
  { size: '10.5', available: true },
  { size: '11', available: true },
  { size: '11.5', available: true },
  { size: '12', available: true },
  { size: '12.5', available: true },
  { size: '13', available: true },
  { size: '13.5', available: false },
  { size: '14', available: true },
  { size: '15', available: false },
];

interface ProductDetailsProps {
  onAddToCart: () => void;
  selectedColorLabel: string;
  setSelectedColorLabel: (label: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

export default function ProductDetails({ 
  onAddToCart, 
  selectedColorLabel, 
  setSelectedColorLabel, 
  selectedSize, 
  setSelectedSize 
}: ProductDetailsProps) {
  const [activeTab, setActiveTab] = useState<'mens'|'womens'>('mens');

  const currentColor = colors.find(c => c.label === selectedColorLabel) || colors[5];

  return (
    <div className="w-full flex flex-col">
      {/* Brand & Title */}
      <div className="mb-4">
        <span className="text-[10px] tracking-widest uppercase font-black text-brand-charcoal/40">Premium Runner</span>
        <h1 className="font-playfair text-3xl font-bold tracking-tight text-brand-charcoal mt-1 leading-tight">
          Men&apos;s Dasher NZ
        </h1>
      </div>

      {/* Reviews & Price Row */}
      <div className="flex justify-between items-center mb-8 border-b border-black/5 pb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-brand-charcoal">
            <span className="text-xl font-bold tracking-tight">$140</span>
            <span className="text-xs text-brand-charcoal/60 font-semibold ml-2">USD</span>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 tracking-wider mt-0.5">
            ✓ FREE EXPRESS SHIPPING
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex text-amber-500 items-center">
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <StarHalf className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold text-brand-charcoal ml-1">4.8</span>
          </div>
          <span className="text-[9px] font-bold text-brand-charcoal/40 uppercase tracking-widest mt-1">51 Customer Reviews</span>
        </div>
      </div>

      {/* Color Selector */}
      <div className="mb-8">
        <div className="flex justify-between items-baseline mb-3">
          <span className="font-bold text-[10px] uppercase tracking-widest text-brand-charcoal/50">
            Select Color:
          </span>
          <span className="font-bold text-xs text-brand-charcoal tracking-tight">
            {currentColor.label}
          </span>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {colors.map(color => {
            const isSelected = color.label === selectedColorLabel;
            return (
              <button 
                key={color.id}
                onClick={() => setSelectedColorLabel(color.label)}
                className={`aspect-square rounded-full border-2 flex items-center justify-center relative cursor-pointer active:scale-95 transition-all ${
                  isSelected 
                    ? 'border-brand-charcoal p-[2px]' 
                    : 'border-transparent hover:scale-105 p-[2px]'
                }`}
                aria-label={`Select color ${color.label}`}
              >
                <div 
                  className="w-full h-full rounded-full ring-1 ring-black/5 shadow-inner flex items-center justify-center" 
                  style={{ backgroundColor: color.color }}
                >
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${color.color === '#eef0f2' ? 'text-black' : 'text-white'} stroke-[3]`} />
                  )}
                </div>
                {color.sale && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[7px] font-black px-1 py-0.5 rounded transform scale-[0.95] tracking-widest uppercase">
                    Sale
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-8">
        <div className="flex gap-4 border-b border-black/5 mb-4">
          <button 
            onClick={() => setActiveTab('mens')}
            className={`pb-2 text-[10px] font-black tracking-widest uppercase border-b-2 transition-colors ${
              activeTab === 'mens' 
                ? 'border-brand-charcoal text-brand-charcoal' 
                : 'border-transparent text-brand-charcoal/40 hover:text-brand-charcoal'
            }`}
          >
            Men&apos;s Sizes
          </button>
          <button 
            onClick={() => setActiveTab('womens')}
            className={`pb-2 text-[10px] font-black tracking-widest uppercase border-b-2 transition-colors ${
              activeTab === 'womens' 
                ? 'border-brand-charcoal text-brand-charcoal' 
                : 'border-transparent text-brand-charcoal/40 hover:text-brand-charcoal'
            }`}
          >
            Women&apos;s Sizes
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {sizes.map((sizeObj) => {
            const isSelected = selectedSize === sizeObj.size;
            return (
              <button
                key={sizeObj.size}
                disabled={!sizeObj.available}
                onClick={() => setSelectedSize(sizeObj.size)}
                className={`py-3 text-xs font-bold border rounded-xl transition-all relative active:scale-95
                  ${!sizeObj.available 
                    ? 'border-black/5 text-brand-charcoal/20 bg-black/[0.01]' 
                    : isSelected 
                      ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-lg shadow-black/10' 
                      : 'border-black/10 text-brand-charcoal hover:border-brand-charcoal bg-white'
                  }`}
              >
                {sizeObj.size}
                {!sizeObj.available && (
                  <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <svg className="absolute w-full h-full" preserveAspectRatio="none">
                      <line x1="0" y1="100%" x2="100%" y2="0" stroke="currentColor" strokeWidth="1.5"></line>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <p className="text-[11px] text-brand-charcoal/50 mt-4 leading-relaxed">
          Fits true-to-size. Half size? We recommend ordering the next size up.
        </p>
      </div>

      {/* Accordion Tabs - Native CSS Details */}
      <div className="border-t border-black/5 mt-4 mb-8">
        <details className="modern-details">
          <summary>
            <span>Fit & Comfort Guide</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </summary>
          <div className="details-content">
            <p>Designed with natural flex contours. Highly breathable merino wool lining conforms to your foot shape within 2-3 wears for a custom slippers-like fit.</p>
          </div>
        </details>

        <details className="modern-details">
          <summary>
            <span>Materials & Footprint</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </summary>
          <div className="details-content">
            <p>Our bio-based sugarcane EVA foam midsole delivers premium energy return with a negative carbon footprint. Uppers crafted from responsibly sourced FSC-certified Eucalyptus tree fiber.</p>
          </div>
        </details>

        <details className="modern-details">
          <summary>
            <span>Shipping & Easy Returns</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </summary>
          <div className="details-content">
            <p>Enjoy free express shipping on this order. We offer a 30-day no-questions-asked trial period: if you don&apos;t love them, send them back for a full refund even after wearing them outside.</p>
          </div>
        </details>
      </div>

      {/* Inline Add to Bag for Desktop/Tablet */}
      <div className="hidden md:block mt-6">
        <button 
          onClick={onAddToCart}
          className="w-full bg-brand-charcoal text-white py-4 rounded-xl font-extrabold text-xs tracking-widest uppercase hover:bg-black active:scale-98 transition-all shadow-lg shadow-black/5 min-h-[48px]"
        >
          Add To Bag — $140.00
        </button>
      </div>

      {/* Sticky Bottom Add To Cart Sheet - Mobile Only */}
      <div className="sticky-action-sheet md:hidden">
        <div className="flex gap-4 items-center max-w-sm mx-auto">
          <div className="flex flex-col text-left flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40">Total Price</span>
            <span className="text-base font-extrabold text-brand-charcoal tracking-tight">$140.00</span>
          </div>
          <button 
            onClick={onAddToCart}
            className="flex-1 bg-brand-charcoal text-white py-3.5 rounded-xl font-extrabold text-xs tracking-widest uppercase hover:bg-black active:scale-98 transition-all shadow-lg shadow-black/10 min-h-[46px]"
          >
            Add To Bag
          </button>
        </div>
      </div>
    </div>
  );
}
