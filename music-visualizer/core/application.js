import { ErrorHandler } from '../utils/error-handler.js';
import { CanvasManager } from '../utils/canvas-manager.js';
import { ShaderManager } from '../rendering/shader-manager.js';
import { WebGLRenderer } from '../rendering/webgl-renderer.js';
import { AudioContextManager } from '../audio/context-manager.js';
import { AudioSession } from '../audio/audio-session.js';
import { UIManager } from '../ui/manager.js';

export class Application {
    constructor() {
        this.canvasManager = null;
        this.shaderManager = null;
        this.renderer = null;
        this.audioContextManager = null;
        this.audioSession = null;
        this.uiManager = null;
        
        this.isInitialized = false;
        this.isPlaying = false;
        this.animationId = null;
        
        this.audioData = new Uint8Array(256);
        this.analyser = null;
        this.source = null;
    }

    async initialize() {
        try {
            console.log('Initializing application...');
            
            const canvas = document.getElementById('visualizer-canvas');
            if (!canvas) {
                throw new Error('Canvas element not found');
            }

            this.canvasManager = new CanvasManager(canvas);
            const gl = this.canvasManager.initializeWebGL();
            if (!gl) {
                throw new Error('Failed to initialize WebGL');
            }

            this.shaderManager = new ShaderManager(gl);
            await this.shaderManager.loadShaders();

            this.renderer = new WebGLRenderer(gl, this.shaderManager);
            this.renderer.initialize();

            this.audioContextManager = new AudioContextManager();
            await this.audioContextManager.initialize();

            this.audioSession = new AudioSession(this.audioContextManager.getContext());
            this.uiManager = new UIManager();

            this.setupEventListeners();
            this.setupUI();

            this.canvasManager.resizeCanvas();
            this.shaderManager.updateResolution(this.canvasManager.getResolution());

            this.isInitialized = true;
            console.log('Application initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Error initializing application:', error);
            ErrorHandler.handleError(error, 'Initialize Application', false);
            return false;
        }
    }

