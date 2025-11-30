
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Rocket, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import type { PopupSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

const POPUP_DISMISSED_KEY = 'salesPopupDismissed_v3'; // Changed key to ensure new design shows up

export default function SalesPopup({ settings }: { settings: PopupSettings }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY);
    if (!isDismissed && settings.isVisible) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [settings.isVisible]);

  const handleClose = () => {
    sessionStorage.setItem(POPUP_DISMISSED_KEY, 'true');
    setIsOpen(false);
  };
  
  if (!settings.isVisible) {
    return null;
  }

  // Circuit line SVG component
  const CircuitLine = ({ className }: { className?: string }) => (
    <svg className={cn("absolute w-full h-auto text-blue-400/20", className)} viewBox="0 0 400 100" preserveAspectRatio="none">
        <path d="M0 50 Q 20 80, 40 50 T 80 50 T 120 50 Q 140 20, 160 50 T 200 50 Q 220 90, 240 50 T 280 50 T 320 50 Q 340 10, 360 50 T 400 50" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M0 60 Q 25 30, 50 60 T 100 60 Q 125 100, 150 60 T 200 60 Q 225 20, 250 60 T 300 60 Q 325 80, 350 60 T 400 60" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </svg>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) handleClose();
        else setIsOpen(true);
    }}>
      <DialogContent 
        className="sm:max-w-md w-[95%] p-0 overflow-hidden text-white border-2 border-blue-500/30 shadow-2xl rounded-2xl bg-[#0d1a3a]"
        onInteractOutside={handleClose}
        hideCloseButton // Hide default close button
      >
        <div className="relative isolate overflow-hidden p-8 text-center bg-gradient-to-b from-blue-900/40 to-transparent">
            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_50%_20%,rgba(67,56,202,0.3),#0d1a3a)]" />
            <CircuitLine className="top-0 left-0" />
            <CircuitLine className="bottom-0 left-0 transform scale-y-[-1]" />
            
            {/* Custom Close Button */}
            <DialogClose asChild>
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 h-8 w-8 rounded-md bg-white/10 flex items-center justify-center text-blue-300 hover:bg-white/20 transition-colors"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
            
            {/* Content */}
            <div className="flex flex-col items-center">
                 <div className="relative mb-4">
                    <BrainCircuit className="h-20 w-20 text-blue-300" />
                    <div className="absolute inset-0 -z-10 bg-blue-500/50 rounded-full blur-2xl animate-pulse"></div>
                </div>

                <h2 className="font-headline text-3xl font-bold uppercase tracking-wider">
                  <span className="block">{settings.title || 'BLACK FRIDAY SALE!'} is</span>
                  <span className="block text-4xl text-blue-300">LIVE</span>
                </h2>
                
                <p className="mt-2 text-lg text-blue-200/80">
                  {settings.description || 'GET 20% off on any Course'}
                </p>

                <div className="mt-8">
                    <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90 transition-opacity transform hover:scale-105 rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-blue-500/30">
                        <Link href={settings.ctaLink || '/courses'}>
                            {settings.ctaText || 'View Courses'}
                            <Rocket className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
