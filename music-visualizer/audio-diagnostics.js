/**
 * Audio Diagnostics - Comprehensive audio debugging utilities
 */
export class AudioDiagnostics {
    constructor() {
        this.logs = [];
        this.tests = [];
    }

    /**
     * Log diagnostic information
     * @param {string} message - Message to log
     * @param {string} level - Log level (info, warn, error)
     */
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, message, level };
        this.logs.push(logEntry);
        console[level](`[AudioDiagnostics] ${message}`);
    }

    /**
     * Test audio context creation and state
     * @returns {Promise<Object>} Test results
     */
    async testAudioContext() {
        this.log('Testing audio context creation...');
        
        const results = {
            test: 'AudioContext',
            passed: false,
            details: {}
        };

        try {
            // Test basic AudioContext creation
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                results.details.error = 'AudioContext not supported';
                this.log('AudioContext not supported', 'error');
                return results;
            }

            const context = new AudioContext();
            results.details.initialState = context.state;
            results.details.sampleRate = context.sampleRate;
            results.details.maxChannelCount = context.destination.maxChannelCount;

            this.log(`AudioContext created with state: ${context.state}`);
            this.log(`Sample rate: ${context.sampleRate}`);
            this.log(`Max channel count: ${context.destination.maxChannelCount}`);

            // Test context resume
            if (context.state === 'suspended') {
                this.log('Attempting to resume suspended context...');
                await context.resume();
                results.details.afterResume = context.state;
                this.log(`Context state after resume: ${context.state}`);
            }

            // Test basic node creation
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            results.details.nodeCreation = 'success';
            results.passed = true;

            // Clean up
            oscillator.disconnect();
            gainNode.disconnect();
            await context.close();

            this.log('Audio context test completed successfully');
        } catch (error) {
            results.details.error = error.message;
            results.details.stack = error.stack;
            this.log(`Audio context test failed: ${error.message}`, 'error');
        }

        return results;
    }

    /**
     * Test file loading and decoding
     * @param {File} audioFile - Audio file to test
     * @returns {Promise<Object>} Test results
     */
    async testFileLoading(audioFile) {
        this.log(`Testing file loading for: ${audioFile.name}`);
        
        const results = {
            test: 'FileLoading',
            passed: false,
            details: {
                fileName: audioFile.name,
                fileSize: audioFile.size,
                fileType: audioFile.type
            }
        };

        try {
            // Create test context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const context = new AudioContext();

            // Test file reading
            const arrayBuffer = await audioFile.arrayBuffer();
            results.details.arrayBufferSize = arrayBuffer.byteLength;
            this.log(`File read successfully, size: ${arrayBuffer.byteLength} bytes`);

            // Test audio decoding
            const audioBuffer = await context.decodeAudioData(arrayBuffer);
            results.details.duration = audioBuffer.duration;
            results.details.sampleRate = audioBuffer.sampleRate;
            results.details.numberOfChannels = audioBuffer.numberOfChannels;
            results.details.length = audioBuffer.length;

            this.log(`Audio decoded successfully: ${audioBuffer.duration}s, ${audioBuffer.sampleRate}Hz, ${audioBuffer.numberOfChannels} channels`);

            results.passed = true;
            await context.close();
        } catch (error) {
            results.details.error = error.message;
            results.details.name = error.name;
            this.log(`File loading test failed: ${error.message}`, 'error');
        }

        return results;
    }

    /**
     * Test complete playback flow
     * @param {File} audioFile - Audio file to test
     * @returns {Promise<Object>} Test results
     */
    async testPlaybackFlow(audioFile) {
        this.log('Testing complete playback flow...');
        
        const results = {
            test: 'PlaybackFlow',
            passed: false,
            details: {}
        };

        try {
            // Create context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const context = new AudioContext();

            // Resume if suspended
            if (context.state === 'suspended') {
                await context.resume();
            }

            // Load and decode file
            const arrayBuffer = await audioFile.arrayBuffer();
            const audioBuffer = await context.decodeAudioData(arrayBuffer);

            // Create source and play
            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);

            // Test actual playback
            await new Promise((resolve, reject) => {
                source.onended = () => {
                    this.log('Playback completed successfully');
                    resolve();
                };
                
                source.onerror = (error) => {
                    this.log(`Playback error: ${error}`, 'error');
                    reject(new Error(`Playback failed: ${error}`));
                };

                source.start();
                this.log('Playback started');
            });

            results.passed = true;
            await context.close();
        } catch (error) {
            results.details.error = error.message;
            this.log(`Playback flow test failed: ${error.message}`, 'error');
        }

        return results;
    }

    /**
     * Run all diagnostic tests
     * @param {File} audioFile - Optional audio file for file-specific tests
     * @returns {Promise<Object>} Complete test results
     */
    async runAllTests(audioFile = null) {
        this.log('Starting comprehensive audio diagnostics...');
        
        const results = {
            timestamp: new Date().toISOString(),
            browser: navigator.userAgent,
            tests: []
        };

        // Test audio context
        const contextTest = await this.testAudioContext();
        results.tests.push(contextTest);

        // Test file loading if file provided
        if (audioFile) {
            const fileTest = await this.testFileLoading(audioFile);
            results.tests.push(fileTest);

            if (fileTest.passed) {
                const playbackTest = await this.testPlaybackFlow(audioFile);
                results.tests.push(playbackTest);
            }
        }

        // Test WebGL support
        const webglTest = this.testWebGLSupport();
        results.tests.push(webglTest);

        results.summary = {
            total: results.tests.length,
            passed: results.tests.filter(t => t.passed).length,
            failed: results.tests.filter(t => !t.passed).length
        };

        this.log(`Diagnostics completed: ${results.summary.passed}/${results.summary.total} tests passed`);
        return results;
    }

    /**
     * Test WebGL support
     * @returns {Object} Test results
     */
    testWebGLSupport() {
        this.log('Testing WebGL support...');
        
        const results = {
            test: 'WebGLSupport',
            passed: false,
            details: {}
        };

        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            
            if (!gl) {
                results.details.error = 'WebGL not supported';
                this.log('WebGL not supported', 'error');
                return results;
            }

            results.details.version = gl.getParameter(gl.VERSION);
            results.details.renderer = gl.getParameter(gl.RENDERER);
            results.details.vendor = gl.getParameter(gl.VENDOR);
            results.details.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            results.details.maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);

            this.log(`WebGL supported: ${results.details.version}`);
            this.log(`Renderer: ${results.details.renderer}`);
            
            results.passed = true;
        } catch (error) {
            results.details.error = error.message;
            this.log(`WebGL test failed: ${error.message}`, 'error');
        }

        return results;
    }

    /**
     * Get diagnostic report as HTML
     * @returns {string} HTML report
     */
    getReportHTML() {
        let html = `
            <div style="font-family: monospace; background: #f5f5f5; padding: 20px; border-radius: 5px;">
                <h3>Audio Diagnostics Report</h3>
                <div style="margin-bottom: 20px;">
                    <strong>Timestamp:</strong> ${new Date().toLocaleString()}
                </div>
                <div style="margin-bottom: 20px;">
                    <strong>Browser:</strong> ${navigator.userAgent}
                </div>
                <div style="margin-bottom: 20px;">
                    <strong>Logs:</strong>
                    <ul style="max-height: 200px; overflow-y: auto; background: white; padding: 10px; border: 1px solid #ddd;">
                        ${this.logs.map(log => `
                            <li style="color: ${log.level === 'error' ? 'red' : log.level === 'warn' ? 'orange' : 'black'};">
                                [${log.timestamp}] ${log.message}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        return html;
    }

    /**
     * Clear all logs and test results
     */
    clear() {
        this.logs = [];
        this.tests = [];
    }
}
