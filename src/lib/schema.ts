
import type { Course, BlogPost } from './types';
import { WithContext, Organization, WebSite, Course as CourseSchema, BlogPosting, BreadcrumbList, ListItem } from 'schema-dts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://education-pixel.com';

export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Education Pixel',
  url: siteUrl,
  logo: 'https://res.cloudinary.com/dqycipmr0/image/upload/v1766031613/educationpixel_logo_j5nuwg.jpg',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-7355379619',
    contactType: 'Customer Service',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi'],
  },
  sameAs: [],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'bhavdaspur kota bhawaniganj',
    addressLocality: 'kunda pratapgarh',
    addressRegion: 'UP',
    postalCode: '230143',
    addressCountry: 'IN',
  },
};

export const websiteSchema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: 'Education Pixel',
    publisher: {
        '@type': 'Organization',
        name: 'Education Pixel',
        logo: {
            '@type': 'ImageObject',
            url: 'https://res.cloudinary.com/dqycipmr0/image/upload/v1766031613/educationpixel_logo_j5nuwg.jpg',
        },
    },
};

export const courseSchema = (course: Course): WithContext<CourseSchema> => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.title,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: 'Education Pixel',
    url: siteUrl,
  },
  image: course.image,
  courseCode: course.title.replace(/\s+/g, '-').toUpperCase(),
});
