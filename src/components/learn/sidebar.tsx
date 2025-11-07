
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Layers, Search as SearchIcon, BookText, CheckCircle, Home, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCourseData } from '@/lib/learn-helpers';
import type { LearningCourse, LearningModule, Lesson } from '@/lib/types';
import { Input } from '../ui/input';
import { useLearnProgress } from '@/hooks/use-learn-progress';
import { useUser } from '@/firebase';

type SidebarProps = {
  courseSlug: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
};

export default function LearnSidebar({ courseSlug, isMobile = false, onLinkClick }: SidebarProps) {
  const [course, setCourse] = useState<LearningCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const { user, isLoading: userLoading } = useUser();
  const { isLessonCompleted } = useLearnProgress();
  const router = useRouter();

  const fetchCourse = useCallback(async () => {
    setIsLoading(true);
    const courseData = await getCourseData(courseSlug);
    setCourse(courseData);
    setIsLoading(false);
  }, [courseSlug]);
  
  useEffect(() => {
    if (!userLoading && !user) {
      router.push(`/login?redirect=/learn/${courseSlug}`);
    }
  }, [user, userLoading, courseSlug, router]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const filteredModules = course?.modules?.map(module => {
    const filteredLessons = module.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...module, lessons: filteredLessons };
  }).filter(module => module.lessons.length > 0 || module.title.toLowerCase().includes(searchTerm.toLowerCase()));


  const SidebarContent = () => {
    if (isLoading) {
      return (
         <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
    }

    return (
      <div className="flex h-full flex-col bg-card text-card-foreground">
         <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-headline text-lg font-bold text-primary hover:text-accent transition-colors">{course?.title}</h2>
          <Button variant="ghost" size="icon" asChild>
              <Link href="/learn" title="All Courses"><Home className="h-5 w-5" /></Link>
          </Button>
        </div>

         <div className="p-4 border-b">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Accordion
            type="multiple"
            defaultValue={course?.modules.map(m => m.id)}
            className="w-full"
          >
            {filteredModules?.map((module: LearningModule) => (
              <AccordionItem value={module.id} key={module.id}>
                <AccordionTrigger className="px-4 py-3 text-base hover:no-underline hover:bg-accent/5">
                   <div className="flex items-center gap-3">
                      <Layers className="h-5 w-5 text-accent" />
                      <span className="font-semibold text-primary/90 text-left">{module.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <ul className="space-y-1 border-l-2 border-accent/20 ml-6 pl-2">
                    {module.lessons.map((lesson: Lesson) => {
                      const isActive = pathname === `/learn/${courseSlug}/${lesson.id}`;
                      const isCompleted = isLessonCompleted(courseSlug, lesson.id);

                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/learn/${courseSlug}/${lesson.id}`}
                            onClick={onLinkClick}
                            className={cn(
                              'flex items-center justify-between p-2 rounded-md transition-colors text-sm w-full text-left',
                              isActive
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent/10 text-muted-foreground'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <BookText className="h-4 w-4" />
                              <span>{lesson.title}</span>
                            </div>
                            {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    );
  }
  
  if (isMobile) {
    return <SidebarContent />;
  }

  return (
      <aside className="hidden md:block w-80 sticky top-16 h-[calc(100vh-4rem)] border-r">
        <SidebarContent />
      </aside>
  );
}
