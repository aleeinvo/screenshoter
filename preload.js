const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

const captureDir = path.join(__dirname, 'captures');
const images = fs.readdirSync(captureDir)
    .map(fileName => {
        const src = path.join(captureDir, fileName);
        return {
            src,
            timestamp: fs.lstatSync(src).ctime
        }
    }).filter(file => {
        return fs.lstatSync(file.src).isFile() && path.extname(file.src) === '.png';
    })

contextBridge.exposeInMainWorld('electronAPI', {
    images,
    onScreenCapture: (callback) => ipcRenderer.on('screenshot-taken', callback)
})