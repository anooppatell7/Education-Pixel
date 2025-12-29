

"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './use-local-storage';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { User } from 'firebase/auth';
import { useFirestore } from '@/firebase';
import { doc, getDocs, query, collection, where, runTransaction, serverTimestamp, getDoc, addDoc } from "firebase/firestore";
import type { MockTest, TestQuestion, TestResponse, TestResult, ExamResult, ExamRegistration, Certificate, StudentExam } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { generateCertificatePdf } from '@/lib/certificate-generator';

export const useMockTest = (testId: string) => {
    const { toast } = useToast();
    const db = useFirestore();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    // Use a more generic key and then add user-specific part if available
    const getStorageKey = useCallback((base: string, regNo?: string | null) => {
        if (regNo) return `exam-${testId}-${regNo}-${base}`;
        return `test-${testId}-${base}`;
    }, [testId]);

    const cleanupLocalStorage = useCallback((regNo?: string | null) => {
        window.localStorage.removeItem(getStorageKey('answers', regNo));
        window.localStorage.removeItem(getStorageKey('review', regNo));
        window.localStorage.removeItem(getStorageKey('time', regNo));
    }, [getStorageKey]);

    const [selectedAnswers, setSelectedAnswers] = useLocalStorage<(number | null)[]>(
        getStorageKey('answers'), 
        []
    );
    const [markedForReview, setMarkedForReview] = useLocalStorage<number[]>(
        getStorageKey('review'),
        []
    );

    const [timeLeft, setTimeLeft] = useLocalStorage<number>(getStorageKey('time'), 0);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const initialDurationRef = useRef<number>(0);
    
    const initializeTest = useCallback((questionCount: number, durationMinutes: number, regNo?: string | null) => {
        if (isInitialized) return;
        
        // Clear any previous state for this test before initializing
        cleanupLocalStorage(regNo);

        initialDurationRef.current = durationMinutes * 60;
        
        setTimeLeft(initialDurationRef.current);
        setSelectedAnswers(Array(questionCount).fill(null));
        setMarkedForReview([]);
        setCurrentQuestionIndex(0);
        
        setIsInitialized(true);
    }, [isInitialized, cleanupLocalStorage, setTimeLeft, setSelectedAnswers, setMarkedForReview]);


    // Timer effect
    useEffect(() => {
        if (!isInitialized || timeLeft <= 0 || isSubmitting) {
            if (timeLeft <= 0 && isInitialized) {
                 setIsTimeUp(true);
            }
            return;
        };

        timerRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current!);
                    setIsTimeUp(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isInitialized, setTimeLeft, timeLeft, isSubmitting]);
    
    const handleSelectAnswer = useCallback((questionIndex: number, optionIndex: number) => {
        setSelectedAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[questionIndex] = optionIndex;
            return newAnswers;
        });
    }, [setSelectedAnswers]);

    const toggleMarkForReview = useCallback((questionIndex: number) => {
        setMarkedForReview(prev => {
            if (prev.includes(questionIndex)) {
                return prev.filter(i => i !== questionIndex);
            } else {
                return [...prev, questionIndex];
            }
        });
    }, [setMarkedForReview]);

    const saveExamResult = async (result: Omit<ExamResult, 'id' | 'submittedAt'>): Promise<string> => {
        if (!db) throw new Error("Firestore is not initialized.");
        const resultWithTimestamp = {
            ...result,
            submittedAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, 'examResults'), resultWithTimestamp);
        return docRef.id;
    };
    
    const buildResultData = (testData: MockTest | StudentExam, user: User, registrationNumber: string | null, studentName: string | null): Omit<ExamResult, 'id'> => {
        let score = 0;
        let correctAnswers = 0;

        const responses: TestResponse[] = testData.questions.map((q, i) => {
            const selectedOption = selectedAnswers[i];
            const isCorrect = selectedOption === q.correctOption;
            const questionMarks = q.marks || 1;
            if (isCorrect) {
                score += questionMarks;
                correctAnswers++;
            }
            return {
                questionId: q.id,
                selectedOption: selectedOption === undefined || selectedOption === null ? null : selectedOption,
                isCorrect,
                marksAwarded: isCorrect ? questionMarks : 0,
            };
        });

        const attemptedQuestions = selectedAnswers.filter(a => a !== null && a !== undefined).length;
        const accuracy = attemptedQuestions > 0 ? (correctAnswers / attemptedQuestions) * 100 : 0;
        
        let timeTaken = initialDurationRef.current - timeLeft;
        if (isNaN(timeTaken) || timeTaken < 0) {
            timeTaken = 0;
        }

        const currentYear = new Date().getFullYear();
        const randomSuffix = Math.floor(100000 + Math.random() * 900000);
        const certificateId = `CERT-${currentYear}-${randomSuffix}`;
        
        const resultData = {
            registrationNumber: registrationNumber || user.uid,
            studentName: studentName || user.displayName || user.email || 'Anonymous',
            testId: testData.id,
            testName: testData.title,
            courseName: 'courseName' in testData ? testData.courseName : testData.title,
            franchiseId: 'franchiseId' in testData ? testData.franchiseId : '',
            score,
            totalMarks: testData.totalMarks,
            accuracy: parseFloat(accuracy.toFixed(2)) || 0,
            timeTaken: timeTaken,
            responses,
            certificateId,
            submittedAt: new Date(), // This will be replaced by serverTimestamp in saveExamResult
        };

        return resultData;
    }


    const handleSubmit = useCallback(async (
        isAutoSubmit: boolean, 
        router: AppRouterInstance, 
        testData: MockTest | StudentExam,
        user: User,
        registrationNumber: string | null,
        studentName: string | null
        ) => {
        
        if (isSubmitting || !db) return;
        
        setIsSubmitting(true);

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        const isOfficialExam = !!registrationNumber;

        try {
            const resultData = buildResultData(testData, user, registrationNumber, studentName);
            
            // Differentiate between saving to Firebase and storing locally
            if (isOfficialExam) {
                // Save to Firestore for official exams
                 const finalResultData = {...resultData, submittedAt: serverTimestamp()};
                 const resultId = await saveExamResult(finalResultData as Omit<ExamResult, 'id' | 'submittedAt'>);
                 
                 toast({
                    title: "Exam Submitted",
                    description: isAutoSubmit ? "Time's up! Your exam has been automatically submitted." : "Your exam has been submitted successfully."
                 });
                 router.push(`/exam/result/${resultId}`);

            } else {
                // Store in sessionStorage for mock tests
                const mockResultId = `mock-${testData.id}-${Date.now()}`;
                const mockResult = { ...resultData, id: mockResultId };
                sessionStorage.setItem(mockResultId, JSON.stringify(mockResult));

                toast({
                    title: "Test Submitted",
                    description: isAutoSubmit ? "Time's up! Your test has been automatically submitted." : "Your test has been submitted successfully."
                 });
                 // Redirect to a local-only result page
                router.push(`/mock-tests/result/${mockResultId}`);
            }
            
            cleanupLocalStorage(registrationNumber);

        } catch (error) {
             console.error("Failed to save test results:", error);
             toast({
                title: "Submission Failed",
                description: "Could not save your test results. Please try again.",
                variant: 'destructive'
             });
             setIsSubmitting(false); // Reset submitting state on error
        }

    }, [selectedAnswers, timeLeft, cleanupLocalStorage, isSubmitting, toast, getStorageKey, db]);

    return {
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
        getStorageKey
    };
};
