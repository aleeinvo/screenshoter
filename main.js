const { app, BrowserWindow, desktopCapturer, screen } = require('electron');
const path = require('path');
const fs = require('fs');

function captureScreen(mainWindow) {
    desktopCapturer.getSources(
        {
            types: ['window', 'screen'],
            thumbnailSize: screen.getPrimaryDisplay().workAreaSize
        }
    ).then(async sources => {
        const entireScreen = sources.find(source => {
            return source.name == 'Entire Screen';
        });

        // mainWindow.webContents.send('screenshot-taken', entireScreen.thumbnail.toDataURL());

        // console.log(entireScreen.thumbnail.toDataURL());

        const imageContents = Buffer.from(entireScreen.thumbnail.toPNG(), 'base64');

        const captureDir = path.join(__dirname, 'captures');

        if(!fs.existsSync(captureDir)) {
            fs.mkdirSync(captureDir);
        }

        const capturePath = path.join(__dirname, `captures/${Date.now()}.png`);
        fs.writeFile(capturePath, imageContents, error => {
            if (error) {
                console.log(error.message);
                return;
            }

            mainWindow.webContents.send('screenshot-taken', {
                src: capturePath,
                timestamp: fs.lstatSync(capturePath).ctime
            });
        });
    });
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 1024,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

    setInterval(captureScreen, 5000, mainWindow);
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