
import type { LearningModule } from "./types";

export const learningModules: LearningModule[] = [
    {
        slug: 'html',
        title: 'HTML Foundations',
        description: 'Learn the structure of the web. Build and structure websites from scratch.',
        difficulty: 'Beginner',
        icon: '📄',
        chapters: [
            {
                slug: 'introduction',
                title: 'Chapter 1: Introduction to HTML',
                lessons: [
                    { slug: 'what-is-html', title: 'What is HTML?', theory: '...' },
                    { slug: 'html-document-structure', title: 'HTML Document Structure', theory: '...' },
                    { slug: 'first-web-page', title: 'Your First Web Page', theory: '...' },
                ]
            },
            {
                slug: 'text-formatting',
                title: 'Chapter 2: Text Formatting',
                lessons: [
                    { slug: 'headings-and-paragraphs', title: 'Headings and Paragraphs', theory: '...' },
                    { slug: 'bold-italic-underline', title: 'Bold, Italic, and Underline', theory: '...' },
                ]
            },
        ]
    },
    {
        slug: 'css',
        title: 'CSS Styling',
        description: 'Style your websites and bring your designs to life with modern CSS.',
        difficulty: 'Beginner',
        icon: '🎨',
        chapters: []
    },
    {
        slug: 'javascript',
        title: 'JavaScript Essentials',
        description: 'Make your websites interactive and dynamic with the web\'s most popular language.',
        difficulty: 'Intermediate',
        icon: '⚡',
        chapters: []
    },
    {
        slug: 'python',
        title: 'Python for Beginners',
        description: 'Start your journey into programming with the versatile and powerful Python.',
        difficulty: 'Beginner',
        icon: '🐍',
        chapters: []
    },
    {
        slug: 'sql',
        title: 'SQL Database Basics',
        description: 'Learn to manage and query data from databases, a fundamental skill for any developer.',
        difficulty: 'Beginner',
        icon: '🗃️',
        chapters: []
    }
]
