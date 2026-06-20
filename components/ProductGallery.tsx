'use client'

import Image from 'next/image';

export default function ProductGallery() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Main Image */}
      <div className="w-full aspect-square md:aspect-[4/3] bg-black/5 relative rounded-xl overflow-hidden flex items-center justify-center group cursor-zoom-in">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white text-gray-900 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full uppercase shadow-sm">
            New Color
          </span>
        </div>
        
        <Image 
          src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80" 
          alt="Clean simple sneaker in seagrass color" 
          fill 
          className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 object-center" 
          referrerPolicy="no-referrer" 
        />
      </div>

      {/* Bottom Grid Images */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 md:pb-0 md:grid md:grid-cols-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-[85vw] md:w-full flex-shrink-0 snap-center aspect-square bg-black/5 relative rounded-xl overflow-hidden group cursor-zoom-in">
           <Image src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" alt="Sneaker alternative view" fill className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 grayscale opacity-70" referrerPolicy="no-referrer" />
        </div>
        <div className="w-[85vw] md:w-full flex-shrink-0 snap-center aspect-square relative bg-black/5 rounded-xl overflow-hidden group cursor-zoom-in">
           <Image src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80" alt="Sneaker pair view" fill className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
        </div>
      </div>
    </div>
  )
}
