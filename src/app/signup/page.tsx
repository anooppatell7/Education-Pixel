
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser, db } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Head from "next/head";
import { doc, setDoc, getDocs, collection, query, where, serverTimestamp } from "firebase/firestore";
import type { Franchise, User as AppUser } from "@/lib/types";
import { isValidTLD } from "@/lib/tld-validator";
import { Loader2 } from "lucide-react";


export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);
  

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setIsLoading(true);

    if (!name || !email || !password) {
      toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
        toast({ title: "Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
        setIsLoading(false);
        return;
    }
     if (!isValidTLD(email)) {
        toast({ title: "Invalid Email", description: "The email address must have a valid domain (e.g., .com, .in).", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const authUser = userCredential.user;
      
      // 2. Update Auth profile display name
      await updateProfile(authUser, { displayName: name });
      
      // 3. Determine user role and franchise details
      const userQuery = query(collection(db, "users"), where("email", "==", email));
      const userSnap = await getDocs(userQuery);

      let role = "student";
      let franchiseId: string | null = null;
      let userCity: string | null = null;
      
      // If a user doc already exists with this email, it's likely a pre-added franchise admin
      if (!userSnap.empty && userSnap.docs[0].data().role === 'franchiseAdmin') {
          const preExistingUserData = userSnap.docs[0].data();
          role = "franchiseAdmin";
          franchiseId = preExistingUserData.franchiseId;
          userCity = preExistingUserData.city;
      }
      
      // 4. Create user document in Firestore. This will overwrite if a doc with the same UID exists, which is fine here.
      const userDocRef = doc(db, "users", authUser.uid);
      const userData: AppUser = {
        id: authUser.uid,
        name: name,
        email: email,
        role: role as 'student' | 'franchiseAdmin' | 'superAdmin',
        city: userCity || '',
        franchiseId: franchiseId || '',
        createdAt: serverTimestamp(),
      };
      
      await setDoc(userDocRef, userData);
      
      toast({
        title: "Account Created",
        description: "Welcome! You have successfully signed up.",
      });

      if (role === 'franchiseAdmin') {
          router.push(`/franchise/${franchiseId}/dashboard`);
      } else {
          router.push('/profile');
      }

    } catch (error: any) {
      let errorMessage = "An unknown error occurred.";
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email address is already in use by another account.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'The email address is not valid.';
            break;
          case 'auth/weak-password':
             errorMessage = 'The password is too weak.';
             break;
           case 'permission-denied':
           case 'firestore/permission-denied':
             errorMessage = 'You do not have permission to create an account. Please check your details or contact support.';
             break;
          default:
            errorMessage = error.message || 'Failed to create an account. Please try again.';
            break;
        }
      }
      console.error("Firebase Signup Error:", error);
      toast({
        title: "Signup Failed",
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
        <title>Sign Up - Education Pixel</title>
        <meta name="description" content="Create an account with Education Pixel to start your learning journey with our interactive courses." />
         <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="flex items-center justify-center min-h-[80vh] bg-secondary">
        <Card className="mx-auto max-w-sm w-full shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>Enter your details to start your learning journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : 'Sign Up'}
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a href="/login" className="underline">
                  Login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
