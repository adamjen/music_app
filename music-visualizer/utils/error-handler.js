/**
 * ErrorHandler - Centralized error handling for the music visualizer application
 */
export class ErrorHandler {
    /**
     * Handle an error with appropriate logging and user notification
     * @param {Error} error - The error to handle
     * @param {string} context - Context where the error occurred
     * @param {boolean} showAlert - Whether to show an alert to the user
     */
    static handleError(error, context = 'Unknown', showAlert = false) {
        // Log the error with context
        console.error(`Error in ${context}:`, error);
        
        // Log additional error details if available
        if (error.stack) {
            console.error('Error stack:', error.stack);
        }
        
        // Show user-friendly alert if requested (now defaults to false)
        if (showAlert) {
            // Create a more user-friendly error message
            const userMessage = this.getUserFriendlyMessage(error, context);
            alert(userMessage);
        }
        
        // Log to analytics or error reporting service in production
        // (This would be implemented in a real application)
    }
    
    /**
     * Create a user-friendly error message
     * @param {Error} error - The error to handle
     * @param {string} context - Context where the error occurred
     * @returns {string} User-friendly error message
     */
    static getUserFriendlyMessage(error, context) {
        // Handle specific error types
        if (error.name === 'NotAllowedError') {
            return 'Audio playback requires user interaction. Please click on the page and try again.';
        }
        
        if (error.name === 'NotSupportedError') {
            return 'The audio file format is not supported. Please try a different file.';
        }
        
        if (error.name === 'SyntaxError' || error.name === 'EncodingError') {
            return 'The audio file appears to be corrupted or invalid. Please try a different file.';
        }
        
        if (error.message && error.message.includes('fetch')) {
            return 'Failed to load a required resource. Please check your internet connection and try again.';
        }
        
        if (error.message && error.message.includes('decode')) {
            return 'Failed to decode the audio file. Please try a different file.';
        }
        
        // Generic error message
        return `An error occurred in ${context}. Please try again. Details: ${error.message || 'Unknown error'}`;
    }
    
    /**
     * Handle async operation with error catching
     * @param {Function} asyncFn - Async function to execute
     * @param {string} context - Context where the operation is happening
     * @param {boolean} showAlert - Whether to show an alert to the user
     * @returns {Promise<any>} Result of the async operation or null if it failed
     */
    static async handleAsyncOperation(asyncFn, context = 'Async Operation', showAlert = true) {
        try {
            return await asyncFn();
        } catch (error) {
            this.handleError(error, context, showAlert);
            return null;
        }
    }
    
    /**
     * Log a warning message
     * @param {string} message - Warning message
     * @param {string} context - Context where the warning occurred
     */
    static logWarning(message, context = 'Unknown') {
        console.warn(`Warning in ${context}: ${message}`);
    }
    
    /**
     * Log an info message
     * @param {string} message - Info message
     * @param {string} context - Context where the info occurred
     */
    static logInfo(message, context = 'Unknown') {
        console.info(`Info in ${context}: ${message}`);
    }
}
