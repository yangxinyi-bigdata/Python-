'use strict'

import { app, protocol, BrowserWindow } from 'electron'
const { exec } = require('child_process');
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

let flaskProcess;

// 检查应用是否在打包后的生产模式下运行
const isPackaged = require('electron').app.isPackaged;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // 开发模式下加载开发服务器的 URL
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // 生产模式下加载打包后的 index.html
    win.loadURL('app://./index.html')
  }

  // 启动 Flask 后端
  // const flaskAppPath = path + "/flask/app.py";

  // 根据是否打包，选择正确的路径
  const flaskAppPath = isPackaged 
    ? path.join(process.resourcesPath, 'app/app')  // 生产环境：使用资源路径
    : path.join(__dirname, '../app/app');          // 开发环境：直接定位到文件

console.log("Flask app path:", flaskAppPath);

  flaskProcess = exec(flaskAppPath, (error, stdout, stderr) => {
    if (error) {
      console.error(`启动 Flask 后端时出错：${error}`);
      return;
    }
    console.log(`Flask 后端输出：${stdout}`);
  });

  // 监听 Flask 后端的输出（可选）
  flaskProcess.stdout.on('data', (data) => {
    console.log(`Flask 输出：${data}`);
  });

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask 错误：${data}`);
  });
  
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  if (flaskProcess) {
    flaskProcess.kill();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})



// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
