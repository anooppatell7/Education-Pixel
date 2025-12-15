
import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mtechitinstitute.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/about',
    '/courses',
    '/blog',
    '/career',
    '/resources',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
    '/learn',
    '/mock-tests',
    '/exam',
    '/exam/register',
    '/exam/result',
    '/verify-certificate',
    '/reviews'
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : (route.includes('privacy') || route.includes('terms') ? 0.3 : 0.8),
  }));

  // NOTE: Dynamic routes (courses, blog posts) have been removed from here.
  // This is to prevent Firestore access during the build process on platforms like Vercel,
  // which causes permission errors. Search engines will discover these pages
  // through links on the site itself.

  return staticUrls;
}
