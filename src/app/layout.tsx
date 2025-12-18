
import type { Metadata } from "next";
import { Poppins, Volkhov } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { getSiteSettings } from "@/lib/firebase";
import AnnouncementBar from "@/components/announcement-bar";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import FloatingWhatsApp from "@/components/floating-whatsapp";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const volkhov = Volkhov({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-volkhov",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

const faviconUrl = "https://res.cloudinary.com/dqycipmr0/image/upload/v1766033775/EP_uehxrf.png";

// This forces the layout to be dynamically rendered, ensuring data is always fresh
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Education Pixel - Premier Tech Institute for Modern Skills",
    template: "%s | Education Pixel",
  },
  description:
    "Join Education Pixel to master in-demand tech skills. We offer expert-led courses in Web Development, AI/ML, Data Science, DevOps, and more to launch your tech career.",
  keywords: [
    "tech institute",
    "coding bootcamp",
    "IT training",
    "learn to code",
    "web development course",
    "data science course",
    "AI/ML courses",
    "DevOps training",
    "Education Pixel",
  ],
  icons: {
    icon: faviconUrl,
    shortcut: faviconUrl,
    apple: faviconUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "Education Pixel - Premier Tech Institute for Modern Skills",
    description:
      "Join Education Pixel to master in-demand tech skills and launch your career.",
    images: [
      {
        url: faviconUrl,
        width: 1200,
        height: 630,
        alt: "Education Pixel Campus",
      },
    ],
    siteName: "Education Pixel",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education Pixel - Premier Tech Institute for Modern Skills",
    description:
      "Join Education Pixel to master in-demand tech skills and launch your career.",
    images: [
      faviconUrl,
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2296905809539851" crossOrigin="anonymous"></script>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          poppins.variable,
          volkhov.variable
        )}
      >
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <FirebaseClientProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingWhatsApp />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
