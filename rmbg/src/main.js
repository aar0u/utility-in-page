import './style.css';
import { removeBackground } from '@imgly/background-removal';

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const resultContainer = document.getElementById('resultContainer');
const statusContainer = document.getElementById('statusContainer');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const progressFill = document.getElementById('progressFill');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');
const bgOptions = document.querySelectorAll('.bg-option');

// State
let processedBlob = null;
let originalFileName = '';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Initialize
init();

function init() {
    setupEventListeners();
    console.log('PhotoCut initialized ✨');
}

function setupEventListeners() {
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);
    bgOptions.forEach(option => {
        option.addEventListener('click', () => changeBackground(option.dataset.bg));
    });
    downloadBtn.addEventListener('click', downloadResult);
    newImageBtn.addEventListener('click', resetApp);
}

function handleDragOver(e) {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

async function handleFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showStatus('Please upload a JPG, PNG, or WEBP image', 'error');
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        showStatus('File size exceeds 10MB limit', 'error');
        return;
    }

    originalFileName = file.name.replace(/\.[^/.]+$/, '');
    
    try {
        showLoading('Loading image...');
        updateProgress(20);

        const imageUrl = await readFileAsDataURL(file);
        originalImage.src = imageUrl;

        await new Promise((resolve, reject) => {
            originalImage.onload = resolve;
            originalImage.onerror = reject;
        });

        updateProgress(40);
        previewSection.classList.add('active');
        uploadSection.style.display = 'none';

        loadingText.textContent = 'Removing background...';
        updateProgress(60);

        const blob = await removeBackground(imageUrl, {
            publicPath: `${window.location.origin}/models/`,
            progress: (key, current, total) => {
                const percent = Math.round((current / total) * 100);
                const overallProgress = 60 + (percent * 0.3);
                updateProgress(overallProgress);
            }
        });

        updateProgress(100);
        processedBlob = blob;

        const resultUrl = URL.createObjectURL(blob);
        resultImage.src = resultUrl;

        hideLoading();
        showStatus('Background removed successfully! ✨', 'success');

    } catch (error) {
        console.error('Error processing image:', error);
        hideLoading();
        showStatus('Failed to process image. Please try another image.', 'error');
        resetApp();
    }
}

function changeBackground(bgType) {
    bgOptions.forEach(opt => opt.classList.remove('active'));
    event.target.classList.add('active');

    switch(bgType) {
        case 'transparent':
            resultContainer.style.background = `
                linear-gradient(45deg, #1a1a24 25%, transparent 25%), 
                linear-gradient(-45deg, #1a1a24 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #1a1a24 75%), 
                linear-gradient(-45deg, transparent 75%, #1a1a24 75%)
            `;
            resultContainer.style.backgroundSize = '20px 20px';
            resultContainer.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
            resultContainer.style.backgroundColor = 'var(--bg-dark)';
            break;
        case 'white':
            resultContainer.style.background = 'white';
            resultContainer.style.backgroundSize = 'auto';
            resultContainer.style.backgroundPosition = 'initial';
            break;
        case 'black':
            resultContainer.style.background = 'black';
            resultContainer.style.backgroundSize = 'auto';
            resultContainer.style.backgroundPosition = 'initial';
            break;
    }
}

async function downloadResult() {
    if (!processedBlob) {
        showStatus('No processed image to download', 'error');
        return;
    }

    try {
        const url = URL.createObjectURL(processedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${originalFileName}-no-bg.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showStatus('Image downloaded successfully! 💾', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showStatus('Failed to download image', 'error');
    }
}

function resetApp() {
    previewSection.classList.remove('active');
    uploadSection.style.display = 'block';
    fileInput.value = '';
    originalImage.src = '';
    resultImage.src = '';
    processedBlob = null;
    originalFileName = '';
    statusContainer.innerHTML = '';
    bgOptions.forEach(opt => opt.classList.remove('active'));
    bgOptions[0].classList.add('active');
    changeBackground('transparent');
}

function showLoading(text = 'Processing...') {
    loadingText.textContent = text;
    loadingOverlay.classList.add('active');
    updateProgress(0);
}

function hideLoading() {
    setTimeout(() => {
        loadingOverlay.classList.remove('active');
        updateProgress(0);
    }, 300);
}

function updateProgress(percent) {
    progressFill.style.width = `${Math.min(percent, 100)}%`;
}

function showStatus(message, type = 'success') {
    const statusEl = document.createElement('div');
    statusEl.className = `status-message ${type}`;
    statusEl.innerHTML = `
        <span>${type === 'success' ? '✓' : '✕'}</span>
        <span>${message}</span>
    `;
    
    statusContainer.innerHTML = '';
    statusContainer.appendChild(statusEl);

    setTimeout(() => {
        statusEl.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => statusEl.remove(), 300);
    }, 5000);
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

window.addEventListener('beforeunload', () => {
    if (originalImage.src) URL.revokeObjectURL(originalImage.src);
    if (resultImage.src) URL.revokeObjectURL(resultImage.src);
});
