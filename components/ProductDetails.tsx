'use client'

import { Star, StarHalf } from 'lucide-react';
import { useState } from 'react';

const colors = [
  { id: 1, color: '#4a4a4a', label: 'Charcoal' },
  { id: 2, color: '#e5e0cf', label: 'Oat' },
  { id: 3, color: '#a6a196', label: 'Grey' },
  { id: 4, color: '#97825b', label: 'Tan' },
  { id: 5, color: '#a15c4b', label: 'Rust' },
  { id: 6, color: '#889f92', label: 'Seagrass', limited: true }, 
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

export default function ProductDetails({ onAddToCart }: { onAddToCart: () => void }) {
  const [selectedColor, setSelectedColor] = useState(6);
  const [selectedSize, setSelectedSize] = useState('9');
  const [activeTab, setActiveTab] = useState<'mens'|'womens'>('mens');

  const currentColor = colors.find(c => c.id === selectedColor);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] lg:sticky lg:top-8 w-full border border-gray-100">
      {/* Header */}
      <h1 className="font-playfair text-3xl md:text-[2.5rem] tracking-tight text-gray-900 mb-2 leading-tight">Men&apos;s Dasher NZ</h1>
      <div className="flex items-center gap-2 mb-4 text-[10px] tracking-widest uppercase font-bold text-gray-500">
         <span>Also available in:</span>
         <a href="#" className="underline text-gray-900 hover:text-gray-600 transition-colors">Women&apos;s Sizes</a>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 mb-2">
         <span className="text-xl font-bold tracking-tight text-gray-900">$140</span>
         <span className="bg-gray-200/60 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-full tracking-wider">
           + FREE SHIPPING
         </span>
      </div>

      {/* Reviews */}
      <div className="flex items-center gap-1 mb-8">
        <div className="flex text-gray-800">
           <Star className="w-3.5 h-3.5 fill-current" />
           <Star className="w-3.5 h-3.5 fill-current" />
           <Star className="w-3.5 h-3.5 fill-current" />
           <Star className="w-3.5 h-3.5 fill-current" />
           <StarHalf className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="text-xs font-medium text-gray-800 ml-1">(51)</span>
      </div>

      {/* Color Selector */}
      <div className="mb-10">
        <p className="text-sm mb-3">
          <span className="font-bold text-[10px] uppercase tracking-widest text-gray-500 mr-2">Color:</span> 
          <span className="font-medium text-gray-900 text-sm tracking-tight">{currentColor?.label}</span>
          {currentColor?.limited && <span className="text-gray-500 ml-1 text-xs">(Limited Edition)</span>}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {colors.map(color => (
            <button 
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`w-[34px] h-[34px] rounded-full border-[1.5px] relative ${selectedColor === color.id ? 'border-gray-900 p-[2px]' : 'border-transparent hover:border-gray-300 p-[2px]'} transition-all`}
              aria-label={`Select color ${color.label}`}
            >
              <div 
                className="w-full h-full rounded-full ring-1 ring-black/10 shadow-inner" 
                style={{ backgroundColor: color.color }}
              />
              {color.sale && (
                 <span className="absolute -bottom-3.5 -right-2 bg-gray-600 text-white text-[8px] font-bold px-1 rounded transform scale-[0.8] tracking-wider">SALE</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-8">
        <div className="flex gap-6 border-b border-gray-200 mb-5">
           <button 
             onClick={() => setActiveTab('mens')}
             className={`pb-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase border-b-2 transition-colors ${activeTab === 'mens' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
           >
             Men&apos;s Sizes
           </button>
           <button 
             onClick={() => setActiveTab('womens')}
             className={`pb-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase border-b-2 transition-colors ${activeTab === 'womens' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
           >
             Women&apos;s Sizes
           </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mb-4">
           {sizes.map((sizeObj) => (
             <button
               key={sizeObj.size}
               disabled={!sizeObj.available}
               onClick={() => setSelectedSize(sizeObj.size)}
               className={`py-3 text-sm font-medium border rounded transition-all
                  ${!sizeObj.available ? 'border-gray-200 text-gray-300 relative overflow-hidden disabled-cross' : 
                    selectedSize === sizeObj.size ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md' : 'border-gray-300 text-gray-700 hover:border-gray-900'
                  }`}
             >
               {sizeObj.size}
               {!sizeObj.available && (
                 <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <svg className="absolute w-full h-full" preserveAspectRatio="none"><line x1="0" y1="100%" x2="100%" y2="0" stroke="#d1d5db" strokeWidth="1"></line></svg>
                 </div>
               )}
             </button>
           ))}
        </div>
        
        <p className="text-xs text-gray-600 mb-1 mt-6">The Dasher NZ fits true-to-size for most customers.</p>
        <button className="text-xs text-gray-900 font-medium underline hover:text-gray-600 transition-colors">Fit Guide</button>
      </div>

      {/* Add To Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-30 md:static md:p-0 md:bg-transparent md:border-none md:mt-8 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] md:shadow-none">
        <button 
          onClick={onAddToCart}
          className="w-full bg-[#1e1e1e] text-white py-4 sm:py-5 rounded font-bold text-sm tracking-widest uppercase hover:bg-black hover:shadow-lg transition-all min-h-[44px]"
        >
          Add To Cart - $140
        </button>
      </div>

      {/* Selling Points */}
      <div className="mt-8 text-center space-y-2 pb-24 md:pb-0">
         <p className="text-xs text-gray-600 tracking-wide">Free Shipping on Orders over $75</p>
         <p className="text-xs text-gray-600 tracking-wide">Easy Returns</p>
      </div>
    </div>
  )
}
