
"use client";

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Loader2 } from 'lucide-react';
import SectionDivider from '@/components/section-divider';
import VideoPlayer from '@/components/videos/VideoPlayer';
import VideoCard from '@/components/videos/VideoCard';
import playlists from '@/lib/data/playlistData.json';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

// Since we are using Mode A (No API), we'll construct the URLs manually.
// This is a simplified fetch function for demonstration without an API key.
const fetchPlaylistItems = async (playlistId: string) => {
    // This is a placeholder. For Mode A, we can't dynamically fetch video lists without an API.
    // We are assuming a structure for demonstration. The real power comes with Mode B.
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return { items: [] };

    // Simulate fetching video details (in reality, this data is in playlistData.json)
    const items = playlist.videos.map(video => ({
        id: video.videoId,
        snippet: {
            title: video.title,
            thumbnails: {
                medium: {
                    url: `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`
                }
            }
        }
    }));
    
    return { items };
};

function VideoLibrarySkeleton() {
    return (
        <div className="space-y-12">
            <div className="flex items-center justify-center flex-wrap gap-4 mb-12">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 w-32 bg-muted rounded-md animate-pulse" />
                ))}
            </div>
            <div>
                 <div className="h-8 w-1/4 bg-muted rounded-md mb-6 animate-pulse" />
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="aspect-video w-full bg-muted rounded-t-lg" />
                            <CardContent className="p-4 space-y-2">
                                <div className="h-5 w-3/4 bg-muted rounded-md" />
                                <div className="h-4 w-1/2 bg-muted rounded-md" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function LearnPage() {
    const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]?.id || '');
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    useEffect(() => {
        const loadVideos = async () => {
            if (!selectedPlaylist) return;
            setLoading(true);
            try {
                // In a real API-based scenario, this would be an actual API call
                const data = await fetchPlaylistItems(selectedPlaylist);
                setVideos(data.items);
            } catch (error) {
                console.error("Failed to fetch videos", error);
            } finally {
                setLoading(false);
            }
        };
        loadVideos();
    }, [selectedPlaylist]);

    const handleVideoSelect = (videoId: string) => {
        setSelectedVideo(videoId);
    };

    const currentPlaylistTitle = playlists.find(p => p.id === selectedPlaylist)?.title || "Videos";

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
                    <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-4 mb-12">
                        {playlists.map(playlist => (
                            <Button
                                key={playlist.id}
                                variant={selectedPlaylist === playlist.id ? 'default' : 'outline'}
                                onClick={() => setSelectedPlaylist(playlist.id)}
                                className="transition-all"
                            >
                                {playlist.title}
                            </Button>
                        ))}
                    </div>

                    {loading ? (
                        <VideoLibrarySkeleton />
                    ) : (
                        <div>
                             <h2 className="font-headline text-3xl font-bold text-primary mb-6">{currentPlaylistTitle}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {videos.map(video => (
                                    <VideoCard key={video.id} video={video} onVideoSelect={handleVideoSelect} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedVideo && (
                <Suspense fallback={<div>Loading player...</div>}>
                    <VideoPlayer
                        videoId={selectedVideo}
                        playlistId={selectedPlaylist}
                        onClose={() => setSelectedVideo(null)}
                    />
                </Suspense>
            )}
        </>
    );
}
