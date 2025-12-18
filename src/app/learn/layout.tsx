
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export const metadata: Metadata = {
  title: "Video Learning Hub - Education Pixel",
  description: "Explore our curated video playlists on HTML, CSS, JavaScript, and more to build your skills from the ground up with expert-led tutorials.",
  keywords: ["video learning", "free online courses", "learn to code", "html tutorial", "css tutorial", "javascript tutorial", "education pixel videos"],
  alternates: {
    canonical: `${siteUrl}/learn`,
  },
  openGraph: {
    title: "Video Learning Hub - Education Pixel",
    description: "Access free, expert-led video courses on HTML, CSS, JavaScript, and more to build your skills from the ground up at Education Pixel.",
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
