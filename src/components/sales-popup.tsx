
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Code, Cpu, Database } from 'lucide-react';
import Link from 'next/link';
import type { PopupSettings } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Logo from './logo';

const POPUP_DISMISSED_KEY = 'salesPopupDismissed_v2';

const TechIcon = ({ icon, className, style }: { icon: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
    <div className={cn("absolute rounded-full bg-white/10 backdrop-blur-sm p-2 text-purple-300 animate-float", className)} style={style}>
        {icon}
    </div>
);

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
  
  const defaultImageUrl = "https://res.cloudinary.com/dzr4xjizf/image/upload/v1757138798/mtechlogo_1_wsdhhx.png";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) handleClose();
        else setIsOpen(true);
    }}>
      <DialogContent 
        className="sm:max-w-4xl w-[95%] p-0 overflow-hidden bg-transparent text-white border-none shadow-2xl rounded-2xl"
        onInteractOutside={handleClose}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative hidden md:flex flex-col items-center justify-center p-8 rounded-l-2xl">
                <Image
                    src={settings.imageUrl || defaultImageUrl}
                    alt="Promotional image"
                    width={400}
                    height={400}
                    className="object-contain"
                />
            </div>
            
            <div className="relative p-8 sm:p-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-900/80 via-purple-950/70 to-blue-900/80 rounded-r-2xl rounded-l-2xl md:rounded-l-none">
                 {/* Floating Icons */}
                <TechIcon icon={<Code className="h-5 w-5"/>} className="top-[15%] left-[10%]" style={{animationDelay: '0.5s'}} />
                <TechIcon icon={<Cpu className="h-7 w-7"/>} className="bottom-[20%] right-[25%]" style={{animationDelay: '2s'}} />
                <TechIcon icon={<Database className="h-5 w-5"/>} className="top-[25%] right-[15%]" style={{animationDelay: '1.5s'}} />
                
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <Sparkles className="h-10 w-10 text-purple-300 animate-pulse" />
                    </div>
                    <DialogTitle className="text-4xl font-headline text-white drop-shadow-lg">{settings.title}</DialogTitle>
                    <DialogDescription className="text-purple-200 mt-2 text-lg">
                        {settings.description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-center mt-6">
                    <Button asChild size="lg" className="bg-purple-500 text-white hover:bg-purple-400 transition-transform hover:scale-105 ring-2 ring-offset-2 ring-offset-[#0a0a2a] ring-purple-400/80">
                        <Link href={settings.ctaLink || '#'}>
                            {settings.ctaText || 'Learn More'}
                        </Link>
                    </Button>
                </DialogFooter>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
