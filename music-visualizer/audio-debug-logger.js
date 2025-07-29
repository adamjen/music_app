// Audio Debug Logger - Comprehensive audio data logging and analysis
export class AudioDebugLogger {
    constructor(analyser) {
        this.analyser = analyser;
        this.isLogging = false;
        this.loggingStartTime = null;
        this.loggingData = [];
        this.loggingInterval = null;
        this.sensitivities = [];
    }

    startLogging(selectedSensitivities) {
        if (!this.analyser) {
            throw new Error('Analyser not available');
        }

        this.sensitivities = selectedSensitivities;
        this.isLogging = true;
        this.loggingStartTime = Date.now();
        this.loggingData = [];
        
        this.loggingInterval = setInterval(() => {
            this.captureData();
        }, 16.67); // 60fps logging
        
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
    }

    captureData() {
        if (!this.isLogging) return;

        const elapsed = (Date.now() - this.loggingStartTime) / 1000;
        
        if (elapsed >= 60) {
            this.stopLogging();
            return;
        }

        // Capture raw FFT data
        const currentData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(currentData);

        const logEntry = {
            timestamp: Date.now(),
            elapsed: elapsed,
            rawData: Array.from(currentData),
            frequencyBands: {
                bass: currentData.slice(0, 5).reduce((a, b) => a + b, 0) / 5,
                mid: currentData.slice(5, 64).reduce((a, b) => a + b, 0) / 59,
                treble: currentData.slice(64).reduce((a, b) => a + b, 0) / (currentData.length - 64)
            },
            maxFrequency: Math.max(...currentData),
            averageLevel: currentData.reduce((a, b) => a + b, 0) / currentData.length,
            processedData: {}
        };

        // Calculate processed values for each sensitivity
        this.sensitivities.forEach(sens => {
            const processed = currentData.map(v => {
                const normalized = v / 255.0;
                const logScaled = Math.log(1.0 + normalized * 9.0) / Math.log(10.0);
                return Math.min(Math.max(logScaled * sens, 0.0), 1.5);
            });
            
            logEntry.processedData[sens] = {
                values: processed,
                average: processed.reduce((a, b) => a + b, 0) / processed.length,
                max: Math.max(...processed),
                min: Math.min(...processed)
            };
        });

        this.loggingData.push(logEntry);
    }

    stopLogging() {
        if (!this.isLogging) return;

        this.isLogging = false;
        clearInterval(this.loggingInterval);
        
        const analysis = this.generateAnalysisReport();
        const files = this.generateDownloadFiles(analysis);
        
        if (this.resolvePromise) {
            this.resolvePromise(files);
        }
        
        return files;
    }

    generateAnalysisReport() {
        const sensitivities = Object.keys(this.loggingData[0]?.processedData || {});
        const analysis = {
            clippingEvents: [],
            averageLevels: {},
            peakValues: {},
            valueRanges: {},
            frequencyAnalysis: {
                bass: { min: Infinity, max: -Infinity, avg: 0 },
                mid: { min: Infinity, max: -Infinity, avg: 0 },
                treble: { min: Infinity, max: -Infinity, avg: 0 }
            }
        };

        // Analyze each sensitivity
        sensitivities.forEach(sens => {
            const values = this.loggingData.map(d => d.processedData[sens].values).flat();
            analysis.averageLevels[sens] = values.reduce((a, b) => a + b, 0) / values.length;
            analysis.peakValues[sens] = Math.max(...values);
            analysis.valueRanges[sens] = {
                min: Math.min(...values),
                max: Math.max(...values)
            };

            // Find clipping events
            this.loggingData.forEach((entry, index) => {
                if (entry.processedData[sens].max > 1.0) {
                    analysis.clippingEvents.push({
                        sensitivity: sens,
                        time: entry.elapsed,
                        value: entry.processedData[sens].max,
                        index: index
                    });
                }
            });
        });

        // Frequency band analysis
        this.loggingData.forEach(entry => {
            analysis.frequencyAnalysis.bass.min = Math.min(analysis.frequencyAnalysis.bass.min, entry.frequencyBands.bass);
            analysis.frequencyAnalysis.bass.max = Math.max(analysis.frequencyAnalysis.bass.max, entry.frequencyBands.bass);
            analysis.frequencyAnalysis.bass.avg += entry.frequencyBands.bass;

            analysis.frequencyAnalysis.mid.min = Math.min(analysis.frequencyAnalysis.mid.min, entry.frequencyBands.mid);
            analysis.frequencyAnalysis.mid.max = Math.max(analysis.frequencyAnalysis.mid.max, entry.frequencyBands.mid);
            analysis.frequencyAnalysis.mid.avg += entry.frequencyBands.mid;

            analysis.frequencyAnalysis.treble.min = Math.min(analysis.frequencyAnalysis.treble.min, entry.frequencyBands.treble);
            analysis.frequencyAnalysis.treble.max = Math.max(analysis.frequencyAnalysis.treble.max, entry.frequencyBands.treble);
            analysis.frequencyAnalysis.treble.avg += entry.frequencyBands.treble;
        });

        const dataLength = this.loggingData.length || 1;
        analysis.frequencyAnalysis.bass.avg /= dataLength;
        analysis.frequencyAnalysis.mid.avg /= dataLength;
        analysis.frequencyAnalysis.treble.avg /= dataLength;

        return analysis;
    }

