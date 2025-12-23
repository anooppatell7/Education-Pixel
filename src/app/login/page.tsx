
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser, db } from "@/firebase";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import type { User as AppUser } from "@/lib/types";


const handleRedirect = async (user: User, router: any, redirectUrl?: string | null) => {
    if (redirectUrl) {
        router.push(redirectUrl);
        return;
    }

    if (!db) return;
    // Check for a user document in Firestore to determine the role
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as AppUser;
        switch (userData.role) {
            case 'superAdmin':
                router.push('/admin/dashboard');
                break;
            case 'franchiseAdmin':
                router.push(`/franchise/${userData.franchiseId}/dashboard`); 
                break;
            case 'student':
            default:
                router.push('/profile');
                break;
        }
    } else {
        // Fallback for users without a role doc or old users
        router.push('/profile');
    }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const { user, isLoading: isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    // Only redirect if user loading is complete and user exists
    if (!isUserLoading && user) {
        handleRedirect(user, router, redirect);
    }
  }, [user, isUserLoading, router, redirect]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    if (!email || !password) {
        toast({ title: "Error", description: "Please enter both email and password.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast({
            title: "Login Successful",
            description: "Welcome back!",
        });
        
        await handleRedirect(userCredential.user, router, redirect);

    } catch (error: any) {
         let errorMessage = "An unknown error occurred.";
         if (error.code) {
            switch (error.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    errorMessage = 'Invalid email or password.';
                    break;
                case 'auth/too-many-requests':
                     errorMessage = 'Too many requests. Please try again later.';
                     break;
                default:
                    errorMessage = 'Failed to login. Please try again.';
                    break;
            }
        }
        console.error("Firebase Auth Error:", error);
        toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Education Pixel</title>
        <meta name="description" content="Login to your Education Pixel account to access your courses and learning materials." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="flex items-center justify-center min-h-[80vh] bg-secondary">
        <Card className="mx-auto max-w-sm w-full shadow-lg rounded-lg">
          <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Logo />
              </div>
               <CardTitle className="text-2xl font-headline">Login</CardTitle>
               <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <div className="mt-4 text-center text-sm">
                  Don't have an account?{' '}
                  <a href="/signup" className="underline">
                      Sign up
                  </a>
                 </div>
              </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    
