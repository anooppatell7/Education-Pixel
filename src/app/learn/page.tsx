"use client";

import { useEffect, useState } from 'react';
import VideoCard from '@/components/videos/VideoCard';
import VideoPlayer from '@/components/videos/VideoPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { ListVideo, Youtube } from 'lucide-react';
import SectionDivider from '@/components/section-divider';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { YouTubePlaylist } from '@/lib/types';

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

    const handleVideoSelect = (videoId: string) => {
        setSelectedVideoId(videoId);
    };

    return (
        <>
            <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-black text-white">
                <div className="container py-16 sm:py-24 text-center">
                    <h1 className="font-headline text-4xl font-bold sm:text-5xl">Video Learning Hub</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-200">
                        Explore our curated video playlists to master new skills at your own pace.
                    </p>
                </div>
            </div>

            <div className="bg-secondary relative">
                <SectionDivider style="wave" className="text-gradient-to-br from-blue-900 via-indigo-900 to-black" position="top"/>
                <div className="container py-16 sm:py-24">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : playlists.length > 0 ? (
                        <div className="space-y-12">
                            {playlists.map((playlist) => (
                                <section key={playlist.id}>
                                    <h2 className="font-headline text-2xl font-bold text-primary mb-2 flex items-center gap-3">
                                       <ListVideo className="h-7 w-7 text-accent"/>
                                       {playlist.title}
                                    </h2>
                                    <p className="text-muted-foreground mb-6 ml-10">{playlist.description}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                </section>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center p-8 bg-card">
                           <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                           <CardContent>
                               <h3 className="text-xl font-semibold text-foreground">No Playlists Found</h3>
                               <p className="text-muted-foreground mt-2">The admin has not added any video playlists yet. Please check back later.</p>
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
