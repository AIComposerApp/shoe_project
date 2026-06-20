'use client'

import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('0123456789');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[70] pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden pointer-events-auto"
            >
              <div className="bg-[#25D366] p-4 text-white flex justify-between items-center">
                <span className="font-bold text-lg flex items-center gap-2">
                  <Image src="https://res.cloudinary.com/divndlntm/image/upload/v1781891264/wa-whatsapp-icon_1_ulifdf.png" alt="WhatsApp" width={24} height={24} className="w-6 h-6 object-contain brightness-0 invert" referrerPolicy="no-referrer" />
                  Pay via Bank Transfer
                </span>
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
                  To complete your purchase, please transfer <strong className="text-gray-900">$420.00</strong> to the account below and send the payment receipt on WhatsApp.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                  <div className="mb-3">
                    <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Bank Name</span>
                    <span className="text-gray-900 font-medium">Access Bank Plc</span>
                  </div>
                  <div className="mb-3">
                    <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Account Name</span>
                    <span className="text-gray-900 font-medium">Shoe Store Essentials Ltd</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Account Number</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono text-gray-900 font-bold">0123456789</span>
                      <button 
                        onClick={handleCopy}
                        className="p-2 text-gray-500 hover:text-gray-900 bg-white shadow-sm border border-gray-200 rounded-lg transition-colors flex items-center justify-center"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <a 
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-bold transition-all hover:bg-[#20bd5a] hover:shadow-lg shadow-green-500/20"
                >
                  <Image src="https://res.cloudinary.com/divndlntm/image/upload/v1781891264/wa-whatsapp-icon_1_ulifdf.png" alt="WhatsApp" width={20} height={20} className="w-5 h-5 object-contain brightness-0 invert" referrerPolicy="no-referrer" />
                  I&apos;ve made the transfer
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
