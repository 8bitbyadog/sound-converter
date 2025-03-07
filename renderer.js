const { ipcRenderer } = require('electron');

let selectedFiles = [];
let outputDir = null;

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileList = document.getElementById('fileList');
const selectOutputDirBtn = document.getElementById('selectOutputDir');
const convertButton = document.getElementById('convertButton');
const status = document.getElementById('status');

// Drag and drop handlers
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files)
        .filter(file => file.name.toLowerCase().endsWith('.ogg'))
        .map(file => file.path); // Get the file path
    handleFiles(files);
});

dropZone.addEventListener('click', async () => {
    const files = await ipcRenderer.invoke('select-files');
    if (files.length > 0) {
        handleFiles(files);
    }
});

// Output directory selection
selectOutputDirBtn.addEventListener('click', async () => {
    outputDir = await ipcRenderer.invoke('select-output-dir');
    if (outputDir) {
        updateConvertButton();
        showStatus(`Output directory selected: ${outputDir}`, 'success');
    }
});

// Convert button handler
convertButton.addEventListener('click', async () => {
    if (!selectedFiles.length || !outputDir) return;

    convertButton.disabled = true;
    showStatus('Converting files...', 'info');

    try {
        const results = await ipcRenderer.invoke('convert-files', {
            files: selectedFiles,
            outputDir: outputDir
        });

        const successCount = results.filter(r => r.success).length;
        const errorCount = results.filter(r => !r.success).length;

        if (errorCount === 0) {
            showStatus(`Successfully converted ${successCount} files!`, 'success');
        } else {
            showStatus(`Converted ${successCount} files with ${errorCount} errors.`, 'error');
        }
    } catch (error) {
        showStatus(`Error during conversion: ${error.message}`, 'error');
    } finally {
        convertButton.disabled = false;
    }
});

// Progress updates from main process
ipcRenderer.on('conversion-progress', (event, { file, progress }) => {
    updateFileProgress(file, progress);
});

// Helper functions
function handleFiles(files) {
    selectedFiles = [...selectedFiles, ...files];
    updateFileList();
    updateConvertButton();
    showStatus(`Added ${files.length} file(s)`, 'success');
}

function updateFileList() {
    fileList.innerHTML = '';
    selectedFiles.forEach(file => {
        const fileName = file.split('/').pop();
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${fileName}</span>
            <div class="progress-bar">
                <div class="progress" id="progress-${fileName}" style="width: 0%"></div>
            </div>
        `;
        fileList.appendChild(fileItem);
    });
}

function updateFileProgress(fileName, progress) {
    const progressBar = document.getElementById(`progress-${fileName}`);
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

function updateConvertButton() {
    convertButton.disabled = !(selectedFiles.length > 0 && outputDir);
}

function showStatus(message, type = 'info') {
    status.textContent = message;
    status.className = 'status ' + type;
} 