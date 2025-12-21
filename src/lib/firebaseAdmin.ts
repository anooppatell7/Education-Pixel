
import admin from 'firebase-admin';

function getAdminConfig() {
    if (process.env.FIREBASE_ADMIN_CONFIG) {
        try {
            return JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);
        } catch (e) {
            console.error("Could not parse FIREBASE_ADMIN_CONFIG. Please check the format.", e);
            throw new Error("Invalid Firebase Admin configuration provided in environment variables.");
        }
    }

    // Fallback for local development if the single env var is not set
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        return {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };
    }
    
    return null;
}

const adminConfig = getAdminConfig();

if (!admin.apps.length) {
    if (adminConfig) {
        admin.initializeApp({
            credential: admin.credential.cert(adminConfig),
        });
    } else {
        // This will log in development but might throw in production if not configured.
        // Vercel logs will show this, guiding the user to set up env vars.
        console.warn("Firebase Admin SDK not initialized. Missing FIREBASE_ADMIN_CONFIG or individual Firebase Admin environment variables.");
    }
}


export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;

if (!admin.apps.length) {
    // This provides a clearer runtime error if the admin app couldn't be initialized.
    // We create dummy objects that will throw an error if used.
    const initializationError = () => { throw new Error("Firebase Admin SDK is not initialized. Check your server environment variables."); };
    
    // @ts-ignore
    module.exports.adminDb = { firestore: initializationError };
    // @ts-ignore
    module.exports.adminAuth = { auth: initializationError };
}
