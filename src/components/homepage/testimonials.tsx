
"use client";

import { db } from "@/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import type { Review } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    async function getFeaturedReviews() {
        try {
            const reviewsQuery = query(
                collection(db, "reviews"),
                where("isApproved", "==", true),
                orderBy("submittedAt", "desc"),
                limit(6)
            );
            const reviewsSnapshot = await getDocs(reviewsQuery);
            setReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    }
    getFeaturedReviews();
  }, []);
  
  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      next();
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(timer);
  }, [active, reviews.length]);


  const prev = () =>
    setActive((prev) => (prev - 1 + reviews.length) % reviews.length);

  const next = () =>
    setActive((prev) => (prev + 1) % reviews.length);

  if (loading) {
    return (
        <section className="py-16 sm:py-24 bg-background">
            <div className="container text-center">
                 <h2 className="font-headline text-3xl font-bold text-primary sm:text-4xl">What Our Students Say</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-lg text-primary/80">Loading testimonials...</p>
            </div>
        </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't render the section if there are no approved reviews
  }

  return (
    <section className="py-16 sm:py-24 bg-secondary">
        <div className="container">
            <div className="text-center mb-12">
                <h2 className="font-headline text-3xl font-bold text-primary sm:text-4xl">What Our Students Say</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-primary/80">
                    Hear from students who have transformed their careers with us.
                </p>
            </div>
            
            <div className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
                {/* Left Arrow */}
                <Button onClick={prev} variant="outline" size="icon" className="absolute left-0 md:-left-4 z-20 bg-background/50 backdrop-blur-sm rounded-full h-10 w-10">
                    <ChevronLeft size={24} />
                </Button>

                {/* Cards */}
                {reviews.map((review, index) => {
                    const position = (index - active + reviews.length) % reviews.length;
                    const isCenter = position === 0;
                    const isSecond = position === 1 || position === reviews.length -1;
                    const isThird = position === 2 || position === reviews.length -2;

                    let transform, opacity, zIndex;

                    if (isCenter) {
                        transform = 'translateX(0) scale(1)';
                        opacity = 1;
                        zIndex = 10;
                    } else if (isSecond) {
                        transform = `translateX(${position === 1 ? 120 : -120}px) scale(0.9)`;
                        opacity = 0.5;
                        zIndex = 9;
                    } else if (isThird) {
                        transform = `translateX(${position === 2 ? 240 : -240}px) scale(0.8)`;
                        opacity = 0.2;
                        zIndex = 8;
                    } else {
                        transform = 'scale(0)';
                        opacity = 0;
                        zIndex = 1;
                    }


                    return (
                        <div
                            key={review.id}
                            className="absolute transition-all duration-500 ease-in-out"
                            style={{ transform, opacity, zIndex }}
                        >
                            <Card className="w-[300px] md:w-[400px] h-[220px] rounded-2xl bg-card border shadow-xl flex flex-col justify-between text-center p-6 group">
                                 <div className="flex-grow">
                                     <MessageSquareQuote className="h-8 w-8 text-accent/50 mx-auto mb-3 transition-transform group-hover:scale-110" />
                                    <p className="text-foreground/80 text-sm md:text-base italic line-clamp-3">
                                        "{review.comment}"
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t flex items-center justify-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-primary font-semibold text-base">
                                        {review.name}
                                    </h3>
                                </div>
                            </Card>
                        </div>
                    );
                })}

                {/* Right Arrow */}
                <Button onClick={next} variant="outline" size="icon" className="absolute right-0 md:-right-4 z-20 bg-background/50 backdrop-blur-sm rounded-full h-10 w-10">
                    <ChevronRight size={24} />
                </Button>
            </div>
        </div>
    </section>
  )
}
