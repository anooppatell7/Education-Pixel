
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export const metadata: Metadata = {
  title: "Online Mock Tests for Computer Courses - Education Pixel",
  description: "Prepare for your computer course exams with our free online mock tests. Practice questions for CCC, Tally, Web Development, and more to improve your skills and score.",
  keywords: ["online mock tests", "computer course exam", "practice test", "ccc mock test", "tally practice test", "education pixel tests"],
  alternates: {
    canonical: `${siteUrl}/mock-tests`,
  },
  openGraph: {
    title: "Online Mock Tests for Computer Courses - Education Pixel",
    description: "Prepare for your exams with our online mock tests for various computer courses.",
    url: `${siteUrl}/mock-tests`,
  },
};

export default function MockTestsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
