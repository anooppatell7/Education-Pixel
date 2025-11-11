
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { MockTest } from "@/lib/types";
import type { Metadata } from 'next';
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, Clock, ArrowRight } from "lucide-react";

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

export default async function MockTestsPage() {
    const mockTests = await getPublishedMockTests();

    return (
        <div className="bg-secondary">
            <div className="container py-16 sm:py-24">
                <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl">Online Mock Tests</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-primary/80">
                        Sharpen your skills and prepare for success with our collection of mock tests.
                    </p>
                </div>
                
                {mockTests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mockTests.map((test) => (
                            <Card key={test.id} className="flex flex-col shadow-sm hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="font-headline text-xl text-primary">{test.title}</CardTitle>
                                    <CardDescription className="line-clamp-3">{test.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <ListChecks className="h-4 w-4" />
                                            <span>{test.questions?.length || 0} Questions</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{test.duration} minutes</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`/mock-tests/${test.id}`}>
                                            Start Test <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center text-muted-foreground">
                            <p className="text-lg">No mock tests are available at the moment.</p>
                            <p className="mt-2 text-sm">Please check back later for new practice tests.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
