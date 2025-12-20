
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Resource } from "@/lib/types";
import AdPlaceholder from "@/components/ad-placeholder";
import type { Metadata } from 'next';
import ResourcesClient from "@/components/resources-client";
import SectionDivider from "@/components/section-divider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export const metadata: Metadata = {
  title: "Free Student Resources (PDF, Notes) - Education Pixel",
  description: "Access and download free student resources from Education Pixel, including PDF notes, worksheets, and quizzes for computer courses.",
  keywords: ["free student resources", "computer course notes pdf", "it course study material", "education pixel resources"],
  alternates: {
    canonical: `${siteUrl}/resources`,
  },
  openGraph: {
    title: "Free Student Resources (PDF, Notes) - Education Pixel",
    description: "Access and download free student resources from Education Pixel, including PDF notes, worksheets, and quizzes.",
    url: `${siteUrl}/resources`,
  },
};

async function getResources(): Promise<Resource[]> {
    if (!db) return [];
    const resourcesCollection = collection(db, "resources");
    const resourceSnapshot = await getDocs(resourcesCollection);
    return resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
}


export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <>
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
        <div className="container py-16 sm:py-24 text-center">
          <h1 className="font-headline text-4xl font-bold sm:text-5xl">Free Resources<span className="text-purple-300">.</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-50">
            Access free materials like PDF notes, worksheets, and quizzes to support your learning journey with us.
          </p>
        </div>
      </div>

      <div className="bg-secondary relative">
        <SectionDivider style="wave" className="text-gradient-to-br from-purple-900 via-blue-900 to-black" position="top"/>
        <div className="container py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <main className="lg:col-span-3">
                  <ResourcesClient resources={resources} />
              </main>
              <aside className="lg:col-span-1 space-y-8">
                  <AdPlaceholder />
              </aside>
          </div>
        </div>
      </div>
    </>
  );
}