    generateDownloadFiles(analysis) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        const metadata = {
            duration: 60,
            sampleRate: 60,
            totalSamples: this.loggingData.length,
            sensitivitiesTested: this.sensitivities,
            timestamp: new Date().toISOString()
        };

        // Full dataset
        const fullData = {
            metadata,
            rawData: this.loggingData,
            analysis
        };

        // Summary report
        const summary = {
            metadata,
            analysis,
            summary: {
                totalClippingEvents: analysis.clippingEvents.length,
                averageLevels: analysis.averageLevels,
                peakValues: analysis.peakValues,
                valueRanges: analysis.valueRanges
            }
        };

        // Human-readable report
        const textReport = this.generateTextReport(analysis, metadata);

        return {
            fullData,
            summary,
            textReport,
            timestamp
        };
    }

    generateTextReport(analysis, metadata) {
        let report = `Audio Debug Analysis Report
Generated: ${metadata.timestamp}
Duration: ${metadata.duration} seconds
Samples: ${metadata.totalSamples}
Sensitivities Tested: ${metadata.sensitivitiesTested.join(', ')}

=== FREQUENCY BAND ANALYSIS ===
Bass (0-4): Min=${analysis.frequencyAnalysis.bass.min.toFixed(2)}, Max=${analysis.frequencyAnalysis.bass.max.toFixed(2)}, Avg=${analysis.frequencyAnalysis.bass.avg.toFixed(2)}
Mid (5-64): Min=${analysis.frequencyAnalysis.mid.min.toFixed(2)}, Max=${analysis.frequencyAnalysis.mid.max.toFixed(2)}, Avg=${analysis.frequencyAnalysis.mid.avg.toFixed(2)}
Treble (65+): Min=${analysis.frequencyAnalysis.treble.min.toFixed(2)}, Max=${analysis.frequencyAnalysis.treble.max.toFixed(2)}, Avg=${analysis.frequencyAnalysis.treble.avg.toFixed(2)}

=== SENSITIVITY ANALYSIS ===
`;

        metadata.sensitivitiesTested.forEach(sens => {
            report += `
Sensitivity ${sens}:
  Average Level: ${analysis.averageLevels[sens]?.toFixed(3) || 'N/A'}
  Peak Value: ${analysis.peakValues[sens]?.toFixed(3) || 'N/A'}
  Range: ${analysis.valueRanges[sens]?.min.toFixed(3) || 'N/A'} - ${analysis.valueRanges[sens]?.max.toFixed(3) || 'N/A'}
  Clipping Events: ${analysis.clippingEvents.filter(e => e.sensitivity === sens).length}
`;
        });

        report += `
=== CLIPPING EVENTS ===
Total: ${analysis.clippingEvents.length}
`;
        
        if (analysis.clippingEvents.length > 0) {
            analysis.clippingEvents.slice(0, 10).forEach(event => {
                report += `Time: ${event.time.toFixed(2)}s, Sensitivity: ${event.sensitivity}, Value: ${event.value.toFixed(3)}\n`;
            });
            if (analysis.clippingEvents.length > 10) {
                report += `... and ${analysis.clippingEvents.length - 10} more events\n`;
            }
        }

        return report;
    }

    getProgress() {
        if (!this.isLogging || !this.loggingStartTime) return 0;
        const elapsed = (Date.now() - this.loggingStartTime) / 1000;
        return Math.min(elapsed / 60, 1);
    }

    isCurrentlyLogging() {
        return this.isLogging;
    }
}

// Utility functions for downloading files
export function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function downloadText(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