    setupEventListeners() {
        const fileInput = document.getElementById('audio-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        const playButton = document.getElementById('play-button');
        if (playButton) {
            playButton.addEventListener('click', this.togglePlayPause.bind(this));
        }

        const nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.addEventListener('click', this.playNext.bind(this));
        }

        const prevButton = document.getElementById('prev-button');
        if (prevButton) {
            prevButton.addEventListener('click', this.playPrevious.bind(this));
        }

        const stopButton = document.getElementById('stop-button');
        if (stopButton) {
            stopButton.addEventListener('click', this.stop.bind(this));
        }

        const shaderSelect = document.getElementById('shader-select');
        if (shaderSelect) {
            shaderSelect.addEventListener('change', this.handleShaderChange.bind(this));
        }

        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setupUI() {
        if (this.uiManager) {
            this.uiManager.updateStatus('Ready - Select audio files to begin');
            this.uiManager.updatePlayButton(false);
            this.uiManager.updateFileInfo('No file selected');
            this.uiManager.updateShaderControls('base');
        }
    }

     async handleFileSelect(event) {
        try {
            const files = await this.audioSession.handleFileSelect(event);
            if (files && files.length > 0) {
                this.uiManager.updateFileList(files, 0);
                this.uiManager.updateStatus(`Loaded ${files.length} file(s)`);
                
                if (files.length > 0) {
                    await this.loadAndPlayFile(0);
                }
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'Handle File Select', false);
        }
    }

    async loadAndPlayFile(index) {
        try {
            this.uiManager.updateStatus('Loading audio file...');
            
            // Stop any currently playing audio
            if (this.isPlaying) {
                this.stop();
            }
            
            const audioBuffer = await this.audioSession.loadFileAtIndex(index);
            if (!audioBuffer) {
                throw new Error('Failed to load audio file');
            }

            if (this.source) {
                try {
                    this.source.disconnect();
                } catch (e) {
                    console.log('Source disconnect error (ignoring):', e.message);
                }
            }

            const audioContext = this.audioContextManager.getContext();
            this.source = audioContext.createBufferSource();
            this.analyser = audioContext.createAnalyser();
            
            this.analyser.fftSize = 512;
            this.source.buffer = audioBuffer;
            this.source.connect(this.analyser);
            this.analyser.connect(audioContext.destination);
            
            // Update audioData array size to match analyser frequencyBinCount
            this.audioData = new Uint8Array(this.analyser.frequencyBinCount);

            this.uiManager.updateFileInfo(this.audioSession.getCurrentFileName());
            this.uiManager.updateStatus('Ready to play');

            if (this.isPlaying) {
                this.play();
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'Load and Play File', false);
        }
    }

    async togglePlayPause() {
        try {
            if (!this.audioSession.hasFiles()) {
                this.uiManager.updateStatus('Please select audio files first');
                return;
            }

            if (this.isPlaying) {
                this.pause();
            } else {
                await this.play();
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'Toggle Play/Pause', false);
        }
    }

    async play() {
        try {
            if (!this.audioSession.getCurrentAudioBuffer()) {
                await this.loadAndPlayFile(0);
                return;
            }

            // Create new source for each play (can't reuse stopped sources)
            const audioContext = this.audioContextManager.getContext();
            this.source = audioContext.createBufferSource();
            this.analyser = audioContext.createAnalyser();
            
            this.analyser.fftSize = 512;
            this.source.buffer = this.audioSession.getCurrentAudioBuffer();
            this.source.connect(this.analyser);
            this.analyser.connect(audioContext.destination);
            
            this.audioData = new Uint8Array(this.analyser.frequencyBinCount);

            await this.audioContextManager.resume();
            this.source.start();
            this.isPlaying = true;
            this.uiManager.updatePlayButton(true);
            this.uiManager.updateStatus('Playing');
            this.startRenderLoop();
        } catch (error) {
            ErrorHandler.handleError(error, 'Play', false);
        }
    }

    pause() {
        try {
            if (this.source) {
                this.source.stop();
                this.source = null;
            }
            this.isPlaying = false;
            this.uiManager.updatePlayButton(false);
            this.uiManager.updateStatus('Paused');
            this.stopRenderLoop();
        } catch (error) {
            ErrorHandler.handleError(error, 'Pause', false);
        }
    }

    stop() {
        try {
            if (this.source && this.isPlaying) {
                try {
                    this.source.stop();
                } catch (e) {
                    // Ignore errors if source wasn't started
                    console.log('Source stop error (ignoring):', e.message);
                }
            }
            this.source = null;
            this.isPlaying = false;
            this.uiManager.updatePlayButton(false);
            this.uiManager.updateStatus('Stopped');
            this.stopRenderLoop();
            
            // Reset audio data to silence
            this.audioData.fill(0);
        } catch (error) {
            ErrorHandler.handleError(error, 'Stop', false);
        }
    }

    async playNext() {
        try {
            if (!this.audioSession.hasFiles()) return;

            const wasPlaying = this.isPlaying;
            if (wasPlaying) {
                this.stop();
            }

            const nextIndex = this.audioSession.getNextIndex();
            if (nextIndex >= 0) {
                await this.loadAndPlayFile(nextIndex);
                this.uiManager.updateFileList(this.audioSession.getAudioFiles(), nextIndex);
                
                if (wasPlaying) {
                    await this.play();
                }
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'Play Next', false);
        }
    }

    async playPrevious() {
        try {
            if (!this.audioSession.hasFiles()) return;

            const wasPlaying = this.isPlaying;
            if (wasPlaying) {
                this.stop();
            }

            const prevIndex = this.audioSession.getPreviousIndex();
            if (prevIndex >= 0) {
                await this.loadAndPlayFile(prevIndex);
                this.uiManager.updateFileList(this.audioSession.getAudioFiles(), prevIndex);
                
                if (wasPlaying) {
                    await this.play();
                }
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'Play Previous', false);
        }
    }

    handleShaderChange(event) {
        const shaderName = event.target.value;
        this.shaderManager.setCurrentShader(shaderName);
        this.uiManager.updateShaderControls(shaderName);
    }

    handleResize() {
        if (this.canvasManager.resizeCanvas()) {
            this.shaderManager.updateResolution(this.canvasManager.getResolution());
        }
    }

    startRenderLoop() {
        if (this.animationId) return;

        const startTime = Date.now();
        const duration = this.audioSession.getCurrentAudioBuffer()?.duration || 0;

        const render = () => {
            try {
                if (this.analyser && this.isPlaying) {
                    this.analyser.getByteFrequencyData(this.audioData);
                    
                    // Update time display
                    const elapsed = (Date.now() - startTime) / 1000;
                    this.uiManager.updateTimeDisplay(Math.min(elapsed, duration), duration);
                }

                this.renderer.render(this.audioData);
                this.animationId = requestAnimationFrame(render);
            } catch (error) {
                ErrorHandler.handleError(error, 'Render Loop', false);
                this.stopRenderLoop();
            }
        };

        render();
    }

    stopRenderLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    cleanup() {
        try {
            this.stopRenderLoop();
            
            if (this.source) {
                this.source.disconnect();
                this.source = null;
            }

            if (this.analyser) {
                this.analyser.disconnect();
                this.analyser = null;
            }

            if (this.renderer) {
                this.renderer.cleanup();
            }

            if (this.audioContextManager) {
                this.audioContextManager.cleanup();
            }

            console.log('Application cleaned up');
        } catch (error) {
            ErrorHandler.handleError(error, 'Cleanup Application', false);
        }
    }

    isReady() {
        return this.isInitialized;
    }

    getAudioSession() {
        return this.audioSession;
    }

    getUIManager() {
        return this.uiManager;
    }
}
