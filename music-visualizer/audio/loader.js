export class AudioLoader {
    /**
     * Create an audio loader that uses the provided audio context
     * @param {AudioContext} audioContext - The audio context to use for decoding
     */
    constructor(audioContext) {
        this.audioContext = audioContext;
    }
    
    /**
     * Load an audio file and decode it into an AudioBuffer
     * @param {File} file - The audio file to load
     * @returns {Promise<AudioBuffer>} A promise that resolves with the decoded audio buffer
     */
    async loadAudioFile(file) {
        console.log('Starting to load audio file:', file.name);
        console.log('File size:', file.size, 'bytes');
        console.log('File type:', file.type);
        
        try {
            // Read the file as array buffer
            const arrayBuffer = await file.arrayBuffer();
            console.log('Successfully read file into array buffer');
            console.log('Array buffer size:', arrayBuffer.byteLength);
            
            // Decode using the provided audio context
            console.log('Starting audio decoding with AudioContext state:', this.audioContext.state);
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            console.log('Successfully decoded audio data');
            console.log('Audio buffer duration:', audioBuffer.duration, 'seconds');
            console.log('Audio buffer sample rate:', audioBuffer.sampleRate);
            console.log('Audio buffer number of channels:', audioBuffer.numberOfChannels);
            
            return audioBuffer;
        } catch (error) {
            console.error('Error in loadAudioFile:', error);
            console.error('Error name:', error.name);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            // Try to get more detailed error information
            if (error.code === DOMException.NOT_SUPPORTED_ERR) {
                console.error('The audio file format is not supported');
            } else if (error.code === DOMException.INVALID_STATE_ERR) {
                console.error('Invalid state for audio decoding');
            } else if (error.code === DOMException.SYNTAX_ERR) {
                console.error('Invalid audio file format or corrupted file');
            }
            
            throw new Error(`Failed to load audio file: ${error.message}`);
        }
    }
    
    /**
     * Load audio from a URL
     * @param {string} url - The URL of the audio file
     * @returns {Promise<AudioBuffer>} A promise that resolves with the decoded audio buffer
     */
    async loadFromUrl(url) {
        try {
            // Fetch the audio data
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            
            // Decode using the provided audio context
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            return audioBuffer;
        } catch (error) {
            throw new Error(`Failed to load audio from URL: ${error.message}`);
        }
    }
}
