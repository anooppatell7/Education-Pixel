
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Award, BrainCircuit, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple SVG Icon components for branded software
const IconPhotoshop = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-blue-500", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#31a8ff"/><path d="M9.5 8.5H12C13.3807 8.5 14.5 9.61929 14.5 11C14.5 12.3807 13.3807 13.5 12 13.5H9.5V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.5 16L15 18.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 8.5V13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const IconTally = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-red-500", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#ef4444" /><text x="12" y="15" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">T</text></svg>
);

const IconExcel = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-green-600", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#10b981"/><path d="M8 8L12 12M12 8L8 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 16V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const IconWord = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-blue-600", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#2563eb"/><path d="M8 8V16M8 8H12C14 8 16 10 16 12C16 14 14 16 12 16H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const IconCorel = ({ className }: { className?: string }) => (
    <svg className={cn("h-10 w-10 text-teal-500", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#14b8a6"/><path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);


const AnimatedIcon = ({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
  <div className={cn("absolute bg-card/60 backdrop-blur-sm p-3 rounded-full shadow-lg border border-border/20 animate-float", className)} style={style}>
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
