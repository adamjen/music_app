import { Application } from './core/application.js';
import { ErrorHandler } from './utils/error-handler.js';

let app = null;

async function initializeApp() {
    try {
        console.log('Starting Music Visualizer...');
        
        app = new Application();
        const success = await app.initialize();
        
        if (success) {
            console.log('Music Visualizer initialized successfully');
            ErrorHandler.logInfo('Music Visualizer ready - select audio files to begin');
        } else {
            console.error('Failed to initialize Music Visualizer');
            ErrorHandler.handleError(new Error('Initialization failed'), 'Initialize App', true);
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        ErrorHandler.handleError(error, 'Initialize App', true);
    }
}

function cleanupApp() {
    if (app) {
        app.cleanup();
        app = null;
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('beforeunload', cleanupApp);

export { app };
