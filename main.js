const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

loadLocalEnv();

const shouldDisableGpu = process.env.SKILLFORGE_DISABLE_GPU === '1';

if (shouldDisableGpu) {
  app.disableHardwareAcceleration();
}

const GEMINI_MODEL = 'gemini-2.5-flash';

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');

  if (!fs.existsSync(envPath)) {
    return;
  }

  const envFile = fs.readFileSync(envPath, 'utf8');

  for (const rawLine of envFile.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#eef6f1',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    show: false,
    frame: false,
    titleBarStyle: 'hidden'
  });

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.show();
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'loading.html'));

  // Grant camera/microphone permissions
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media' || permission === 'camera' || permission === 'microphone') {
      callback(true);
    } else {
      callback(false);
    }
  });

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => {
    if (permission === 'media' || permission === 'camera' || permission === 'microphone') {
      return true;
    }
    return false;
  });

  // Handle window controls
  ipcMain.on('window-minimize', () => {
    mainWindow.minimize();
  });
  
  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  
  ipcMain.on('window-close', () => {
    mainWindow.close();
  });

  // Fullscreen for secure test environment
  ipcMain.on('enter-fullscreen', () => {
    mainWindow.setFullScreen(true);
  });

  ipcMain.on('exit-fullscreen', () => {
    mainWindow.setFullScreen(false);
  });

  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send('fullscreen-left');
  });

  // Google OAuth popup
  ipcMain.handle('google-sign-in', async (_event, options = {}) => {
    return new Promise((resolve, reject) => {
      const authWin = new BrowserWindow({
        width: 500,
        height: 650,
        parent: mainWindow,
        modal: true,
        show: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      const clientId = '692880588949-pebev1u0oisn13oc7odkib9p13kt7m7l.apps.googleusercontent.com';
      const redirectUri = 'https://techsprint-40240.firebaseapp.com/__/auth/handler';
      const scope = 'openid email profile';
      const prompt = options && options.forceAccountPicker ? '&prompt=select_account' : '';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}${prompt}`;

      authWin.loadURL(authUrl);

      authWin.webContents.on('will-redirect', (event, url) => {
        handleOAuthCallback(url, authWin, resolve, reject);
      });

      authWin.webContents.on('will-navigate', (event, url) => {
        handleOAuthCallback(url, authWin, resolve, reject);
      });

      authWin.on('closed', () => {
        reject(new Error('Auth window closed'));
      });
    });
  });

  ipcMain.handle('gemini-chat', async (_event, payload = {}) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY. Add it to a .env file in the project root or set it in your system environment.');
    }

    const userMessage = typeof payload.message === 'string' ? payload.message.trim() : '';
    const history = Array.isArray(payload.history) ? payload.history : [];

    if (!userMessage) {
      throw new Error('Message cannot be empty.');
    }

    const contents = history
      .filter((entry) => entry && typeof entry.role === 'string' && typeof entry.text === 'string')
      .map((entry) => ({
        role: entry.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: entry.text }]
      }));

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'You are SkillForge AI, a concise and helpful learning assistant inside a desktop education app. Keep responses practical, friendly, and student-focused.'
              }
            ]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 512
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || 'Gemini request failed.';
      throw new Error(message);
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();

    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    return { text };
  });
}

function handleOAuthCallback(url, win, resolve, reject) {
  if (url.includes('/__/auth/handler') || url.includes('access_token')) {
    const urlObj = new URL(url);
    // Token may be in hash fragment
    const hash = urlObj.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    if (accessToken) {
      win.close();
      resolve({ accessToken });
    }
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
