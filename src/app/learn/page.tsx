"use client";

import { useEffect, useState } from 'react';
import VideoCard from '@/components/videos/VideoCard';
import VideoPlayer from '@/components/videos/VideoPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ListVideo, Youtube } from 'lucide-react';
import SectionDivider from '@/components/section-divider';
import { Skeleton } from '@/components/ui/skeleton';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

async function fetchPlaylistsByChannelId(channelId: string) {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=25&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`YouTube API Error: ${errorData.error.message}`);
    }
    return response.json();
}

async function fetchVideosFromPlaylist(playlistId: string) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`YouTube API Error: ${errorData.error.message}`);
    }
    return response.json();
}

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

export default function LearnPage() {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [videos, setVideos] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
            setError("YouTube API key or Channel ID is not configured.");
            setIsLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                const playlistData = await fetchPlaylistsByChannelId(CHANNEL_ID!);
                setPlaylists(playlistData.items);

                const allVideos: any = {};
                for (const playlist of playlistData.items) {
                    const videoData = await fetchVideosFromPlaylist(playlist.id);
                    allVideos[playlist.id] = videoData.items.map((item: any) => ({
                        ...item,
                        id: item.snippet.resourceId.videoId,
                    }));
                }
                setVideos(allVideos);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "An unknown error occurred while fetching videos.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleVideoSelect = (videoId: string, playlistId: string) => {
        setSelectedVideoId(videoId);
        setSelectedPlaylistId(playlistId);
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
                    ) : error ? (
                         <Card className="text-center p-8 bg-destructive/10 border-destructive">
                           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                           <CardContent>
                               <h3 className="text-xl font-semibold text-destructive-foreground">An Error Occurred</h3>
                               <p className="text-muted-foreground mt-2">{error}</p>
                                <p className="text-xs text-muted-foreground mt-4">Please ensure the YouTube API Key is correct and has the 'YouTube Data API v3' service enabled in your Google Cloud project.</p>
                           </CardContent>
                        </Card>
                    ) : playlists.length > 0 ? (
                        <div className="space-y-12">
                            {playlists.map((playlist) => (
                                <section key={playlist.id}>
                                    <h2 className="font-headline text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                                       <ListVideo className="h-7 w-7 text-accent"/>
                                       {playlist.snippet.title}
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {(videos[playlist.id] || []).map((video: any) => (
                                            <VideoCard
                                                key={video.id}
                                                video={video}
                                                onVideoSelect={(videoId) => handleVideoSelect(videoId, playlist.id)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center p-8 bg-card">
                           <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                           <CardContent>
                               <h3 className="text-xl font-semibold text-foreground">No Playlists Found</h3>
                               <p className="text-muted-foreground mt-2">We couldn't find any public playlists on the configured YouTube channel. Please add some playlists to see them here.</p>
                           </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {selectedVideoId && selectedPlaylistId && (
                <VideoPlayer
                    videoId={selectedVideoId}
                    playlistId={selectedPlaylistId}
                    onClose={() => setSelectedVideoId(null)}
                />
            )}
        </>
    );
}
