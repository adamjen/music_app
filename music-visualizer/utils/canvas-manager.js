import { ErrorHandler } from './error-handler.js';

export class CanvasManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = null;
        this.currentResolution = [0, 0];
    }

    initializeWebGL() {
        try {
            this.ctx = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
            
            if (!this.ctx) {
                throw new Error('WebGL is not supported in your browser!');
            }
            
            return this.ctx;
        } catch (error) {
            console.error('Error initializing WebGL:', error);
            ErrorHandler.handleError(error, 'Initialize WebGL', true);
            return null;
        }
    }

    resizeCanvas() {
        try {
            const displayWidth = this.canvas.clientWidth;
            const displayHeight = this.canvas.clientHeight;
            
            if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
                this.canvas.width = displayWidth;
                this.canvas.height = displayHeight;
                
                if (this.ctx) {
                    this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
                }
                
                this.currentResolution = [this.canvas.width, this.canvas.height];
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error resizing canvas:', error);
            ErrorHandler.handleError(error, 'Resize Canvas', false);
            return false;
        }
    }

    getResolution() {
        return this.currentResolution;
    }

    getContext() {
        return this.ctx;
    }

    getCanvas() {
        return this.canvas;
    }
}
