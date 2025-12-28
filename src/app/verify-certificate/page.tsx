
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import SectionDivider from '@/components/section-divider';
import type { ExamResult } from '@/lib/types';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const certificateId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<ExamResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();
  const [manualId, setManualId] = useState('');

  useEffect(() => {
    if (!certificateId) {
      setIsLoading(false);
      return;
    }

    const verifyCertificate = async () => {
      setIsLoading(true);
      setVerificationResult(null);
      setNotFound(false);
      try {
        const q = query(
          collection(db, "examResults"),
          where("certificateId", "==", certificateId.trim()),
          limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setNotFound(true);
        } else {
          const resultData = querySnapshot.docs[0].data() as ExamResult;
          setVerificationResult(resultData);
        }
      } catch (error) {
        console.error("Error verifying certificate:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyCertificate();
  }, [certificateId, toast]);
  
  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId) {
        toast({
            title: "ID Required",
            description: "Please enter a Certificate ID to verify.",
            variant: "destructive"
        });
        return;
    }
    router.push(`/verify-certificate?id=${manualId.trim()}`);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="mt-4">Verifying certificate...</p>
      </div>
    );
  }

  if (verificationResult) {
    return (
      <Card className="w-full max-w-lg bg-green-500/10 border-green-500 shadow-lg rounded-lg">
        <CardHeader className="flex-row items-center gap-4">
          <CheckCircle className="h-10 w-10 text-green-600 flex-shrink-0" />
          <div>
            <CardTitle className="text-green-800">Certificate Verified</CardTitle>
            <CardDescription className="text-green-700">This is a valid certificate issued by Education Pixel.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground">
          <p><strong>Student Name:</strong> {verificationResult.studentName}</p>
          <p><strong>Course:</strong> {verificationResult.courseName || verificationResult.testName}</p>
          <p><strong>Date of Exam:</strong> {format(new Date(verificationResult.submittedAt.seconds * 1000), "dd MMMM, yyyy")}</p>
          <p><strong>Certificate ID:</strong> {verificationResult.certificateId}</p>
        </CardContent>
      </Card>
    );
  }

  if (notFound) {
    return (
      <Card className="w-full max-w-lg bg-destructive/10 border-destructive shadow-lg rounded-lg">
        <CardHeader className="flex-row items-center gap-4">
          <XCircle className="h-10 w-10 text-destructive flex-shrink-0" />
          <div>
            <CardTitle className="text-destructive">Verification Failed</CardTitle>
            <CardDescription className="text-destructive/80">No certificate found with this ID.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive/90">Please check the Certificate ID and try again. Ensure the QR code is scanned correctly.</p>
           <Button variant="link" onClick={() => router.push('/verify-certificate')} className="p-0 h-auto mt-4">Verify another certificate</Button>
        </CardContent>
      </Card>
    );
  }
  
  // Initial state when no ID is provided in URL
  return (
    <Card className="w-full max-w-lg shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Certificate Verification</CardTitle>
          <CardDescription>Enter the Certificate ID below or scan the QR code on the document.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleManualVerify} className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="certificateId">Certificate ID</Label>
                    <Input 
                        id="certificateId"
                        type="text"
                        placeholder="e.g., CERT-2024-123456"
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Verify
                </Button>
            </form>
        </CardContent>
    </Card>
  )
}

export default function VerifyCertificatePage() {
  return (
    <>
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
        <div className="container py-16 sm:py-24 text-center">
          <h1 className="font-headline text-4xl font-bold sm:text-5xl">Verify Certificate<span className="text-purple-300">.</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-50">
            This page validates the authenticity of certificates issued by Education Pixel.
          </p>
        </div>
      </div>
      <div className="bg-secondary relative">
        <SectionDivider style="wave" className="text-gradient-to-br from-purple-900 via-blue-900 to-black" position="top"/>
        <div className="container py-16 sm:py-24 flex justify-center">
          <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
            <VerificationContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}
