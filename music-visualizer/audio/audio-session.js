import { ErrorHandler } from '../utils/error-handler.js';
import { AudioLoader } from './loader.js';

export class AudioSession {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.audioFiles = [];
        this.currentFileIndex = -1;
        this.currentAudioBuffer = null;
        this.loader = new AudioLoader(audioContext);
    }

    async handleFileSelect(event) {
        try {
            const files = Array.from(event.target.files);
            if (files.length === 0) return;

            this.audioFiles = [];
            this.currentFileIndex = -1;

            for (const file of files) {
                this.audioFiles.push({
                    name: file.name,
                    file: file
                });
            }

            return this.audioFiles;
        } catch (error) {
            console.error('Error handling file selection:', error);
            ErrorHandler.handleError(error, 'Handle File Selection', true);
            return [];
        }
    }

    async loadFileAtIndex(index) {
        try {
            if (index < 0 || index >= this.audioFiles.length) return null;

            this.currentFileIndex = index;
            this.currentAudioBuffer = await this.loader.loadAudioFile(this.audioFiles[index].file);
            return this.currentAudioBuffer;
        } catch (error) {
            console.error('Error loading audio file:', error);
            ErrorHandler.handleError(error, 'Load Audio File', true);
            return null;
        }
    }

    getAudioFiles() {
        return this.audioFiles;
    }

    getCurrentFileIndex() {
        return this.currentFileIndex;
    }

    getCurrentAudioBuffer() {
        return this.currentAudioBuffer;
    }

    getCurrentFileName() {
        if (this.currentFileIndex >= 0 && this.currentFileIndex < this.audioFiles.length) {
            return this.audioFiles[this.currentFileIndex].name;
        }
        return null;
    }

    hasFiles() {
        return this.audioFiles.length > 0;
    }

    getFileCount() {
        return this.audioFiles.length;
    }

    getNextIndex() {
        if (this.audioFiles.length === 0) return -1;
        return (this.currentFileIndex + 1) % this.audioFiles.length;
    }

    getPreviousIndex() {
        if (this.audioFiles.length === 0) return -1;
        return (this.currentFileIndex - 1 + this.audioFiles.length) % this.audioFiles.length;
    }
}
