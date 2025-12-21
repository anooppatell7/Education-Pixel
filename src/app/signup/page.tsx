

"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Franchise } from "@/lib/types";


export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/learn');
    }
  }, [user, router]);
  
  useEffect(() => {
    const fetchFranchises = async () => {
        if (!db) return;
        const q = query(collection(db, "franchises"), where("status", "==", "active"));
        const querySnapshot = await getDocs(q);
        const franchiseList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Franchise));
        // For simplicity, let's use a predefined list for now. In a real app, you'd fetch this.
        setFranchises([
            { id: 'franchise_001', name: 'MTS Computer Indore', city: 'Indore', district: 'Indore', ownerName: 'Rahul Verma', email: 'indore@mts.com', status: 'active', createdAt: new Date() },
            { id: 'franchise_002', name: 'MTS Computer Bhopal', city: 'Bhopal', district: 'Bhopal', ownerName: 'Priya Sharma', email: 'bhopal@mts.com', status: 'active', createdAt: new Date() },
        ]);
    }
    fetchFranchises();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setIsLoading(true);

    if (!name || !email || !password || !city) {
      toast({ title: "Error", description: "Please fill all fields, including city.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
        toast({ title: "Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
      // Find franchise based on city
      const selectedFranchise = franchises.find(f => f.city === city);
      if (!selectedFranchise) {
          toast({ title: "Error", description: "Selected city does not have an active franchise. Please contact support.", variant: "destructive" });
          setIsLoading(false);
          return;
      }

      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const authUser = userCredential.user;
      
      // 2. Update Auth profile
      await updateProfile(authUser, { displayName: name });
      
      // 3. Create user document in Firestore
      const userDocRef = doc(db, "users", authUser.uid);
      await setDoc(userDocRef, {
        name: name,
        email: email,
        role: "student",
        city: city,
        franchiseId: selectedFranchise.id,
        createdAt: serverTimestamp()
      });

      // 4. (Optional) Log this activity
      await addDoc(collection(db, "activityLogs"), {
          userId: authUser.uid,
          franchiseId: selectedFranchise.id,
          action: "STUDENT_REGISTERED",
          timestamp: serverTimestamp()
      });
      
      toast({
        title: "Account Created",
        description: "Welcome! You have successfully signed up.",
      });
      router.push('/learn');
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
          default:
            errorMessage = 'Failed to create an account. Please try again.';
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
               <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Select onValueChange={setCity} value={city}>
                      <SelectTrigger id="city">
                          <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                          {franchises.map(f => (
                            <SelectItem key={f.id} value={f.city}>{f.city}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
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

    