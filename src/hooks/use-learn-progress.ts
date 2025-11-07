
"use client";

import { useState, useEffect, useCallback } from 'react';
import coursesData from '@/lib/data/courses.json';
import type { LearningCourse, UserProgress } from '@/lib/types';
import { useUser } from '@/firebase';
import { getUserProgress, updateUserProgress } from '@/lib/firebase';

// Helper to get total lesson count for a course
const getTotalLessons = (courseId: string): number => {
    const course = coursesData.find(c => c.id === courseId) as LearningCourse | undefined;
    if (!course) return 0;
    return course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
}

export const useLearnProgress = () => {
    const { user } = useUser();
    const [progress, setProgress] = useState<UserProgress>({});
    const [isLoading, setIsLoading] = useState(true);

    // Load progress from Firestore on initial render
    useEffect(() => {
        const fetchProgress = async () => {
            if (user) {
                setIsLoading(true);
                const dbProgress = await getUserProgress(user.uid);
                if (dbProgress) {
                    setProgress(dbProgress);
                }
                setIsLoading(false);
            } else {
                // If user is logged out, clear progress
                setProgress({});
                setIsLoading(false);
            }
        };

        fetchProgress();
    }, [user]);

    // Save progress to Firestore whenever it changes
    const saveProgress = useCallback(async (newProgress: UserProgress) => {
        if (!user) return;
        setProgress(newProgress); // Optimistic update
        await updateUserProgress(user.uid, newProgress);
    }, [user]);
    
    const isLessonCompleted = useCallback((courseId: string, lessonId: string): boolean => {
        return !!progress[courseId]?.completedLessons?.includes(lessonId);
    }, [progress]);

    const toggleLessonCompleted = useCallback((courseId: string, lessonId: string) => {
        if (!user) return;

        const courseProgress = progress[courseId] || { completedLessons: [] };
        const isCompleted = courseProgress.completedLessons.includes(lessonId);
        
        let newCompletedLessons: string[];
        if (isCompleted) {
            newCompletedLessons = courseProgress.completedLessons.filter(id => id !== lessonId);
        } else {
            newCompletedLessons = [...courseProgress.completedLessons, lessonId];
        }

        const newProgressData: UserProgress = {
            ...progress,
            [courseId]: {
                ...courseProgress,
                completedLessons: newCompletedLessons,
                lastVisitedLesson: lessonId, // Also update last visited
            },
        };

        saveProgress(newProgressData);

    }, [progress, saveProgress, user]);
    
    const getCourseProgress = useCallback((courseId: string): { completedCount: number, totalLessons: number, progressPercentage: number } => {
        const completedLessons = progress[courseId]?.completedLessons || [];
        const totalLessons = getTotalLessons(courseId);
        const completedCount = completedLessons.length;
        
        if (totalLessons === 0) {
            return { completedCount: 0, totalLessons: 0, progressPercentage: 0 };
        }
        
        const progressPercentage = (completedCount / totalLessons) * 100;
        
        return {
            completedCount,
            totalLessons,
            progressPercentage,
        };

    }, [progress]);
    
    const updateLastVisitedLesson = useCallback((courseId: string, lessonId: string) => {
        if (!user) return;

        const newProgressData: UserProgress = {
            ...progress,
            [courseId]: {
                ...(progress[courseId] || { completedLessons: [] }),
                lastVisitedLesson: lessonId,
            },
        };
        saveProgress(newProgressData);
    }, [progress, saveProgress, user]);


    return {
        progress,
        isLoading,
        isLessonCompleted,
        toggleLessonCompleted,
        getCourseProgress,
        updateLastVisitedLesson
    };
};
