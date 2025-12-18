"use client";

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

type VideoPlayerProps = {
    videoId: string;
    playlistId: string;
    onClose: () => void;
};

export default function VideoPlayer({ videoId, playlistId, onClose }: VideoPlayerProps) {
    // Construct the URL to autoplay the video within the context of its playlist
    const src = `https://www.youtube.com/embed/${videoId}?playlist=${playlistId}&autoplay=1&rel=0`;

    return (
        <Dialog open={!!videoId} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl w-[95%] p-0 bg-black border-accent shadow-2xl shadow-accent/20">
                <div className="aspect-video relative">
                    <iframe
                        src={src}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
                <Button variant="ghost" size="icon" className="absolute -top-12 right-2 text-white hover:text-accent" onClick={onClose}>
                   <X className="h-8 w-8" />
                </Button>
            </DialogContent>
        </Dialog>
    );
}
