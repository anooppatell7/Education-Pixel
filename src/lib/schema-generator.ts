
import type { BlogPost, HowToSchema, FAQPageSchema } from './types';
import { WithContext, BlogPosting, BreadcrumbList } from 'schema-dts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://education-pixel.com';

// Helper function to remove HTML tags
const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>?/gm, '');
};

// Base schema for any post type
const getBaseSchema = (post: BlogPost) => ({
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/blog/${post.slug}`,
    },
    headline: post.title,
    description: stripHtml(post.content).substring(0, 160),
    image: post.image,
    author: {
        '@type': 'Person',
        name: post.author,
    },
    publisher: {
        '@type': 'Organization',
        name: 'Education Pixel',
        logo: {
            '@type': 'ImageObject',
            url: 'https://res.cloudinary.com/dzr4xjizf/image/upload/v1757138798/mtechlogo_1_wsdhhx.png',
        },
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    articleSection: post.category,
    keywords: post.tags?.join(', '),
});

// Generates FAQPage Schema
const generateFaqSchema = (post: BlogPost): WithContext<FAQPageSchema> => {
    const questions = [];
    const questionRegex = /<h[2-4][^>]*>Q\s?[:.]?(.+?)<\/h[2-4]>/gi;
    let match;

    while ((match = questionRegex.exec(post.content)) !== null) {
        const questionText = stripHtml(match[1]).trim();
        const answerStartIndex = match.index + match[0].length;
        const nextQuestionMatch = questionRegex.exec(post.content);
        const answerEndIndex = nextQuestionMatch ? nextQuestionMatch.index : post.content.length;
        questionRegex.lastIndex = answerStartIndex; // Reset index for next iteration

        const answerHtml = post.content.substring(answerStartIndex, answerEndIndex).trim();

        questions.push({
            '@type': 'Question',
            name: questionText,
            acceptedAnswer: {
                '@type': 'Answer',
                text: stripHtml(answerHtml),
            },
        });
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        ...getBaseSchema(post),
        mainEntity: questions,
    };
};

// Generates HowTo Schema
const generateHowToSchema = (post: BlogPost): WithContext<HowToSchema> => {
    const steps = [];
    const stepRegex = /<ol>(.*?)<\/ol>/is;
    const liRegex = /<li>(.*?)<\/li>/g;
    
    const olMatch = post.content.match(stepRegex);

    if (olMatch) {
        let liMatch;
        while ((liMatch = liRegex.exec(olMatch[1])) !== null) {
            steps.push({
                '@type': 'HowToStep',
                text: stripHtml(liMatch[1]).trim(),
            });
        }
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        ...getBaseSchema(post),
        name: post.title,
        step: steps,
        totalTime: 'PT10M', // Placeholder, could be extracted if available
        estimatedCost: { // Placeholder
            '@type': 'MonetaryAmount',
            currency: 'INR',
            value: '0'
        }
    };
};

// Generates standard Article/BlogPosting Schema
const generateArticleSchema = (post: BlogPost): WithContext<BlogPosting> => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    ...getBaseSchema(post),
});


export function generatePostSchema(post: BlogPost): WithContext<BlogPosting | HowToSchema | FAQPageSchema> {
    if (post.schemaType === 'FAQ' || /<h[2-4][^>]*>Q\s?[:.]?/gi.test(post.content)) {
        return generateFaqSchema(post);
    }

    if (post.schemaType === 'HowTo' || /<ol>.*?<\/ol>/is.test(post.content)) {
        return generateHowToSchema(post);
    }
    
    return generateArticleSchema(post);
}

export const breadcrumbSchema = (items: { name: string; href: string }[]): WithContext<BreadcrumbList> => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${siteUrl}${item.href}`,
    })),
});
