const { desktopCapturer, screen, app } = require('electron');
const fs = require('fs');
const path = require('path');

module.exports = class CaptureService {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.basePath = app.getAppPath();
    }

    start(duration = 10000) {
        setInterval(() => {
            this.captureScreen();
        }, duration);
    }

    storeCapture(capture){
        const capturePath = path.join(this.basePath, `captures/shot-${Date.now()}.png`);
    
        fs.writeFile(capturePath, capture.thumbnail.toPNG(), error => {
            if (error) {
                console.log(error.message);
                return;
            }
    
            this.mainWindow.webContents.send('screenshot-taken', {
                src: capturePath,
                timestamp: fs.lstatSync(capturePath).ctime
            });
        });
    }

    captureScreen() {
        desktopCapturer.getSources(
            {
                types: ['window', 'screen'],
                thumbnailSize: screen.getPrimaryDisplay().workAreaSize
            }
        ).then(async sources => {
            const captureDir = path.join(this.basePath, 'captures');
    
            if (!fs.existsSync(captureDir)) {
                fs.mkdirSync(captureDir);
            }
    
            sources.filter(source => {
                return source.name === 'Entire Screen' || source.name.startsWith('Screen ');
            }).forEach(source => {
                this.storeCapture(source);
            });
        });
    }
}