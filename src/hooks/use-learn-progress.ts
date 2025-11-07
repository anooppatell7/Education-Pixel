
"use client";

import { useState, useEffect, useCallback } from 'react';
import coursesData from '@/lib/data/courses.json';
import type { LearningCourse } from '@/lib/types';

// The key used to store progress data in localStorage
const PROGRESS_STORAGE_KEY = 'mtech-learn-progress';

type ProgressData = {
  // e.g., { html: ['lesson-1', 'lesson-2'], css: ['intro'] }
  [courseId: string]: string[]; 
};

// Helper to get total lesson count for a course
const getTotalLessons = (courseId: string): number => {
    const course = coursesData.find(c => c.id === courseId) as LearningCourse | undefined;
    if (!course) return 0;
    return course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
}


export const useLearnProgress = () => {
    const [progress, setProgress] = useState<ProgressData>({});

    // Load progress from localStorage on initial render (client-side only)
    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
            if (storedProgress) {
                setProgress(JSON.parse(storedProgress));
            }
        } catch (error) {
            console.error("Failed to load learning progress from localStorage", error);
        }
    }, []);

    // Save progress to localStorage whenever it changes
    const saveProgress = useCallback((newProgress: ProgressData) => {
        try {
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
            setProgress(newProgress);
        } catch (error) {
            console.error("Failed to save learning progress to localStorage", error);
        }
    }, []);
    
    /**
     * Checks if a specific lesson is marked as completed.
     */
    const isLessonCompleted = useCallback((courseId: string, lessonId: string): boolean => {
        return !!progress[courseId]?.includes(lessonId);
    }, [progress]);

    /**
     * Toggles the completion status of a lesson.
     */
    const toggleLessonCompleted = useCallback((courseId: string, lessonId: string) => {
        const courseProgress = progress[courseId] || [];
        const isCompleted = courseProgress.includes(lessonId);
        
        let newCourseProgress: string[];
        if (isCompleted) {
            // Remove the lesson if it was already completed
            newCourseProgress = courseProgress.filter(id => id !== lessonId);
        } else {
            // Add the lesson if it was not completed
            newCourseProgress = [...courseProgress, lessonId];
        }

        const newProgressData = {
            ...progress,
            [courseId]: newCourseProgress,
        };

        saveProgress(newProgressData);

    }, [progress, saveProgress]);
    
    /**
     * Gets the progress for a specific course.
     * @returns The number of completed lessons and the completion percentage.
     */
    const getCourseProgress = useCallback((courseId: string): { completedCount: number, totalLessons: number, progressPercentage: number } => {
        const completedLessons = progress[courseId] || [];
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


    return {
        progress,
        isLessonCompleted,
        toggleLessonCompleted,
        getCourseProgress,
    };
};
