export class AudioAnalyzer {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.analyserNode = this.audioContext.createAnalyser();
        
        // Configure the analyzer
        this.analyserNode.fftSize = 512;
        this.analyserNode.smoothingTimeConstant = 0.8;
        
        // Create frequency data array
        this.frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
    }
    
    /**
     * Get the current frequency data from the audio source
     * @returns {Float32Array} Normalized frequency data (0.0 to 1.0)
     */
    getFrequencyData() {
        // Get frequency data from analyser node
        this.analyserNode.getByteFrequencyData(this.frequencyData);
        
        // Convert to Float32Array and normalize (0.0 to 1.0)
        const floatData = new Float32Array(this.frequencyData.length);
        for (let i = 0; i < this.frequencyData.length; i++) {
            floatData[i] = this.frequencyData[i] / 255;
        }
        
        return floatData;
    }
    
    /**
     * Get average frequency value
     * @returns {number} Average frequency value (0.0 to 1.0)
     */
    getAverageFrequency() {
        const data = this.getFrequencyData();
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
        }
        return sum / data.length;
    }
    
    /**
     * Get frequency data for specific frequency ranges (bass, mid, treble)
     * @returns {Object} Frequency data for different ranges
     */
    getFrequencyRanges() {
        const data = this.getFrequencyData();
        const bufferLength = data.length;
        
        // Calculate frequency ranges based on sample rate and buffer length
        const nyquist = this.audioContext.sampleRate / 2;
        const frequencyPerBin = nyquist / bufferLength;
        
        // Define frequency ranges (in Hz)
        const bassRange = { min: 20, max: 250 };
        const midRange = { min: 250, max: 2000 };
        const trebleRange = { min: 2000, max: 8000 };
        
        // Calculate bin ranges for each frequency range
        const bassBins = {
            start: Math.floor(bassRange.min / frequencyPerBin),
            end: Math.min(Math.floor(bassRange.max / frequencyPerBin), bufferLength - 1)
        };
        
        const midBins = {
            start: Math.floor(midRange.min / frequencyPerBin),
            end: Math.min(Math.floor(midRange.max / frequencyPerBin), bufferLength - 1)
        };
        
        const trebleBins = {
            start: Math.floor(trebleRange.min / frequencyPerBin),
            end: Math.min(Math.floor(trebleRange.max / frequencyPerBin), bufferLength - 1)
        };
        
        // Calculate average values for each range
        let bassSum = 0, midSum = 0, trebleSum = 0;
        let bassCount = 0, midCount = 0, trebleCount = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            if (i >= bassBins.start && i <= bassBins.end) {
                bassSum += data[i];
                bassCount++;
            }
            if (i >= midBins.start && i <= midBins.end) {
                midSum += data[i];
                midCount++;
            }
            if (i >= trebleBins.start && i <= trebleBins.end) {
                trebleSum += data[i];
                trebleCount++;
            }
        }
        
        return {
            bass: bassCount > 0 ? bassSum / bassCount : 0,
            mid: midCount > 0 ? midSum / midCount : 0,
            treble: trebleCount > 0 ? trebleSum / trebleCount : 0
        };
    }
}