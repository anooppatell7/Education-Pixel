
import React from "react";
import type { Metadata } from "next";
import CoursesClient from "@/components/courses-client";
import SectionDivider from "@/components/section-divider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export const metadata: Metadata = {
  title: "IT & Tech Courses | Education Pixel",
  description: "Explore top IT & tech courses like Web Development, Data Science, AI/ML, and DevOps. Get expert training at Education Pixel.",
  keywords: ["tech courses", "IT courses", "web development course", "data science course", "AI/ML course", "DevOps course", "job oriented courses"],
  alternates: {
    canonical: `${siteUrl}/courses`,
  },
  openGraph: {
    title: "IT & Tech Courses | Education Pixel",
    description: "Explore top IT & tech courses like Web Development, Data Science, and AI/ML. Get expert training at Education Pixel.",
    url: `${siteUrl}/courses`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "IT & Tech Courses | Education Pixel",
    description: "Explore top IT & tech courses like Web Development, Data Science, and AI/ML. Get expert training at Education Pixel.",
  },
};


export default function CoursesPage() {

  return (
    <>
      <div className="bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white">
        <div className="container py-16 sm:py-24 text-center">
          <h1 className="font-headline text-4xl font-bold sm:text-5xl">Our Professional Tech Courses<span className="text-teal-400">.</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Find the perfect job-oriented course to advance your skills and launch your career in the tech industry.
          </p>
        </div>
      </div>
      
      <div className="bg-secondary relative">
        <SectionDivider style="wave" className="text-blue-900/10" position="top"/>
        <div className="container py-16 sm:py-24">
          <CoursesClient />
        </div>
      </div>
    </>
  );
}
