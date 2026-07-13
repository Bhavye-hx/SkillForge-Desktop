# Firebase Setup Instructions

## Current Error: auth/configuration-not-found

This error means Authentication is not properly enabled in your Firebase project. Follow these steps:

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `skillforge-1c07c`
3. Click on **Authentication** in the left sidebar
4. Click **Get started** if you haven't set it up yet
5. Go to **Sign-in method** tab
6. Enable **Email/Password** provider:
   - Click on Email/Password
   - Toggle **Enable** to ON
   - Click **Save**

### 2. Enable Firestore Database
1. In Firebase Console, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (closest to you)
5. Click **Done**

### 3. Configure Security Rules (Optional for testing)
In Firestore Database > Rules, you can use these test rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Verify Configuration
Your current config looks correct:
- Project ID: skillforge-1c07c
- API Key: AIzaSyAaoUIwYSTO_JibEJ-Qf8SleuwcUMWibFs
- Auth Domain: skillforge-1c07c.firebaseapp.com

### 5. No Client ID/Secret Needed
Firebase Web SDK only needs the configuration object you already have. Client ID and secret are for server-side applications.

### 6. Test the Setup
After enabling Authentication:
1. Restart your Electron app
2. Try to create an account on the signup page
3. The error should be resolved

### Troubleshooting
If you still get errors:
1. Check Firebase Console > Project Settings > General tab
2. Verify your configuration matches exactly
3. Make sure Authentication is enabled
4. Try creating a test user manually in Firebase Console > Authentication > Users