/**
 * AudioContextManager - Centralized management of AudioContext
 * Ensures only one AudioContext exists and handles browser autoplay policies
 */
export class AudioContextManager {
    constructor() {
        this.audioContext = null;
        this.state = 'uninitialized'; // uninitialized, suspended, running
    }

    /**
     * Get singleton instance
     * @returns {AudioContextManager}
     */
    static getInstance() {
        if (!AudioContextManager.instance) {
            AudioContextManager.instance = new AudioContextManager();
        }
        return AudioContextManager.instance;
    }

    /**
     * Initialize AudioContext on user interaction
     * @returns {Promise<AudioContext>}
     */
    async initialize() {
        if (this.audioContext) {
            console.log('AudioContext already exists with state:', this.audioContext.state);
            return this.audioContext;
        }

        try {
            console.log('Creating new AudioContext');
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.state = 'suspended';
            console.log('AudioContext created with state:', this.audioContext.state);
            return this.audioContext;
        } catch (error) {
            console.error('Failed to create AudioContext:', error);
            throw new Error(`Failed to create AudioContext: ${error.message}`);
        }
    }

    /**
     * Get the current AudioContext instance
     * @returns {AudioContext|null}
     */
    getContext() {
        return this.audioContext;
    }

    /**
     * Resume AudioContext (needed for browser autoplay policies)
     * @returns {Promise<void>}
     */
    async resume() {
        if (!this.audioContext) {
            await this.initialize();
        }

        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                this.state = 'running';
                console.log('AudioContext resumed successfully');
            } catch (error) {
                console.error('Failed to resume AudioContext:', error);
                throw new Error(`Failed to resume AudioContext: ${error.message}`);
            }
        }
    }

    /**
     * Suspend AudioContext to save resources
     * @returns {Promise<void>}
     */
    async suspend() {
        if (this.audioContext && this.audioContext.state === 'running') {
            try {
                await this.audioContext.suspend();
                this.state = 'suspended';
                console.log('AudioContext suspended successfully');
            } catch (error) {
                console.error('Failed to suspend AudioContext:', error);
                throw new Error(`Failed to suspend AudioContext: ${error.message}`);
            }
        }
    }

    /**
     * Close AudioContext and release resources
     * @returns {Promise<void>}
     */
    async close() {
        if (this.audioContext) {
            try {
                await this.audioContext.close();
                this.audioContext = null;
                this.state = 'uninitialized';
                console.log('AudioContext closed successfully');
            } catch (error) {
                console.error('Failed to close AudioContext:', error);
                throw new Error(`Failed to close AudioContext: ${error.message}`);
            }
        }
    }

    /**
     * Check if AudioContext is initialized
     * @returns {boolean}
     */
    isInitialized() {
        return this.audioContext !== null;
    }

    /**
     * Get current state of AudioContext
     * @returns {string}
     */
    getState() {
        return this.state;
    }
}
