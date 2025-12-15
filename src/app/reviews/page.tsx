
"use client";

import { db } from "@/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import type { Review } from "@/lib/types";
import type { Metadata } from 'next';
import ReviewPageClient from "@/components/reviews-page-client";
import SectionDivider from "@/components/section-divider";
import { useEffect, useState } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mtechitinstitute.in";

const metadata: Metadata = {
  title: "Student Reviews - MTech IT Institute",
  description: "See what our students are saying! Read reviews and testimonials about our computer courses and training in Patti, Pratapgarh.",
  keywords: ["student reviews mtech it institute", "mtech it institute testimonials", "computer course reviews patti"],
   alternates: {
    canonical: `${siteUrl}/reviews`,
  },
   openGraph: {
    title: "Student Reviews - MTech IT Institute",
    description: "See what our students are saying! Read reviews and testimonials about our computer courses and training.",
    url: `${siteUrl}/reviews`,
  },
};


export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getApprovedReviews() {
        if (!db) return;
        const reviewsQuery = query(
            collection(db, "reviews"),
            orderBy("submittedAt", "desc")
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviewList = reviewsSnapshot.docs
            .map(doc => {
                const data = doc.data();
                return { 
                    id: doc.id,
                    ...data,
                    submittedAt: data.submittedAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
                } as Review
            })
            .filter(review => review.isApproved);
        setReviews(reviewList);
        setLoading(false);
    }
    getApprovedReviews();
  }, []);
  
  return (
    <>
      <head>
          <title>{metadata.title as string}</title>
          <meta name="description" content={metadata.description as string} />
      </head>
      <div className="bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400">
        {loading ? <div>Loading...</div> : <ReviewPageClient reviews={reviews} />}
      </div>
      <div className="relative bg-secondary">
          <SectionDivider style="wave" className="text-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400" position="top"/>
          <div className="h-24"></div>
      </div>
    </>
  )
}

    