'use client'

import { X, Copy, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // Prevent focus trap issues and show dialog
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('0123456789');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Light dismiss: Close when clicking the backdrop area
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    if (!isInDialog) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      onClose={handleClose}
      className="native-modal"
    >
      {/* Modal Container */}
      <div className="flex flex-col w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#25D366] p-4 text-white flex justify-between items-center flex-shrink-0">
          <span className="font-extrabold text-sm flex items-center gap-2 uppercase tracking-wider">
            <Image 
              src="https://res.cloudinary.com/divndlntm/image/upload/v1781891264/wa-whatsapp-icon_1_ulifdf.png" 
              alt="WhatsApp" 
              width={20} 
              height={20} 
              className="w-5 h-5 object-contain brightness-0 invert" 
              referrerPolicy="no-referrer" 
            />
            Bank Transfer Details
          </span>
          <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-brand-charcoal/60 mb-5 font-semibold leading-relaxed">
            Please transfer <strong className="text-brand-charcoal font-black">$420.00</strong> to the business account listed below. Once transfer is completed, click the button below to submit your receipt via WhatsApp.
          </p>
          
          <div className="bg-brand-sand/40 rounded-2xl p-4 border border-black/5 mb-5 space-y-3">
            <div>
              <span className="block text-[8px] uppercase tracking-widest text-brand-charcoal/40 font-black">Bank Name</span>
              <span className="text-brand-charcoal font-bold text-xs">Access Bank Plc</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-widest text-brand-charcoal/40 font-black">Account Name</span>
              <span className="text-brand-charcoal font-bold text-xs">Shoe Store Essentials Ltd</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-widest text-brand-charcoal/40 font-black">Account Number</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-mono text-brand-charcoal font-extrabold tracking-tight">0123456789</span>
                <button 
                  onClick={handleCopy}
                  className="p-1.5 text-brand-charcoal/50 hover:text-brand-charcoal bg-white shadow-sm border border-black/5 rounded-lg transition-colors flex items-center justify-center cursor-pointer active:scale-90"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <a 
            href="https://wa.me/234123456789?text=I%20have%20made%20the%20transfer%20of%20$420%20for%20the%20Men's%20Dasher%20NZ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition-all hover:bg-[#22c35e] hover:shadow-lg shadow-green-500/10 min-h-[44px]"
          >
            <Image 
              src="https://res.cloudinary.com/divndlntm/image/upload/v1781891264/wa-whatsapp-icon_1_ulifdf.png" 
              alt="WhatsApp" 
              width={16} 
              height={16} 
              className="w-4.5 h-4.5 object-contain brightness-0 invert" 
              referrerPolicy="no-referrer" 
            />
            Confirm Transfer on WhatsApp
          </a>
        </div>
      </div>
    </dialog>
  );
}
