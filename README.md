# SkillForge — Student Skill Development Desktop App

A cross-platform Electron desktop application built for academic upskilling. SkillForge provides students with a centralized portal to access learning paths, track progress, take assessments, monitor health, and get AI-powered guidance — all in one place.

---

## Features

- **Firebase Authentication** — Email/password login, signup, and Google Sign-In via OAuth popup
- **Student Dashboard** — XP tracking, course completion, leaderboard, and semester progress
- **Learning Paths** — Curriculum-mapped modules with Python courses and college-specific content
- **Secure Test Environment** — Fullscreen-locked assessment mode to prevent cheating
- **Career Guidance** — Dedicated career planning page
- **Health Monitoring** — Study/rest/sleep balance tracking and cognitive load indicators
- **AI Assistant** — Powered by Google Gemini 2.5 Flash for student-focused learning support
- **Custom Titlebar** — Frameless window with custom minimize/maximize/close controls

---

## Tech Stack

- **Electron** — Desktop shell
- **Firebase** — Authentication + Firestore database
- **Google Gemini API** — AI chat assistant
- **Vanilla JS + HTML/CSS** — Frontend (no framework)

---

## Project Structure

```
SkillForge/
├── main.js                  # Main Electron process, IPC handlers, Google OAuth
├── package.json
├── firebase-config.js       # Firebase config reference
├── .env                     # Local environment variables (not committed)
├── .env.example             # Example env file
└── src/
    ├── loading.html         # Animated loading screen
    ├── welcome.html         # Welcome / intro page
    ├── auth-new.html        # Login & signup page
    ├── navigation.html      # Post-login navigation hub
    ├── dashboard-final.html # Main student dashboard
    ├── career.html          # Career guidance page
    ├── health.html          # Health & wellness tracker
    ├── firebase-init.js     # Firebase initialization script
    ├── window-controls.css  # Custom titlebar styles
    └── learning/
        ├── index.html           # Learning hub
        ├── python.html          # Python course
        ├── pythonhub.html       # Python learning hub
        ├── pythonlearn.html     # Python lessons
        ├── college_courses.html # College-specific courses
        ├── student_dashboard.html
        ├── assessment_env.html  # Secure test environment
        ├── test_environment.html
        └── admin.html           # Admin panel
```

---

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and open your project
2. Enable **Authentication** → Sign-in methods: **Email/Password** and **Google**
3. Enable **Firestore Database**
4. Update `src/firebase-init.js` with your project's config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

5. Update the Google OAuth `clientId` and `redirectUri` in `main.js`:

```javascript
const clientId = 'your-oauth-client-id.apps.googleusercontent.com';
const redirectUri = 'https://your-project.firebaseapp.com/__/auth/handler';
```

> Get the Web Client ID from Firebase Console → Authentication → Sign-in method → Google → Web SDK configuration.

### 3. Gemini AI Setup

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your-gemini-api-key
```

Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run the App

```bash
npm start
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for the AI assistant |
| `SKILLFORGE_DISABLE_GPU` | Set to `1` to disable GPU acceleration if you see GPU errors |

---

## Build for Distribution

```bash
npm install electron-builder --save-dev
npm run build
```

---

## Notes

- The app uses a **frameless window** — do not remove the custom titlebar controls
- The secure test environment locks the window to **fullscreen** and listens for exit attempts
- Firestore writes use `merge: true` so existing user data is never overwritten on login
