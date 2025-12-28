
import type { Metadata } from 'next';
import { db } from '@/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import ReviewPageClient from "@/components/reviews-page-client";
import SectionDivider from "@/components/section-divider";
import type { Review } from '@/lib/types';


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export const metadata: Metadata = {
  title: "Student Reviews - Education Pixel",
  description: "See what our students are saying! Read reviews and testimonials about our computer courses and training in Patti, Pratapgarh.",
  keywords: ["student reviews education pixel", "education pixel testimonials", "computer course reviews patti"],
   alternates: {
    canonical: `${siteUrl}/reviews`,
  },
   openGraph: {
    title: "Student Reviews - Education Pixel",
    description: "See what our students are saying! Read reviews and testimonials about our computer courses and training.",
    url: `${siteUrl}/reviews`,
  },
};

async function getReviews(): Promise<Review[]> {
  if (!db) return [];
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("isApproved", "==", true),
    orderBy("submittedAt", "desc")
  );
  const reviewsSnapshot = await getDocs(reviewsQuery);
  return reviewsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Pass the raw timestamp to the client component
      submittedAt: data.submittedAt,
    } as Review;
  });
}


export default async function ReviewsPage() {
  const reviews = await getReviews();
  
  return (
    <>
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <ReviewPageClient reviews={reviews} />
      </div>
      <div className="relative bg-secondary">
          <SectionDivider style="wave" className="text-gradient-to-br from-purple-900 via-blue-900 to-black" position="top"/>
          <div className="h-24"></div>
      </div>
    </>
  )
}
