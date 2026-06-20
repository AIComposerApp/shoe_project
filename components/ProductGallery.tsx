'use client'

import Image from 'next/image';
import { useState, useRef, UIEvent } from 'react';

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    alt: "Clean simple sneaker in seagrass color - side view"
  },
  {
    src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    alt: "Sneaker top and material detail view"
  },
  {
    src: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80",
    alt: "Sneaker pair standing clean view"
  }
];

export default function ProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const index = Math.round(target.scrollLeft / target.clientWidth);
    if (index !== activeIndex && index >= 0 && index < galleryImages.length) {
      setActiveIndex(index);
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollTo({
        left: container.clientWidth * index,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full relative">
      {/* Badge Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <span className="bg-brand-charcoal text-white text-[9px] font-bold tracking-widest px-3 py-1.5 rounded-full uppercase shadow-lg shadow-black/10">
          New Color
        </span>
      </div>

      {/* Swipeable Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full aspect-square bg-[#eae8e3] rounded-3xl overflow-x-auto snap-x snap-mandatory flex hide-scrollbar relative scroll-smooth cursor-grab active:cursor-grabbing border border-black/5"
      >
        {galleryImages.map((img, i) => (
          <div 
            key={i}
            className="w-full h-full flex-shrink-0 snap-center relative"
          >
            <Image 
              src={img.src} 
              alt={img.alt} 
              fill 
              priority={i === 0}
              className="object-cover mix-blend-multiply transition-transform duration-500 hover:scale-102 object-center select-none" 
              referrerPolicy="no-referrer" 
            />
          </div>
        ))}
      </div>

      {/* Dynamic Slide Dot Indicators */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
        {galleryImages.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToImage(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === i 
                ? 'w-5 bg-brand-charcoal' 
                : 'w-2 bg-brand-charcoal/20 hover:bg-brand-charcoal/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Swipe Assist Overlay Hint */}
      <div className="absolute right-4 bottom-5 bg-white/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-brand-charcoal/60 tracking-wider pointer-events-none select-none">
        {activeIndex + 1} / {galleryImages.length}
      </div>
    </div>
  );
}
