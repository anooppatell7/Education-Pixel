
"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitContactForm, type ContactFormState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Sending..." : "Send Message"}
        </Button>
    );
}

export default function ContactForm() {
    const initialState: ContactFormState = {
        message: "",
    };
    const [state, formAction] = useFormState(submitContactForm, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.message) {
            if (state.issues) {
                // Error case
                toast({
                    title: "Error",
                    description: state.message,
                    variant: "destructive",
                });
            } else {
                // Success case
                toast({
                    title: "Success",
                    description: state.message,
                });
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
        <form ref={formRef} action={formAction} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" placeholder="Your Name" required />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
            </div>
            <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Your message..." rows={5} required />
            </div>

            {state.issues && (
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-5">
                            {state.issues.map((issue, index) => <li key={index}>{issue}</li>)}
                        </ul>
                    </AlertDescription>
                 </Alert>
            )}

            <SubmitButton />
        </form>
    );
}
