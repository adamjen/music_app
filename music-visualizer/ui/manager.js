/**
 * UIManager - Centralized UI state management for the music visualizer application
 */
export class UIManager {
    constructor() {
        // UI element references
        this.elements = {
            playBtn: document.getElementById('play-button'),
            stopBtn: document.getElementById('stop-button'),
            nextBtn: document.getElementById('next-button'),
            prevBtn: document.getElementById('prev-button'),
            audioFile: document.getElementById('audio-file-input'),
            streamRadioBtn: document.getElementById('stream-radio-button'),
            fileList: document.getElementById('file-list'),
            shaderSelect: document.getElementById('shader-select'),
            shaderParams: document.getElementById('shader-params'),
            timeDisplay: document.getElementById('time-display'),
            visualizer: document.getElementById('visualizer-canvas')
        };
        
        // UI state
        this.state = {
            isPlaying: false,
            currentFileIndex: -1,
            currentShader: 'base',
            audioFiles: []
        };
    }

    /**
     * Get singleton instance
     * @returns {UIManager}
     */
    static getInstance() {
        if (!UIManager.instance) {
            UIManager.instance = new UIManager();
        }
        return UIManager.instance;
    }

    /**
     * Update status message
     * @param {string} message - Status message to display
     * @param {string} type - Type of status (info, error, success)
     */
    updateStatus(message, type = 'info') {
        try {
            console.log(`[${type.toUpperCase()}] ${message}`);
            // For now, we'll use console.log. In a real app, this could update a status bar
            if (type === 'error') {
                this.showError(message);
            } else if (type === 'info') {
                this.showInfo(message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    /**
     * Update play/pause button text
     * @param {boolean} isPlaying - Whether audio is currently playing
     */
    updatePlayButton(isPlaying) {
        try {
            if (this.elements.playBtn) {
                this.elements.playBtn.textContent = isPlaying ? 'Pause' : 'Play';
            }
            this.state.isPlaying = isPlaying;
        } catch (error) {
            console.error('Error updating play button:', error);
        }
    }

    /**
     * Update file list in UI
     * @param {Array} audioFiles - Array of audio files
     * @param {number} currentFileIndex - Index of currently selected file
     */
    updateFileList(audioFiles, currentFileIndex) {
        try {
            if (!this.elements.fileList) return;
            
            this.elements.fileList.innerHTML = '';
            this.state.audioFiles = audioFiles;
            this.state.currentFileIndex = currentFileIndex;
            
            audioFiles.forEach((audioFile, index) => {
                const li = document.createElement('li');
                li.textContent = audioFile.name;
                if (index === currentFileIndex) {
                    li.classList.add('active');
                }
                this.elements.fileList.appendChild(li);
            });
        } catch (error) {
            console.error('Error updating file list:', error);
        }
    }

    /**
     * Update time display
     * @param {number} currentTime - Current playback time in seconds
     * @param {number} duration - Total duration in seconds
     */
    updateTimeDisplay(currentTime, duration) {
        try {
            if (!this.elements.timeDisplay) return;
            
            const currentMinutes = Math.floor(currentTime / 60);
            const currentSeconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
            const durationMinutes = duration ? Math.floor(duration / 60) : 0;
            const durationSeconds = duration ? Math.floor(duration % 60).toString().padStart(2, '0') : '00';
            
            this.elements.timeDisplay.textContent = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
        } catch (error) {
            console.error('Error updating time display:', error);
        }
    }

    /**
     * Update shader parameter controls
     * @param {string} shaderName - Name of current shader
     * @param {Object} shaderParams - Current shader parameters
     */
    updateShaderControls(shaderName, shaderParams) {
        try {
            if (!this.elements.shaderParams) return;
            
            this.elements.shaderParams.innerHTML = '';
            this.state.currentShader = shaderName;
            
            // This would be populated based on the selected shader's parameters
            // For now, we'll add some common controls
            if (shaderName === 'spectrum') {
                this.addParamControl(this.elements.shaderParams, 'Sensitivity', 'sensitivity', 1, 0.1, 5);
                this.addParamControl(this.elements.shaderParams, 'Smoothing', 'smoothing', 0.8, 0.1, 1);
            } else if (shaderName === 'waves') {
                this.addParamControl(this.elements.shaderParams, 'Amplitude', 'amplitude', 1, 0.1, 3);
                this.addParamControl(this.elements.shaderParams, 'LineWidth', 'lineWidth', 2, 1, 10);
            }
        } catch (error) {
            console.error('Error updating shader controls:', error);
        }
    }

    /**
     * Add a parameter control to the UI
     * @param {HTMLElement} container - Container element
     * @param {string} label - Label for the control
     * @param {string} id - ID for the control
     * @param {number} value - Current value
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     */
    addParamControl(container, label, id, value, min, max) {
        try {
            const div = document.createElement('div');
            div.className = 'param-control';
            
            const labelEl = document.createElement('label');
            labelEl.textContent = label;
            labelEl.htmlFor = id;
            div.appendChild(labelEl);
            
            const input = document.createElement('input');
            input.type = 'range';
            input.id = id;
            input.min = min;
            input.max = max;
            input.step = 0.1;
            input.value = value;
            div.appendChild(input);
            
            container.appendChild(div);
        } catch (error) {
            console.error('Error adding parameter control:', error);
        }
    }

    /**
     * Show an error message to the user
     * @param {string} message - Error message to display
     */
    showError(message) {
        try {
            console.error(`[UI ERROR] ${message}`);
            // Instead of alert, log to console
        } catch (error) {
            console.error('Error showing error message:', error);
        }
    }

    /**
     * Show an info message to the user
     * @param {string} message - Info message to display
     */
    showInfo(message) {
        try {
            console.info(`[UI INFO] ${message}`);
            // Instead of alert, log to console
        } catch (error) {
            console.error('Error showing info message:', error);
        }
    }

    /**
     * Get current UI state
     * @returns {Object} Current UI state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Set UI element disabled state
     * @param {string} elementId - ID of the element
     * @param {boolean} disabled - Whether to disable the element
     */
    setElementDisabled(elementId, disabled) {
        try {
            if (this.elements[elementId]) {
                this.elements[elementId].disabled = disabled;
            }
        } catch (error) {
            console.error(`Error setting ${elementId} disabled state:`, error);
        }
    }

    /**
     * Update file information display
     * @param {Object} fileInfo - File information object
     * @param {string} fileInfo.name - File name
     * @param {number} fileInfo.duration - File duration in seconds
     * @param {string} fileInfo.type - File type
     */
    updateFileInfo(fileInfo) {
        try {
            if (!fileInfo) return;
            
            // Update status with file info
            this.updateStatus(`Loaded: ${fileInfo.name} (${Math.round(fileInfo.duration)}s)`, 'info');
            
            // Update any file info display elements if they exist
            const fileInfoElement = document.getElementById('file-info');
            if (fileInfoElement) {
                fileInfoElement.textContent = `${fileInfo.name} - ${fileInfo.type}`;
            }
        } catch (error) {
            console.error('Error updating file info:', error);
        }
    }

    /**
     * Update the UI state with the current application state
     * @param {Object} state - The current application state
     */
    updateState(state) {
        try {
            // Update internal state
            Object.assign(this.state, state);
            
            // Update UI elements based on state
            if (this.elements.playBtn) {
                this.elements.playBtn.textContent = this.state.isPlaying ? 'Pause' : 'Play';
            }
            
            // Update file list if it has changed
            if (this.elements.fileList && 
                (this.state.audioFiles !== this.lastAudioFiles || 
                 this.state.currentFileIndex !== this.lastCurrentFileIndex)) {
                this.updateFileList(this.state.audioFiles, this.state.currentFileIndex);
                this.lastAudioFiles = this.state.audioFiles;
                this.lastCurrentFileIndex = this.state.currentFileIndex;
            }
            
            // Update shader controls if shader has changed
            if (this.elements.shaderParams && this.state.currentShader !== this.lastShader) {
                this.updateShaderControls(this.state.currentShader);
                this.lastShader = this.state.currentShader;
            }
        } catch (error) {
            console.error('Error updating UI state:', error);
        }
    }
}
