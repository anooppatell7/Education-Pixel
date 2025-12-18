"use client";

import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';

type VideoCardProps = {
    video: any;
    onVideoSelect: (videoId: string) => void;
};

export default function VideoCard({ video, onVideoSelect }: VideoCardProps) {
    const thumbnailUrl = video.snippet.thumbnails.medium.url;
    const title = video.snippet.title;

    return (
        <Card
            className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border-t-4 border-t-transparent hover:border-t-accent"
            onClick={() => onVideoSelect(video.id)}
        >
            <div className="relative aspect-video w-full">
                <Image
                    src={thumbnailUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="h-14 w-14 text-white/80" />
                </div>
            </div>
            <CardContent className="p-4">
                <h3 className="font-semibold text-primary text-base line-clamp-2 h-[40px]">
                    {title}
                </h3>
            </CardContent>
        </Card>
    );
}
