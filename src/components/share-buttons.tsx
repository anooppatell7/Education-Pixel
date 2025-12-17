
"use client";

import { useState, useEffect } from 'react';
import { Twitter, Facebook, Linkedin, Copy, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';

type ShareButtonsProps = {
  title: string;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codesphere.academy';

export default function ShareButtons({ title }: ShareButtonsProps) {
  const { toast } = useToast();
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // This runs only on the client, ensuring window is available
    setCurrentUrl(window.location.href);
  }, [pathname]);

  if (!currentUrl) {
    return null; // Don't render on the server or until the URL is available
  }

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: 'Link Copied!',
        description: 'The article URL has been copied to your clipboard.',
      });
    }).catch(err => {
        console.error("Failed to copy: ", err);
        toast({
            title: 'Error',
            description: 'Could not copy the link.',
            variant: 'destructive',
        });
    });
  };

  return (
    <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3 text-primary">Share this Article</h3>
        <div className="flex flex-wrap gap-2">
             <Button variant="outline" size="sm" asChild>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 h-4 w-4" /> WhatsApp
                </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="mr-2 h-4 w-4" /> Facebook
                </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
                 <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                </a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" /> Copy Link
            </Button>
        </div>
    </div>
  );
}
