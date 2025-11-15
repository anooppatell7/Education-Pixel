
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mtechitinstitute.in";

export const metadata: Metadata = {
  title: "Interactive Learning Courses - MTech IT Institute",
  description: "Start your interactive learning journey with MTech IT Institute. Access free courses on HTML, CSS, JavaScript, and more to build your skills from the ground up.",
  keywords: ["interactive learning", "free online courses", "learn to code", "html tutorial", "css tutorial", "javascript tutorial", "mtech it institute learn"],
  alternates: {
    canonical: `${siteUrl}/learn`,
  },
  openGraph: {
    title: "Interactive Learning Courses - MTech IT Institute",
    description: "Access free courses on HTML, CSS, JavaScript, and more to build your skills from the ground up at MTech IT Institute.",
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

    