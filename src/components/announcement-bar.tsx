

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Megaphone, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { getSiteSettings } from '@/lib/firebase';
import { SiteSettings } from '@/lib/types';

export default function AnnouncementBar() {
    const [announcement, setAnnouncement] = useState<SiteSettings | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            const settings = await getSiteSettings();
            if (settings) {
                const dismissed = localStorage.getItem('announcementDismissed');
                if (dismissed !== settings.text) {
                    setAnnouncement(settings);
                    setIsVisible(settings.isVisible);
                }
            }
        }
        fetchSettings();
    }, []);

    const handleDismiss = () => {
        if (announcement) {
            localStorage.setItem('announcementDismissed', announcement.text);
        }
        setIsVisible(false);
    }

    if (!isVisible || !announcement) {
        return null;
    }

    const Wrapper = announcement.link ? Link : 'div';
    
    return (
        <div className="bg-primary text-primary-foreground relative z-50">
            <div className="container mx-auto flex items-center justify-center p-2 text-sm">
                <Megaphone className="h-4 w-4 mr-2 flex-shrink-0" />
                 <Wrapper href={announcement.link || '#'} className={cn("text-center", announcement.link && "hover:underline")}>
                    {announcement.text}
                </Wrapper>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full ml-auto" onClick={handleDismiss}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                </Button>
            </div>
        </div>
    );
}

    