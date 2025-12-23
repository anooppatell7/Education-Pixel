
"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { submitEnrollmentForm, type EnrollmentFormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : "Apply Now"}
        </Button>
    );
}

function EnrollmentForm({ onFormSuccess }: { onFormSuccess: () => void }) {
    const initialState: EnrollmentFormState = { message: "", isSuccess: false };
    const [state, formAction] = useFormState(submitEnrollmentForm, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.isSuccess) {
            formRef.current?.reset();
            onFormSuccess();
        }
    }, [state, onFormSuccess]);

    return (
        <form ref={formRef} action={formAction} className="space-y-4">
            {state.message && !state.isSuccess && (
                 <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                        <h5 className="font-semibold">Oops! Something went wrong.</h5>
                        <p className="text-sm">{state.message}</p>
                    </div>
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+91 12345 67890" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea id="message" name="message" placeholder="Any specific questions or course interests?" />
            </div>
            <DialogFooter className="pt-2">
              <SubmitButton />
            </DialogFooter>
        </form>
    );
}

export function EnrollModal({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSuccess = () => {
      setFormSubmitted(true);
      toast({
        title: "Application Sent!",
        description: "We've received your details and will be in touch soon.",
        variant: "default",
        className: "bg-green-600 text-white border-green-600"
      });
      // Close the modal after a delay
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Reset form submission state when modal is closed
            setFormSubmitted(false);
        }
        setIsOpen(open);
    }
    
    const whatsAppUrl = `https://wa.me/917355379619?text=${encodeURIComponent("Hello, I am interested in enrolling for a course.")}`;

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-center">Enroll Now</DialogTitle>
                    <DialogDescription className="text-center">
                        Choose your preferred way to connect with us.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="apply" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="apply">Apply Online</TabsTrigger>
                        <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                    </TabsList>
                    <TabsContent value="apply" className="py-4">
                       <EnrollmentForm onFormSuccess={handleSuccess} />
                    </TabsContent>
                    <TabsContent value="whatsapp" className="py-4 text-center">
                       <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
                            <p className="text-sm text-muted-foreground">Click the button below to start a conversation with our admissions team on WhatsApp.</p>
                             <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                                <Link href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                                   <Send className="mr-2 h-5 w-5" />
                                    Chat on WhatsApp
                                </Link>
                            </Button>
                       </div>
                    </TabsContent>
                </Tabs>

            </DialogContent>
        </Dialog>
    );
}
