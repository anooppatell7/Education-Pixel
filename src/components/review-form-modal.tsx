
"use client";

import { useState, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star, Send } from "lucide-react";
import { submitReviewForm, type ReviewFormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : <> <Send className="mr-2 h-4 w-4" /> Submit Review </>}
        </Button>
    );
}

function StarRating({ rating, setRating }: { rating: number, setRating: (r: number) => void }) {
    return (
        <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="group"
                >
                    <Star className={cn(
                        "h-8 w-8 transition-colors",
                        star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground/50 group-hover:text-yellow-300"
                    )} />
                </button>
            ))}
        </div>
    );
}

export function ReviewFormModal({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const initialState: ReviewFormState = { message: "", isSuccess: false };
    const [state, formAction] = useFormState(submitReviewForm, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.isSuccess) {
            toast({
                title: "Review Submitted!",
                description: state.message,
            });
            formRef.current?.reset();
            setRating(0);
            setIsOpen(false);
        } else if (state.message && state.issues) {
            toast({
                title: "Error",
                description: state.message,
                variant: "destructive",
            });
        }
    }, [state, toast]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-center">Share Your Experience</DialogTitle>
                    <DialogDescription className="text-center">
                        Your feedback helps us improve and helps other students make informed decisions.
                    </DialogDescription>
                </DialogHeader>

                <form ref={formRef} action={formAction} className="space-y-6 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="rating" className="text-center">Your Overall Rating</Label>
                        <StarRating rating={rating} setRating={setRating} />
                        <input type="hidden" name="rating" value={rating} />
                         {state.issues?.find(i => i.includes('rating')) && <p className="text-sm text-destructive text-center">Please select a star rating.</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea id="comment" name="comment" placeholder="Tell us about your experience..." required />
                    </div>

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    );
}
