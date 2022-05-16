const { app, BrowserWindow} = require('electron');
const path = require('path');
const CaptureService = require('./services/captureService');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 1024,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

    const captureService = new CaptureService(mainWindow);

    captureService.start();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})