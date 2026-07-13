// Firebase configuration for Electron with proper initialization
const firebaseConfig = {
    apiKey: "AIzaSyAaoUIwYSTO_JibEJ-Qf8SleuwcUMWibFs",
    authDomain: "skillforge-1c07c.firebaseapp.com",
    projectId: "skillforge-1c07c",
    storageBucket: "skillforge-1c07c.firebasestorage.app",
    messagingSenderId: "246800623841",
    appId: "1:246800623841:web:67994cb0a958ca292defa0",
    measurementId: "G-HET9CWW79Z"
};

function initializeFirebase() {
    if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
        try {
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
}

// Make config available globally
window.firebaseConfig = firebaseConfig;
