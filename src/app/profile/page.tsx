'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ExamRegistration } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Phone, Calendar, Key, UserCheck, Briefcase } from 'lucide-react';
import SectionDivider from '@/components/section-divider';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

function ProfileSkeleton() {
    return (
        <div className="container py-16 sm:py-24 animate-pulse">
            <Skeleton className="h-12 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-1/3 mx-auto mt-4" />
            <Card className="max-w-2xl mx-auto mt-12">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                             <Skeleton className="h-8 w-48" />
                             <Skeleton className="h-5 w-64" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

function ProfileDetail({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) {
    return (
        <div className="flex items-start gap-4">
            <div className="text-muted-foreground mt-1">{icon}</div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{value || 'Not provided'}</p>
            </div>
        </div>
    )
}

export default function ProfilePage() {
    const { user, isLoading: userLoading } = useUser();
    const [registration, setRegistration] = useState<ExamRegistration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (userLoading) return;
        if (!user) {
            router.push('/login?redirect=/profile');
            return;
        }

        const fetchRegistration = async () => {
            setIsLoading(true);
            const docRef = doc(db, 'examRegistrations', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as Omit<ExamRegistration, 'id'>;
                setRegistration({ id: docSnap.id, ...data });
            }
            setIsLoading(false);
        };

        fetchRegistration();
    }, [user, userLoading, router]);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    const loading = userLoading || isLoading;

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!registration) {
         return (
            <div className="bg-background">
                <div className="container py-16 sm:py-24 text-center">
                    <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl">Profile Not Found</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-primary/80">
                        You have not completed your exam registration yet. Please register to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-background">
                <div className="container py-16 sm:py-24 text-center">
                    <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl">Student Profile</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-primary/80">
                        Your personal and registration details.
                    </p>
                </div>
            </div>
            <div className="bg-secondary relative">
                <SectionDivider style="wave" className="text-background" position="top"/>
                <div className="container py-16 sm:py-24">
                    <Card className="max-w-2xl mx-auto shadow-lg">
                        <CardHeader>
                             <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                                <Avatar className="w-24 h-24 text-3xl border-4 border-primary">
                                    <AvatarFallback>{getInitials(registration.fullName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-3xl font-headline">{registration.fullName}</CardTitle>
                                    <CardDescription className="text-base">{registration.email}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                            <ProfileDetail icon={<Key className="h-5 w-5"/>} label="Registration Number" value={registration.registrationNumber} />
                            <ProfileDetail icon={<Briefcase className="h-5 w-5"/>} label="Course" value={registration.course} />
                            <ProfileDetail icon={<User className="h-5 w-5"/>} label="Father's Name" value={registration.fatherName} />
                            <ProfileDetail icon={<Phone className="h-5 w-5"/>} label="Phone Number" value={registration.phone} />
                            <ProfileDetail icon={<Calendar className="h-5 w-5"/>} label="Date of Birth" value={format(new Date(registration.dob), "PPP")} />
                            <ProfileDetail icon={<UserCheck className="h-5 w-5"/>} label="Gender" value={registration.gender} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}