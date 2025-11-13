
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { MockTest, TestResult } from "@/lib/types";
import type { Metadata } from 'next';
import MockTestsClient from "@/components/mock-tests-client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { auth } from "firebase-admin";
import { cookies } from "next/headers";


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mtechitinstitute.in";

export const metadata: Metadata = {
  title: "Mock Tests - MTech IT Institute",
  description: "Test your skills with our online mock tests. Prepare for exams and real-world scenarios with timed practice tests on various IT subjects.",
  keywords: ["mock tests", "online practice tests", "it exam preparation", "coding quiz", "programming tests"],
   alternates: {
    canonical: `${siteUrl}/mock-tests`,
  },
   openGraph: {
    title: "Mock Tests - MTech IT Institute",
    description: "Test your skills with our online mock tests for various IT subjects.",
    url: `${siteUrl}/mock-tests`,
  },
};

// This forces the page to be dynamically rendered
export const revalidate = 0;

async function getPublishedMockTests(): Promise<MockTest[]> {
    const testsQuery = query(
        collection(db, "mockTests"),
        where("isPublished", "==", true)
    );
    const testsSnapshot = await getDocs(testsQuery);
    const testList = testsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MockTest));
    return testList;
}

async function getUserResults(userId: string): Promise<TestResult[]> {
    if (!userId) return [];
    try {
        const resultsQuery = query(
            collection(db, 'testResults'),
            where('userId', '==', userId)
        );
        const resultsSnapshot = await getDocs(resultsQuery);
        return resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestResult));
    } catch (error) {
        console.error("Failed to fetch user results:", error);
        return [];
    }
}

// Helper to get user ID from session cookie
async function getUserIdFromSession(): Promise<string | null> {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return null;

    try {
        // This requires firebase-admin setup on the backend, which we assume exists
        // For a client-component driven approach, this would be handled differently.
        // As this is a server component, we'll outline the server-side verification logic.
        // NOTE: A full admin SDK setup is beyond this component's scope.
        // This is a placeholder for a real implementation.
        // In a real app, you would have a backend endpoint or use NextAuth/Kinde to verify this.
        // For this context, we will simulate getting a user ID. Let's try another way.
        // The Kinde session is easier to use here.
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        return user?.id || null;

    } catch (error) {
        console.error("Session verification failed:", error);
        return null;
    }
}


export default async function MockTestsPage() {
    const mockTests = await getPublishedMockTests();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // In a real Firebase Auth app, we'd verify the token. Kinde is used here.
    const userId = user?.id || null;
    const userResults = userId ? await getUserResults(userId) : [];

    return (
        <MockTestsClient mockTests={mockTests} userResults={userResults} />
    );
}
