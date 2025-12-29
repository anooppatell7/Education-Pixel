
import { MetadataRoute } from 'next';
 
const siteUrl = 'https://www.educationpixel.site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/franchise/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
