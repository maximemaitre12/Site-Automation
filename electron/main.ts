import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import { initDatabase, registerDbHandlers } from './handlers/db.handler'
import { registerScraperHandlers } from './handlers/scraper.handler'
import { registerAiHandlers } from './handlers/ai.handler'
import { registerAnalyticsHandlers } from './handlers/analytics.handler'

// electron-vite injects MAIN_WINDOW_VITE_DEV_SERVER_URL in dev mode
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 650,
    frame: true,
    backgroundColor: '#0d0d0f',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // CSP headers
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://api.anthropic.com",
        ],
      },
    })
  })

  if (isDev && typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== 'undefined') {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  const db = initDatabase()

  registerDbHandlers(ipcMain, db)
  registerScraperHandlers(ipcMain)
  registerAiHandlers(ipcMain, db)
  registerAnalyticsHandlers(ipcMain, db)

  // System: open external URLs safely
  ipcMain.handle('system:openExternal', async (_event, url: string) => {
    const allowedPrefixes = [
      'https://www.work.ua', 'https://robota.ua', 'https://djinni.co',
      'https://hh.ua', 'https://ua.hh.ru', 'https://console.anthropic.com',
    ]
    const isAllowed = allowedPrefixes.some(prefix => url.startsWith(prefix))
    if (isAllowed) {
      await shell.openExternal(url)
      return { success: true }
    }
    return { success: false, error: 'URL non autorisée' }
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
