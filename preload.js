console.log("preload.js", process.version);

const {contextBridge, ipcRenderer} = require("electron")

// contextBridge.exposeInMainWorld("abc", {xyz: 100})

contextBridge.exposeInMainWorld("myAPI", {
    saveFile: (data) => {
        ipcRenderer.send("file-save", data)  
    }, 
    readFile() {
        return ipcRenderer.invoke("file-read")
    }, 
    openDirectory: () => ipcRenderer.invoke('open-directory-dialog'), 
    openFile: () => ipcRenderer.invoke('open-file-dialog')

})