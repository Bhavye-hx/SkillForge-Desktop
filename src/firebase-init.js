// Firebase configuration for Electron with proper initialization
const firebaseConfig = {
    apiKey: "AIzaSyBpAWBzA5mF5_s8zcBqsQvjFpoyfzRM-aA",
    authDomain: "techsprint-40240.firebaseapp.com",
    projectId: "techsprint-40240",
    storageBucket: "techsprint-40240.firebasestorage.app",
    messagingSenderId: "692880588949",
    appId: "1:692880588949:web:f05f84c69d97511ca6db9c",
    measurementId: "G-50VW6Z2DZ7"
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
