
"use client";

import { useEffect, useState, useMemo } from 'react';
import VideoCard from '@/components/videos/VideoCard';
import VideoPlayer from '@/components/videos/VideoPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { ListVideo, Youtube, Search, X } from 'lucide-react';
import SectionDivider from '@/components/section-divider';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import type { YouTubePlaylist } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function LoadingSkeleton() {
    return (
        <div className="space-y-12">
            {[...Array(2)].map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, j) => (
                            <Card key={j}>
                                <Skeleton className="aspect-video w-full" />
                                <CardContent className="p-4">
                                    <Skeleton className="h-5 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Helper to extract YouTube video ID from various URL formats
function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default function LearnPage() {
    const firestore = useFirestore();
    const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!firestore) return;

        const fetchPlaylists = async () => {
            setIsLoading(true);
            try {
                const q = query(collection(firestore, "youtubePlaylists"));
                const querySnapshot = await getDocs(q);
                const playlistData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as YouTubePlaylist));
                setPlaylists(playlistData);
            } catch (error) {
                console.error("Error fetching playlists from Firestore:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylists();
    }, [firestore]);

    const filteredPlaylists = useMemo(() => {
        if (!searchTerm) {
            return playlists;
        }
        return playlists.filter(playlist => 
            playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [playlists, searchTerm]);

    const handleVideoSelect = (videoId: string) => {
        setSelectedVideoId(videoId);
    };

    return (
        <>
            <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
                <div className="container py-16 sm:py-24 text-center">
                    <h1 className="font-headline text-4xl font-bold sm:text-5xl">Video Learning Hub</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-200">
                        Explore our curated video playlists to master new skills at your own pace.
                    </p>
                </div>
            </div>

            <div className="bg-secondary relative">
                <SectionDivider style="wave" className="text-gradient-to-br from-purple-900 via-blue-900 to-black" position="top"/>
                <div className="container py-16 sm:py-24">
                     <div className="mb-12 max-w-lg mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search playlists like 'HTML', 'CSS Course'..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 text-base"
                        />
                         {searchTerm && (
                            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setSearchTerm('')}>
                               <X className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : filteredPlaylists.length > 0 ? (
                         <Accordion type="single" collapsible className="w-full space-y-4">
                            {filteredPlaylists.map((playlist) => (
                               <AccordionItem value={playlist.id} key={playlist.id} className="border bg-background rounded-lg shadow-sm">
                                    <AccordionTrigger className="p-4 hover:no-underline">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left">
                                            <ListVideo className="h-8 w-8 text-accent flex-shrink-0"/>
                                            <div>
                                                <h2 className="font-headline text-xl font-bold text-primary">{playlist.title}</h2>
                                                <p className="text-sm text-muted-foreground mt-1">{playlist.description}</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 border-t">
                                            {playlist.videoUrls.map((url) => {
                                                const videoId = getYouTubeId(url);
                                                if (!videoId) return null;
                                                return (
                                                    <VideoCard
                                                        key={videoId}
                                                        videoId={videoId}
                                                        onVideoSelect={handleVideoSelect}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <Card className="text-center p-8 bg-card">
                           <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                           <CardContent>
                               <h3 className="text-xl font-semibold text-foreground">
                                {playlists.length > 0 ? 'No Matching Playlists Found' : 'No Playlists Found'}
                               </h3>
                               <p className="text-muted-foreground mt-2">
                                {playlists.length > 0 ? 'Try a different search term.' : 'The admin has not added any video playlists yet. Please check back later.'}
                               </p>
                           </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {selectedVideoId && (
                <VideoPlayer
                    videoId={selectedVideoId}
                    onClose={() => setSelectedVideoId(null)}
                />
            )}
        </>
    );
}
