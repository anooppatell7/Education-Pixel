
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { PopupSettings } from '@/lib/types';

const POPUP_DISMISSED_KEY = 'salesPopupDismissed_v1';

export default function SalesPopup({ settings }: { settings: PopupSettings }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY);
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(POPUP_DISMISSED_KEY, 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-[#0a0a2a] text-white border-accent/30 shadow-2xl">
        <div 
          className="relative"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(100, 116, 225, 0.2) 0%, transparent 25%),
              radial-gradient(circle at 90% 80%, rgba(192, 132, 252, 0.2) 0%, transparent 25%),
              linear-gradient(135deg, #0a0a2a 0%, #1e1b4b 50%, #312e81 100%)
            `,
          }}
        >
          {/* Subtle geometric pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(45deg, #4f46e5 25%, transparent 25%), linear-gradient(-45deg, #4f46e5 25%, transparent 25%)',
              backgroundSize: '30px 30px',
            }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
            <Sparkles className="h-12 w-12 text-purple-300 mb-4 animate-pulse" />
            <DialogHeader>
              <DialogTitle className="text-3xl font-headline text-white drop-shadow-lg">{settings.title}</DialogTitle>
              <DialogDescription className="text-purple-200 mt-2 text-lg">
                {settings.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-8 sm:justify-center">
              <Button asChild size="lg" className="bg-purple-500 text-white hover:bg-purple-400 transition-transform hover:scale-105 ring-2 ring-offset-2 ring-offset-[#0a0a2a] ring-purple-400/80">
                <Link href={settings.ctaLink || '#'}>
                  {settings.ctaText || 'Learn More'}
                </Link>
              </Button>
            </DialogFooter>
          </div>
        </div>
         <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 z-20"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

