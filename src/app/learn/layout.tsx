
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export const metadata: Metadata = {
  title: "Interactive Learning Courses - Education Pixel",
  description: "Start your interactive learning journey with Education Pixel. Access free courses on HTML, CSS, JavaScript, and more to build your skills from the ground up.",
  keywords: ["interactive learning", "free online courses", "learn to code", "html tutorial", "css tutorial", "javascript tutorial", "education pixel learn"],
  alternates: {
    canonical: `${siteUrl}/learn`,
  },
  openGraph: {
    title: "Interactive Learning Courses - Education Pixel",
    description: "Access free courses on HTML, CSS, JavaScript, and more to build your skills from the ground up at Education Pixel.",
    url: `${siteUrl}/learn`,
  },
};

export default function LearnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
