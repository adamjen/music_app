## Task 10: Implement Advanced Audio Features

**Description**: Add more sophisticated audio processing capabilities.

**Requirements**:
- Implement real-time spectrum analyzer with configurable resolution
- Add waveform visualization option
- Create options for different audio analysis modes (RMS, peak detection)
- Implement smooth crossfading between audio sources

**Acceptance Criteria**:
- Spectrum and waveform visualizations work correctly
- Audio analysis modes function as expected
- Crossfading works without audio glitches
- All features are accessible from UI controls

**Example Implementation**:
```javascript
// In script.js (continue from previous task)
// Add this to your existing code

const audioModes = {
  spectrum: 'Spectrum Analysis',
  waveform: 'Waveform Display'
};

let currentAudioMode = 'spectrum';

// Create audio mode selector UI (add to HTML)
const modeSelector = document.createElement('select');
Object.keys(audioModes).forEach(mode => {
  const option = document.createElement('option');
  option.value = mode;
  option.textContent = audioModes[mode];
  modeSelector.appendChild(option);
});
document.getElementById('controls').appendChild(modeSelector);

modeSelector.addEventListener('change', function() {
  currentAudioMode = this.value;
  updateAudioVisualization();
});

function updateAudioVisualization() {
  // Update analyzer settings based on selected mode
  if (currentAudioMode === 'spectrum') {
    analyzer.fftSize = 256; // More frequency bands
  } else {
    analyzer.fftSize = 8192; // More time resolution for waveforms
  }

  // Update shader uniform or visualization logic as needed
}

function setupCrossfading() {
  let fadeDuration = 2000; // ms
  let isFading = false;

  function startFade(newSource) {
    if (isFading) return;

    isFading = true;
    const startTime = Date.now();

    source.connect(audioContext.destination);

    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      // Apply gain curve for crossfading
      const currentGain = 1 - progress;
      source.gain.value = currentGain;

      if (progress >= 1) {
        clearInterval(fadeInterval);
        isFading = false;
        source.disconnect();

        // Switch to new source
        startNewSource(newSource);
      }
    }, 50);
  }

  function startNewSource(source) {
    source.start(0);
    currentSource = source;
  }
}
