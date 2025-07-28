// Basic audio test similar to the working HTML file
class BasicAudioTest {
    constructor() {
        this.audioContext = null;
        this.fileSource = null;
        this.selectedFile = null;
        this.init();
    }
    
    init() {
        // Set up event listeners
        document.getElementById('playBtn').addEventListener('click', () => this.play());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());
        document.getElementById('audioFile').addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Initialize audio context on first user interaction
        this.setupAudioInitialization();
    }
    
    updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = 'Status: ' + message;
        }
        console.log(message);
    }
    
    setupAudioInitialization() {
        // Initialize audio context on first user interaction (for mobile devices)
        const initAudio = () => {
            if (!this.audioContext) {
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.updateStatus('Audio context initialized on user interaction');
                } catch (error) {
                    console.error('Failed to create AudioContext:', error);
                    this.updateStatus('Failed to create AudioContext: ' + error.message);
                }
            }
            // Remove the event listener after first interaction
            document.removeEventListener('click', initAudio);
        };
        
        document.addEventListener('click', initAudio, { once: true });
    }
    
    handleFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this.selectedFile = files[0];
            this.updateStatus(`Selected file: ${this.selectedFile.name}`);
        }
    }
    
    async playAudioFile(file) {
        // Initialize audio context if needed
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.updateStatus(`Audio context initialized in ${this.audioContext.state} state`);
            } catch (error) {
                this.updateStatus('Error initializing audio context: ' + error.message);
                return;
            }
        }
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                this.updateStatus('Audio context resumed');
                await this.startFilePlayback(file);
            } catch (error) {
                this.updateStatus('Error resuming audio context: ' + error.message);
            }
        } else {
            await this.startFilePlayback(file);
        }
    }
    
    async startFilePlayback(file) {
        try {
            // Create FileReader to read the file
            const reader = new FileReader();
            
            reader.onload = (e) => {
                // Decode the audio data
                this.audioContext.decodeAudioData(e.target.result)
                    .then((buffer) => {
                        // Create source node
                        this.fileSource = this.audioContext.createBufferSource();
                        this.fileSource.buffer = buffer;
                        this.fileSource.connect(this.audioContext.destination);
                        
                        // Set up onended handler
                        this.fileSource.onended = () => {
                            this.updateStatus('Audio playback finished');
                        };
                        
                        // Start playback
                        this.fileSource.start();
                        this.updateStatus(`Playing audio file: ${file.name}`);
                    })
                    .catch((error) => {
                        this.updateStatus('Error decoding audio data: ' + error.message);
                    });
            };
            
            reader.onerror = () => {
                this.updateStatus('Error reading file');
            };
            
            // Read the file as array buffer
            reader.readAsArrayBuffer(file);
        } catch (error) {
            this.updateStatus('Error starting file playback: ' + error.message);
        }
    }
    
    stop() {
        if (this.fileSource) {
            this.fileSource.stop();
            this.fileSource = null;
            this.updateStatus('Audio stopped');
        }
    }
    
    play() {
        if (this.selectedFile) {
            this.playAudioFile(this.selectedFile);
        } else {
            const fileInput = document.getElementById('audioFile');
            if (fileInput.files.length > 0) {
                this.playAudioFile(fileInput.files[0]);
            } else {
                this.updateStatus('Please select an audio file first');
            }
        }
    }
}

// Initialize the test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BasicAudioTest();
});
