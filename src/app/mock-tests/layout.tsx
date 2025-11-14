
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mtechitinstitute.in";

export const metadata: Metadata = {
  title: "Online Mock Tests",
  description: "Prepare for your exams with our online mock tests. Practice questions for various computer courses and improve your skills.",
  alternates: {
    canonical: `${siteUrl}/mock-tests`,
  },
  openGraph: {
    title: "Online Mock Tests - MTech IT Institute",
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
