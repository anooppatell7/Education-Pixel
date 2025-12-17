
import LearnSidebar from "@/components/learn/sidebar";
import { getCourseData } from "@/lib/learn-helpers";
import type { Metadata } from 'next';

type Props = {
  params: { slug: string }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourseData(params.slug)

  if (!course) {
    return {
      title: 'Course not found'
    }
  }

  return {
    title: `Learn ${course.title}`,
    description: `Start learning ${course.title}. ${course.description}`,
    alternates: {
      canonical: `${siteUrl}/learn/${params.slug}`,
    },
    openGraph: {
      title: `Learn ${course.title} | Education Pixel`,
      description: course.description,
      url: `${siteUrl}/learn/${params.slug}`,
    },
  }
}


export default function LearnCourseLayout({ 
    children,
    params 
}: { 
    children: React.ReactNode,
    params: { slug: string }
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <LearnSidebar courseSlug={params.slug} />
      <main className="flex-1 bg-secondary/50 dark:bg-background p-6 sm:p-8 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
