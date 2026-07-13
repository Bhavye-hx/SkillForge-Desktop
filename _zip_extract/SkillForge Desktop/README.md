# SkillForge Desktop App

A modern Electron desktop application with Firebase authentication and a beautiful dashboard interface.

## Features

- **Loading Screen**: Animated loading page with progress bar
- **Welcome Page**: Beautiful introduction with app features
- **Authentication**: Firebase-powered login/signup system
- **Dashboard**: Feature-rich dashboard with learning progress, career guidance, and health monitoring
- **Modern UI**: Clean design with white, sky blue, and light green theme

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Get your configuration from Project Settings
6. Update the `firebaseConfig` object in:
   - `src/auth.html`
   - `src/dashboard.html`

### 3. Run the Application
```bash
npm start
```

### 4. Enable Gemini Chat
Create a `.env` file in the project root and add your Gemini API key so the dashboard assistant can use Gemini Flash.

```env
GEMINI_API_KEY=your-api-key
```

Then start the app:

```bash
npm start
```

You can still use a system environment variable if you prefer, but `.env` is now supported directly by the app.

## Project Structure
```
SkillForge Desktop/
├── main.js              # Main Electron process
├── package.json          # Dependencies and scripts
├── firebase-config.js    # Firebase configuration template
└── src/
    ├── loading.html      # Loading screen
    ├── welcome.html      # Welcome/intro page
    ├── auth.html         # Login/Signup page
    └── dashboard.html    # Main dashboard
```

## Firebase Configuration

Replace the placeholder values in `auth.html` and `dashboard.html` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Development

- The app starts with a loading screen that automatically transitions to the welcome page
- Users can sign up or log in through the authentication page
- After successful authentication, users are redirected to the dashboard
- All user data is stored in Firebase Firestore

## Customization

- Modify colors in CSS variables for easy theme changes
- Update Firebase rules for production deployment
- Add additional pages by creating new HTML files and updating navigation

## Build for Production

To package the app for distribution:
```bash
npm install electron-builder --save-dev
npm run build
```
