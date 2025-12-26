"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import SectionDivider from '@/components/section-divider';
import type { ExamResult } from '@/lib/types';
import { format } from 'date-fns';

function VerificationContent() {
  const searchParams = useSearchParams();
  const certificateId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<ExamResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!certificateId) {
      setIsLoading(false);
      // This case is handled by the main component render logic
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
        </CardContent>
      </Card>
    );
  }
  
  // Initial state when no ID is provided in URL
  return (
    <Card className="w-full max-w-lg shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Certificate Verification</CardTitle>
          <CardDescription>To verify a certificate, please scan the QR code on the document. This page will automatically display the verification status.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground text-center">Waiting for a certificate ID...</p>
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
