const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
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

// Handle file selection
ipcMain.handle('select-files', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'OGG Files', extensions: ['ogg'] }]
    });
    return result.filePaths;
});

// Handle output directory selection
ipcMain.handle('select-output-dir', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    return result.filePaths[0];
});

// Handle file conversion
ipcMain.handle('convert-files', async (event, { files, outputDir }) => {
    const results = [];
    
    for (const file of files) {
        const fileName = path.basename(file, '.ogg');
        const outputPath = path.join(outputDir, `${fileName}.mp3`);
        
        try {
            await new Promise((resolve, reject) => {
                ffmpeg(file)
                    .toFormat('mp3')
                    .on('progress', (progress) => {
                        mainWindow.webContents.send('conversion-progress', {
                            file: fileName,
                            progress: progress.percent
                        });
                    })
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });
            results.push({ file: fileName, success: true });
        } catch (error) {
            results.push({ file: fileName, success: false, error: error.message });
        }
    }
    
    return results;
}); 