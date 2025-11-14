
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Award, BrainCircuit, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple SVG Icon components for branded software
const IconPhotoshop = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-blue-500", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 7C7.67157 7 7 7.67157 7 8.5V17H11.5C13.9853 17 16 14.9853 16 12.5C16 10.0147 13.9853 8 11.5 8H9.5V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14.5 14.5L17.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const IconTally = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-red-500", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 9h6M9 12h6M9 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const IconExcel = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-green-600", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4V4zM4 10h16M10 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const IconWord = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-blue-600", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4V4zM8 9l2 6 2-6M14 9v6h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const IconCorel = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-teal-500", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 16.5a.5.5 0 01-.5-.5V6a.5.5 0 011 0v12a.5.5 0 01-.5.5z" fill="currentColor" /><path d="M17.5 12a.5.5 0 01-.5.5H6a.5.5 0 010-1h11a.5.5 0 01.5.5z" fill="currentColor" /></svg>
);

const AnimatedIcon = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("absolute bg-card/60 backdrop-blur-sm p-3 rounded-full shadow-lg border border-border/20 animate-float", className)}>
      {children}
  </div>
);


export default function About() {
  return (
    <section className="py-16 sm:py-24 bg-secondary/50 relative overflow-hidden">
      
      {/* Floating Icons - Decorative */}
      <AnimatedIcon className="top-1/4 left-[5%] hidden lg:block"><IconPhotoshop /></AnimatedIcon>
      <AnimatedIcon className="top-1/3 right-[8%] hidden lg:block" style={{ animationDelay: '1s' }}><IconTally /></AnimatedIcon>
      <AnimatedIcon className="bottom-1/4 left-[10%]" style={{ animationDelay: '2s' }}><IconExcel /></AnimatedIcon>
      <AnimatedIcon className="bottom-[15%] right-[5%]" style={{ animationDelay: '0.5s' }}><IconWord /></AnimatedIcon>
      <AnimatedIcon className="top-[15%] right-[20%]" style={{ animationDelay: '1.5s' }}><IconCorel className="h-8 w-8" /></AnimatedIcon>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary sm:text-4xl">
              From Foundational Skills to Career Success
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              At MTech IT Institute, our mission is simple: to bridge the gap between academic knowledge and real-world industry demands. We are dedicated to providing practical, job-oriented computer training that empowers you to achieve your career goals.
            </p>
            
            <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-accent">
                        <Target className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-primary">Practical, Hands-On Learning</h3>
                        <p className="text-foreground/80">Our curriculum is designed by industry experts to be relevant and focused on real-world applications, ensuring you're job-ready from day one.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-accent">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-primary">Expert Instructors</h3>
                        <p className="text-foreground/80">Learn from experienced professionals who bring years of practical knowledge and a passion for teaching to the classroom.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-accent">
                        <Award className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-primary">Career-Focused Courses</h3>
                        <p className="text-foreground/80">Whether you're starting out or upskilling, our <Link href="/courses" className="text-accent font-semibold hover:underline">comprehensive courses</Link> are your launchpad to success in the tech industry.</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Button asChild size="lg">
                    <Link href="/about">Learn More About Us</Link>
                </Button>
            </div>
          </div>
          <div className="w-full">
            <Card className="overflow-hidden shadow-2xl rounded-xl border-t-4 border-t-accent">
              <CardContent className="p-0">
                <Image
                  src="https://res.cloudinary.com/dzr4xjizf/image/upload/v1757136324/ChatGPT_Image_Sep_5_2025_10_25_03_PM_w0e2ry.png"
                  alt="Students learning in a modern computer lab at MTech IT Institute in Patti"
                  data-ai-hint="classroom students"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
