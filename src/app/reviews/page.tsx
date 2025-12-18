
import type { Metadata } from 'next';
import ReviewPageClient from "@/components/reviews-page-client";
import SectionDivider from "@/components/section-divider";

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


export default function ReviewsPage() {
  
  return (
    <>
      <div className="bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600">
        <ReviewPageClient />
      </div>
      <div className="relative bg-secondary">
          <SectionDivider style="wave" className="text-gradient-to-br from-purple-600 via-blue-500 to-indigo-600" position="top"/>
          <div className="h-24"></div>
      </div>
    </>
  )
}
