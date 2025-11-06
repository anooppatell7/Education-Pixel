
import type { Course, BlogPost, Resource, NavItem } from "@/lib/types";

export const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Courses", href: "/courses" },
  { title: "Learn", href: "/learn" },
  { title: "Blog", href: "/blog" },
  { title: "Career Guidance", href: "/career" },
  { title: "Resources", href: "/resources" },
  { title: "Contact", href: "/contact" },
];

// The data below is now managed in Firestore.
// These arrays are kept to prevent build errors in components that still reference them.
// They will be empty in the final, fully dynamic application.

export const courses: Course[] = [];

export const blogPosts: BlogPost[] = [];

export const resources: Resource[] = [];
