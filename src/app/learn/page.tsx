
"use client";

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Loader2, AlertTriangle, ListVideo } from 'lucide-react';
import SectionDivider from '@/components/section-divider';
import VideoPlayer from '@/components/videos/VideoPlayer';
import VideoCard from '@/components/videos/VideoCard';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

async function fetchPlaylistsByChannelId(channelId: string) {
    if (!YOUTUBE_API_KEY) {
        throw new Error("YouTube API key is missing. Please set NEXT_PUBLIC_YOUTUBE_API_KEY in your .env file.");
    }
    if (!channelId) {
        throw new Error("YouTube Channel ID is missing. Please set NEXT_PUBLIC_YOUTUBE_CHANNEL_ID in your .env file.");
    }

    // Get Playlists for the Channel ID
    const playlistsUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=25&key=${YOUTUBE_API_KEY}`;
    const playlistsResponse = await fetch(playlistsUrl);
    const playlistsData = await playlistsResponse.json();
    
    if (playlistsData.error) {
        throw new Error(`YouTube API Error: ${playlistsData.error.message}`);
    }

    return playlistsData.items || [];
}

async function fetchVideosFromPlaylist(playlistId: string) {
     if (!YOUTUBE_API_KEY) {
        throw new Error("YouTube API key is missing.");
    }
    const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    return videosData.items || [];
}


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
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const [videos, setVideos] = useState<any[]>([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);
    const [loadingVideos, setLoadingVideos] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPlaylists = async () => {
            setLoadingPlaylists(true);
            setError(null);
            if (!CHANNEL_ID) {
                 setError("YouTube Channel ID is not configured.");
                 setLoadingPlaylists(false);
                 return;
            }
            try {
                const data = await fetchPlaylistsByChannelId(CHANNEL_ID);
                setPlaylists(data);
                if (data.length > 0) {
                    setSelectedPlaylist(data[0].id);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Could not fetch playlists. Check API key and channel ID.");
            } finally {
                setLoadingPlaylists(false);
            }
        };
        loadPlaylists();
    }, []);

    useEffect(() => {
        const loadVideos = async () => {
            if (!selectedPlaylist) return;
            setLoadingVideos(true);
            try {
                const data = await fetchVideosFromPlaylist(selectedPlaylist);
                // The API returns video data nested under `snippet.resourceId.videoId`
                const videoItems = data.map((item: any) => ({
                    id: item.snippet.resourceId.videoId,
                    snippet: item.snippet
                }));
                setVideos(videoItems);
            } catch (error) {
                console.error("Failed to fetch videos", error);
                setError("Could not load videos for this playlist.");
            } finally {
                setLoadingVideos(false);
            }
        };
        loadVideos();
    }, [selectedPlaylist]);

    const handleVideoSelect = (videoId: string) => {
        setSelectedVideo(videoId);
    };

    const currentPlaylistTitle = playlists.find(p => p.id === selectedPlaylist)?.snippet.title || "Videos";

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
                   {loadingPlaylists ? (
                        <VideoLibrarySkeleton />
                   ) : error ? (
                        <Card className="text-center p-8 bg-destructive/10 border-destructive">
                           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                           <CardContent>
                               <h3 className="text-xl font-semibold text-destructive-foreground">An Error Occurred</h3>
                               <p className="text-muted-foreground mt-2">{error}</p>
                           </CardContent>
                        </Card>
                   ) : playlists.length > 0 ? (
                    <>
                        <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-4 mb-12">
                            {playlists.map(playlist => (
                                <Button
                                    key={playlist.id}
                                    variant={selectedPlaylist === playlist.id ? 'default' : 'outline'}
                                    onClick={() => setSelectedPlaylist(playlist.id)}
                                    className="transition-all"
                                >
                                    {playlist.snippet.title}
                                </Button>
                            ))}
                        </div>

                        <div>
                            <h2 className="font-headline text-3xl font-bold text-primary mb-6">{currentPlaylistTitle}</h2>
                            {loadingVideos ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                     {[...Array(4)].map((_, i) => (
                                        <Card key={i} className="animate-pulse">
                                            <div className="aspect-video w-full bg-muted rounded-t-lg" />
                                            <CardContent className="p-4 space-y-2">
                                                <div className="h-5 w-3/4 bg-muted rounded-md" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : videos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {videos.map(video => (
                                        <VideoCard key={video.id} video={video} onVideoSelect={handleVideoSelect} />
                                    ))}
                                </div>
                            ) : (
                                <Card><CardContent className="p-8 text-center text-muted-foreground">This playlist has no videos yet.</CardContent></Card>
                            )}
                        </div>
                    </>
                   ) : (
                        <Card className="text-center p-8">
                            <ListVideo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                           <CardContent>
                               <h3 className="text-xl font-semibold">No Playlists Found</h3>
                               <p className="text-muted-foreground mt-2">This channel doesn't have any public playlists yet.</p>
                           </CardContent>
                        </Card>
                   )}
                </div>
            </div>

            {selectedVideo && selectedPlaylist && (
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
