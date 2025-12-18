
"use client";

import { AlertTriangle, ListVideo } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SectionDivider from '@/components/section-divider';


export default function LearnPage() {
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
                   <Card className="text-center p-8 bg-amber-500/10 border-amber-500">
                           <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                           <CardContent>
                               <h3 className="text-xl font-semibold text-amber-800">Under Construction</h3>
                               <p className="text-muted-foreground mt-2">The video learning hub is temporarily unavailable as we work on some backend integrations. Please check back later!</p>
                           </CardContent>
                        </Card>
                </div>
            </div>
        </>
    );
}
