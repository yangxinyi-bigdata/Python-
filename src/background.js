'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
const { exec } = require('child_process');
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')
const fs = require('fs')

let flaskProcess;

function writeFile(event, data) {
  fs.writeFileSync("/Users/yangxinyi/Downloads/201_临时文件夹/hello.txt", data)
}

function readFile(event) {
  const res = fs.readFileSync("/Users/yangxinyi/Downloads/201_临时文件夹/hello.txt", "utf8")
  console.log("$$$", res)
  return fs.readFileSync("/Users/yangxinyi/Downloads/201_临时文件夹/hello.txt", "utf8")
}

ipcMain.handle('open-directory-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result
})

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile']
  })
  return result
})

// 检查应用是否在打包后的生产模式下运行
const isPackaged = require('electron').app.isPackaged;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  // 创建浏览器窗口
  console.log("__dirname:" + __dirname);
  // 动态设置 preload 脚本路径
  const preloadPath = isPackaged 
    ? path.join(process.resourcesPath, 'preload.js')  // 生产环境
    : path.resolve(__dirname, 'preload.js');        // 开发环境

  console.log("Preload script path:", preloadPath);
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      
      preload: preloadPath,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  ipcMain.on("file-save", writeFile)
  ipcMain.handle("file-read", readFile)

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

// console.log("Flask app path:", flaskAppPath);

//   flaskProcess = exec(flaskAppPath, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`启动 Flask 后端时出错：${error}`);
//       return;
//     }
//     console.log(`Flask 后端输出：${stdout}`);
//   });

//   // 监听 Flask 后端的输出（可选）
//   flaskProcess.stdout.on('data', (data) => {
//     console.log(`Flask 输出：${data}`);
//   });

//   flaskProcess.stderr.on('data', (data) => {
//     console.error(`Flask 错误：${data}`);
//   });
  
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
