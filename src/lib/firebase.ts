

"use client";

import { collection, doc, getDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/firebase";
import type { SiteSettings, UserProgress, PopupSettings } from "./types";

// This file is now suitable for client-side data fetching.
// Ensure that any component using these functions is a client component.

export async function getBlogPostsByCategory(category: string) {
    if (!db) return [];
    const blogQuery = query(collection(db, "blog"), where("category", "==", category));
    const blogSnapshot = await getDocs(blogQuery);
    let posts = blogSnapshot.docs.map(doc => ({ slug: doc.id, ...doc.data() }));
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return posts;
}

export async function getPostsByTag(tag: string) {
    if (!db) return [];
    const q = query(collection(db, "blog"), where("tags", "array-contains", tag));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const snippet = data.content.replace(/<[^>]+>/g, '').substring(0, 150);
        return { 
            ...data, 
            slug: doc.id,
            summary: `${snippet}...` 
        };
    });
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return posts;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
    if (!db) return null;
    try {
        const docRef = doc(db, 'site_settings', 'announcement');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as SiteSettings;
        }
        return null;
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return null;
    }
}

export async function getPopupSettings(): Promise<PopupSettings | null> {
    if (!db) return null;
    try {
        const docRef = doc(db, 'site_settings', 'salesPopup');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as PopupSettings;
        }
        return null;
    } catch (error) {
        console.error("Error fetching popup settings:", error);
        return null;
    }
}

    