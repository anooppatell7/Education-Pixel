
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
                    { slug: 'what-is-html', title: 'What is HTML?', theory: '<p>HTML stands for HyperText Markup Language. It is the standard markup language for creating Web pages.</p><p>HTML describes the structure of a Web page and consists of a series of elements. HTML elements tell the browser how to display the content.</p>' },
                    { slug: 'html-document-structure', title: 'HTML Document Structure', theory: '<p>An HTML document has a basic structure that includes a `<!DOCTYPE html>` declaration, and `<html>`, `<head>`, and `<body>` elements.</p><pre><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n  &lt;title&gt;Page Title&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n\n  &lt;h1&gt;My First Heading&lt;/h1&gt;\n  &lt;p&gt;My first paragraph.&lt;/p&gt;\n\n&lt;/body&gt;\n&lt;/html&gt;</code></pre>' },
                    { slug: 'first-web-page', title: 'Your First Web Page', theory: '<p>To create a web page, you can use a simple text editor. Save the file with a `.html` extension. Open the saved file in a web browser to see your page.</p>' },
                ]
            },
            {
                slug: 'basic-elements',
                title: 'Chapter 2: Basic Elements',
                lessons: [
                    { slug: 'headings', title: 'Headings', theory: '<p>HTML headings are defined with the `<h1>` to `<h6>` tags.</p><p>`<h1>` defines the most important heading. `<h6>` defines the least important heading.</p>' },
                    { slug: 'paragraphs', title: 'Paragraphs', theory: '<p>HTML paragraphs are defined with the `<p>` tag.</p><pre><code>&lt;p&gt;This is a paragraph.&lt;/p&gt;</code></pre>' },
                    { slug: 'links', title: 'Links', theory: '<p>HTML links are defined with the `<a>` tag. The link\'s destination is specified in the `href` attribute.</p><pre><code>&lt;a href="https://www.example.com"&gt;This is a link&lt;/a&gt;</code></pre>' },
                    { slug: 'images', title: 'Images', theory: '<p>HTML images are defined with the `<img>` tag. The source file (`src`), alternative text (`alt`), `width`, and `height` are provided as attributes.</p><pre><code>&lt;img src="img_girl.jpg" alt="Girl in a jacket" width="500" height="600"&gt;</code></pre>' },
                ]
            },
             {
                slug: 'text-formatting',
                title: 'Chapter 3: Text Formatting',
                lessons: [
                    { slug: 'bold-italic', title: 'Bold and Italic Text', theory: '<p>Use `<strong>` for important text (bold) and `<em>` for emphasized text (italic).</p><pre><code>&lt;strong&gt;This text is important!&lt;/strong&gt;\n&lt;em&gt;This text is emphasized.&lt;/em&gt;</code></pre>' },
                    { slug: 'sub-sup', title: 'Subscript & Superscript', theory: '<p>Use `<sub>` for subscript and `<sup>` for superscript text.</p><pre><code>&lt;p&gt;This is &lt;sub&gt;subscripted&lt;/sub&gt; text.&lt;/p&gt;\n&lt;p&gt;This is &lt;sup&gt;superscripted&lt;/sup&gt; text.&lt;/p&gt;</code></pre>' },
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
        chapters: [
            {
                slug: 'introduction',
                title: 'Chapter 1: Introduction to CSS',
                lessons: [
                    { slug: 'what-is-css', title: 'What is CSS?', theory: '<p>CSS stands for Cascading Style Sheets. It describes how HTML elements are to be displayed on screen, paper, or in other media. CSS saves a lot of work. It can control the layout of multiple web pages all at once.</p>' },
                    { slug: 'css-syntax', title: 'CSS Syntax', theory: '<p>A CSS rule consists of a selector and a declaration block. The selector points to the HTML element you want to style. The declaration block contains one or more declarations separated by semicolons. Each declaration includes a CSS property name and a value, separated by a colon.</p><pre><code>selector {\n  property: value;\n}</code></pre>' },
                    { slug: 'css-selectors', title: 'CSS Selectors', theory: '<p>CSS selectors are used to "find" (or select) the HTML elements you want to style. We can divide CSS selectors into five categories: Simple selectors (select elements based on name, id, class), Combinator selectors, Pseudo-class selectors, Pseudo-elements selectors, and Attribute selectors.</p>' },
                ]
            },
            {
                slug: 'styling-text',
                title: 'Chapter 2: Styling Text',
                lessons: [
                     { slug: 'css-colors', title: 'Colors', theory: '<p>Colors in CSS can be specified using predefined color names, or RGB, HEX, HSL, RGBA, HSLA values.</p><pre><code>p {\n  color: red;\n  background-color: #f0f0f0;\n}</code></pre>' },
                     { slug: 'text-alignment', title: 'Text Alignment', theory: '<p>The `text-align` property is used to set the horizontal alignment of a text. Text can be centered, or aligned to the left or right, or justified.</p>' },
                ]
            }
        ]
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
