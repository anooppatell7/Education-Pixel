
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mtechitinstitute.in";

export const metadata: Metadata = {
  title: "Interactive Learning Courses",
  description: "Start your interactive learning journey with MTech IT Institute. Access courses on HTML, CSS, JavaScript, and more to build your skills from the ground up.",
  alternates: {
    canonical: `${siteUrl}/learn`,
  },
  openGraph: {
    title: "Interactive Learning Courses - MTech IT Institute",
    description: "Access courses on HTML, CSS, JavaScript, and more to build your skills.",
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
