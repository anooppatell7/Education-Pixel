

'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, Clock, ArrowRight, BarChart, ChevronLeft, ShieldAlert, BadgeInfo } from "lucide-react";
import type { MockTest, ExamResult, ExamRegistration } from "@/lib/types";
import { useUser, useFirestore } from "@/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import SectionDivider from "@/components/section-divider";

function TestsLoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({length: 3}).map((_, i) => (
                <Card key={i} className="rounded-lg shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-10 w-full mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-5 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default function StudentExamPage() {
    const { user, isLoading: userLoading } = useUser();
    const firestore = useFirestore();

    const [studentExams, setStudentExams] = useState<MockTest[]>([]);
    const [userResults, setUserResults] = useState<ExamResult[]>([]);
    const [registration, setRegistration] = useState<ExamRegistration | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userLoading) return;
        if (!user || !firestore) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const regRef = doc(firestore, 'examRegistrations', user.uid);
                const regSnap = await getDoc(regRef);

                if (!regSnap.exists()) {
                    setRegistration(null);
                    setIsLoading(false);
                    return;
                }
                
                const regData = { id: regSnap.id, ...regSnap.data() } as ExamRegistration;
                setRegistration(regData);

                if (!regData.isApproved) {
                    setIsLoading(false);
                    return;
                }

                // Fetch from studentExams collection
                const examsQuery = query(
                    collection(firestore, "studentExams"),
                    where("franchiseId", "==", regData.franchiseId),
                    where("allowedStudents", "array-contains", user.uid)
                );
                const examsSnapshot = await getDocs(examsQuery);
                const examList = examsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MockTest));
                setStudentExams(examList);

            } catch (error) {
                console.error("Failed to fetch student exams:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [user, userLoading, firestore]);

    useEffect(() => {
        const fetchUserResults = async () => {
            if (!user || !firestore || studentExams.length === 0 || !registration) return;

            const examIds = studentExams.map(t => t.id);
            if (examIds.length === 0) return;

            try {
                const resultsQuery = query(
                    collection(firestore, 'examResults'),
                    where('registrationNumber', '==', registration.registrationNumber),
                    where('testId', 'in', examIds)
                );
                const resultsSnapshot = await getDocs(resultsQuery);
                let results = resultsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const submittedAt = data.submittedAt?.toDate ? data.submittedAt.toDate() : new Date(0);
                    return { id: doc.id, ...data, submittedAt } as ExamResult
                });

                results.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
                setUserResults(results);
            } catch (error) {
                console.error("Failed to fetch user results:", error);
            }
        };

        if (!userLoading && !isLoading) {
            fetchUserResults();
        }
    }, [user, userLoading, firestore, isLoading, studentExams, registration]);
    
    const latestResultsMap = new Map<string, ExamResult>();
    userResults.forEach(result => {
        if (!latestResultsMap.has(result.testId)) {
            latestResultsMap.set(result.testId, result);
        }
    });

    const pageLoading = userLoading || isLoading;
    
    const renderContent = () => {
        if (pageLoading) {
            return <TestsLoadingSkeleton />;
        }
        
        if (!registration) {
            return (
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                    <CardContent className="p-12 text-center text-muted-foreground">
                        <p className="text-lg">You are not registered for any official exams.</p>
                        <p className="mt-2 text-sm"><Link href="/exam/register" className="text-accent underline">Click here to register.</Link></p>
                    </CardContent>
                </Card>
            )
        }
        
        if (!registration.isApproved) {
            const statusMessage = registration.status === 'Rejected' 
                ? "Your registration has been rejected. Please contact administration for more details."
                : "Your registration is pending approval. Please check back later.";

            return (
                 <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                    <CardHeader className="items-center text-center">
                        {registration.status === 'Rejected' 
                            ? <ShieldAlert className="h-12 w-12 text-destructive"/>
                            : <BadgeInfo className="h-12 w-12 text-blue-500"/>
                        }
                    </CardHeader>
                    <CardContent className="p-12 text-center text-muted-foreground">
                        <p className="text-lg font-semibold">{statusMessage}</p>
                        <p className="mt-4 text-sm">You cannot access exams until your registration is approved.</p>
                    </CardContent>
                </Card>
            )
        }

        if (studentExams.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {studentExams.map((exam) => {
                        const hasAttempted = latestResultsMap.has(exam.id);
                        const result = latestResultsMap.get(exam.id);

                        return (
                            <Card key={exam.id} className="flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-background border-t-4 border-t-accent rounded-lg">
                                <CardHeader>
                                    <CardTitle className="font-headline text-xl text-primary">{exam.title}</CardTitle>
                                    <CardDescription className="line-clamp-3 h-[60px]">{exam.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <ListChecks className="h-4 w-4" />
                                            <span>{exam.questions?.length || 0} Questions</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{exam.duration} minutes</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex">
                                    {user && hasAttempted && result ? (
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href={`/exam/result/${result.id}`}>
                                                <BarChart className="mr-2 h-4 w-4" /> View Result
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button asChild className="w-full">
                                            <Link href={user ? `/exam/start`: `/login?redirect=/exam`}>
                                                Start Exam <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )
        }
        
        return (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                <CardContent className="p-12 text-center text-muted-foreground">
                    <p className="text-lg">No official exams are available for you right now.</p>
                    <p className="mt-2 text-sm">Please check back later.</p>
                </CardContent>
            </Card>
        );
    }


    return (
        <>
            <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
                <div className="container py-16 sm:py-24 text-center">
                    {pageLoading ? <Skeleton className="h-12 w-2/3 mx-auto" /> :
                        <h1 className="font-headline text-4xl font-bold sm:text-5xl">Student Exams<span className="text-purple-300">.</span></h1>
                    }
                    {pageLoading ? <Skeleton className="h-6 w-1/2 mx-auto mt-4" /> :
                      <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-50">
                          These are the official exams assigned to you.
                      </p>
                    }
                </div>
            </div>
            
            <div className="bg-secondary relative">
                <SectionDivider style="wave" className="text-gradient-to-br from-purple-900 via-blue-900 to-black" position="top"/>
                <div className="container py-16 sm:py-24">
                   {renderContent()}
                </div>
            </div>
        </>
    );
}
