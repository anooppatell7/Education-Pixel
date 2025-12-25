
"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import type { MockTest, TestQuestion, StudentExam, ExamResult } from '@/lib/types';
import { useMockTest } from '@/hooks/use-mock-test';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight, Clock, Bookmark, X, Check, Loader2, FileText, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function TestPageSkeleton() {
    return (
        <div className="container py-8 mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start animate-pulse">
            <div className="lg:col-span-3 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-8 w-24" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-full mb-8" />
                        <div className="space-y-4">
                            {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-10 w-28" />
                    </CardFooter>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                     <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                     <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                </Card>
                 <Card>
                     <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                     <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                </Card>
            </div>
        </div>
    )
}

function MockTestClientComponent({ testId }: { testId: string }) {
    const { user, isLoading: userLoading } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const registrationNumber = searchParams.get('regNo');
    const studentName = searchParams.get('studentName');
    const isOfficialExam = !!registrationNumber;


    const [testData, setTestData] = useState<MockTest | StudentExam | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [existingResult, setExistingResult] = useState<ExamResult | null>(null);

    const {
        isInitialized,
        initializeTest,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        selectedAnswers,
        handleSelectAnswer,
        markedForReview,
        toggleMarkForReview,
        timeLeft,
        isTimeUp,
        isSubmitting,
        handleSubmit,
    } = useMockTest(testId);

    useEffect(() => {
        if (userLoading) return;
        
        if (!user) {
            const redirectUrl = isOfficialExam
                ? `/login?redirect=/exam/start` 
                : `/login?redirect=/mock-tests/${testId}`;
            router.push(redirectUrl);
            return;
        }

        const fetchTestAndResult = async () => {
            setIsLoading(true);
            const collectionName = isOfficialExam ? "studentExams" : "mockTests";
            const testRef = doc(db, collectionName, testId);
            const testSnap = await getDoc(testRef);

            if (!testSnap.exists() || !testSnap.data().isPublished) {
                notFound();
                return;
            }
            
            const data = { id: testSnap.id, ...testSnap.data() } as MockTest | StudentExam;
            setTestData(data);
            document.title = `${data.title} - Education Pixel`;
            
            // Check for existing result
            const resultIdentifier = registrationNumber || user.uid;
            const resultsQuery = query(
                collection(db, 'examResults'),
                where('registrationNumber', '==', resultIdentifier),
                where('testId', '==', testId),
                orderBy('submittedAt', 'desc'),
                limit(1)
            );
            const resultsSnapshot = await getDocs(resultsQuery);

            if (!resultsSnapshot.empty) {
                setExistingResult({id: resultsSnapshot.docs[0].id, ...resultsSnapshot.docs[0].data()} as ExamResult);
            }
            
            setIsLoading(false);
        };

        fetchTestAndResult();
    }, [testId, user, userLoading, router, isOfficialExam, registrationNumber]);

    useEffect(() => {
        if (testData && !isInitialized && !existingResult) {
            initializeTest(testData.questions.length, testData.duration, registrationNumber);
        }
    }, [testData, isInitialized, initializeTest, registrationNumber, existingResult]);

    const handleTestSubmit = useCallback((isAuto: boolean) => {
        if (testData && user) {
            handleSubmit(isAuto, router, testData, user, registrationNumber, studentName);
        }
    }, [testData, user, handleSubmit, router, registrationNumber, studentName]);


    useEffect(() => {
        if(isTimeUp && !isSubmitting) {
            handleTestSubmit(true);
        }
    }, [isTimeUp, isSubmitting, handleTestSubmit]);
    
    const currentQuestion: TestQuestion | undefined = testData?.questions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / (testData?.questions.length || 1)) * 100;
    
    const timeFormatted = useMemo(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, [timeLeft]);

    if (isLoading || userLoading) {
        return <TestPageSkeleton />;
    }

    if (existingResult) {
         return (
            <div className="bg-secondary min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-lg text-center shadow-lg rounded-lg">
                    <CardHeader>
                        <ShieldCheck className="mx-auto h-16 w-16 text-green-500" />
                        <CardTitle className="font-headline text-2xl mt-4">Exam Already Completed</CardTitle>
                        <CardDescription>You have already submitted this exam.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You can view your performance and results by clicking the button below.</p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button asChild className="w-full">
                            <Link href={`/exam/result/${existingResult.id}`}>
                               <FileText className="mr-2 h-4 w-4" /> View Your Result
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href={isOfficialExam ? "/exam" : "/mock-tests"}>
                                Back to Exams
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
    
    if (!isInitialized || !testData || !currentQuestion) {
        // This state can be shown if test data is null or still loading after the skeleton
        return <div className="text-center py-10">Test not found or has no questions.</div>;
    }


    const getQuestionStatus = (index: number) => {
        if (markedForReview.includes(index)) return 'bg-purple-500 hover:bg-purple-600 text-white';
        if (selectedAnswers[index] !== null && selectedAnswers[index] !== undefined) return 'bg-green-500 hover:bg-green-600 text-white';
        return 'bg-muted hover:bg-muted/80';
    }
    
    const handleOptionSelect = (value: string) => {
        handleSelectAnswer(currentQuestionIndex, parseInt(value, 10));
    };

    return (
        <div className="bg-secondary min-h-screen">
            <div className="container py-8 mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                        <CardHeader className="border-b">
                             <div className="flex justify-between items-center">
                                <h1 className="text-xl font-bold text-primary">{testData.title}</h1>
                                <div className={cn("flex items-center gap-2 font-mono text-lg font-semibold px-3 py-1 rounded-md", timeLeft < 300 ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground')}>
                                    <Clock className="h-5 w-5" />
                                    <span>{timeFormatted}</span>
                                </div>
                            </div>
                            <Progress value={progressPercentage} className="mt-4 h-2" />
                        </CardHeader>
                        <CardContent className="pt-6">
                             <p className="text-sm text-muted-foreground mb-4">Question {currentQuestionIndex + 1} of {testData.questions.length}</p>
                            <h2 className="text-lg font-semibold mb-6">{currentQuestion.questionText}</h2>

                             <RadioGroup
                                value={String(selectedAnswers[currentQuestionIndex])}
                                onValueChange={handleOptionSelect}
                                className="space-y-4"
                             >
                                {currentQuestion.options.map((option, index) => (
                                    <Label key={index} htmlFor={`option-${index}`} 
                                        className={cn("flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
                                            selectedAnswers[currentQuestionIndex] === index && 'bg-accent border-accent-foreground text-accent-foreground'
                                        )}>
                                        <RadioGroupItem value={String(index)} id={`option-${index}`} className="h-5 w-5 mr-4" />
                                        <span>{option}</span>
                                    </Label>
                                ))}
                            </RadioGroup>

                        </CardContent>
                         <CardFooter className="justify-between border-t pt-6">
                             <Button variant="outline" onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} disabled={currentQuestionIndex === 0 || isSubmitting}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                             <Button onClick={() => setCurrentQuestionIndex(prev => Math.min(testData.questions.length - 1, prev + 1))} disabled={currentQuestionIndex === testData.questions.length - 1 || isSubmitting}>
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 sticky top-24">
                     <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                        <CardHeader><CardTitle>Question Palette</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-5 gap-2">
                             {testData.questions.map((_, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="icon"
                                    className={cn("h-10 w-10 text-base font-bold transition-all", 
                                        getQuestionStatus(index),
                                        currentQuestionIndex === index && 'ring-2 ring-primary ring-offset-2'
                                    )}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    disabled={isSubmitting}
                                >
                                    {index + 1}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <Button 
                            variant={markedForReview.includes(currentQuestionIndex) ? "secondary" : "outline"} 
                            onClick={() => toggleMarkForReview(currentQuestionIndex)}
                            disabled={isSubmitting}
                        >
                            {markedForReview.includes(currentQuestionIndex) ? <X className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                            {markedForReview.includes(currentQuestionIndex) ? 'Unmark' : 'Mark Review'}
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                     {isSubmitting ? 'Submitting...' : isOfficialExam ? 'Submit Exam' : 'Submit Test'}
                                </Button>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will not be able to change your answers after submitting.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => handleTestSubmit(false)}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Yes, Submit {isOfficialExam ? 'Exam' : 'Test'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                     <Card className="text-xs shadow-lg rounded-lg">
                        <CardHeader className="p-3"><CardTitle className="text-sm">Legend</CardTitle></CardHeader>
                        <CardContent className="p-3 space-y-2">
                            <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-green-500"></div><span>Answered</span></div>
                            <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-muted"></div><span>Not Answered</span></div>
                            <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-purple-500"></div><span>Marked for Review</span></div>
                             <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm ring-2 ring-primary ring-offset-2 ring-offset-background"></div><span>Current Question</span></div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}

export default function MockTestPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return <MockTestClientComponent testId={id} />;
}

    
