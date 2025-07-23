# Music Visualizer Development Plan

## Overview
This document provides a step-by-step development plan for completing the music visualizer project. The plan is organized based on the current gap analysis and prioritizes tasks to ensure a solid foundation before moving to more advanced features.

## Current Project Status
- **HTML Structure**: Basic structure exists but missing JavaScript functionality
- **CSS Styling**: Basic styling implemented
- **JavaScript Functionality**: Main `script.js` file is missing (critical for all audio and visualization features)

## Priority Development Plan

### Phase 1: Core Audio & Visualization Foundation

#### Step 1: Create `script.js` File
**Objective**: Establish the main JavaScript file that will coordinate all audio processing and visualization.

**Tasks**:
- Create a new file: `music-visualizer/script.js`
- Reference this file in `index.html`

**Reference Documents**:
- [docs/style-guide.md](style-guide.md) for coding standards

#### Step 2: Implement Basic Web Audio API Integration
**Objective**: Set up the core audio processing pipeline.

**Tasks**:
1. Create an AudioContext
2. Set up basic frequency analysis
3. Handle both file uploads and radio stream sources

**Implementation Details**:
```javascript
let audioContext;
let source;
let analyzer;

function setupAudio() {
  // Create a new AudioContext
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Set up the analyzer node
  analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 256; // Number of data points

  return analyzer;
}

function loadAudioFromFile(file) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const arrayBuffer = this.result;
    audioContext.decodeAudioData(arrayBuffer).then(decodedData => {
      source = audioContext.createBufferSource();
      source.buffer = decodedData;
      setupVisualizer();
      playAudio();
    });
  };
  fileReader.readAsArrayBuffer(file);
}

function loadRadioStream(url) {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    audioContext.decodeAudioData(request.response).then(decodedData => {
      source = audioContext.createBufferSource();
      source.buffer = decodedData;
      setupVisualizer();
      playAudio();
    });
  };
  request.send();
}

function playAudio() {
  source.start(0);
}
```

**Reference Documents**:
- [docs/music-visualizer/README.md](music-visualizer/README.md) for audio processing details

#### Step 3: Implement Audio Controls Functionality
**Objective**: Add interactivity to the audio source controls.

**Tasks**:
1. Create a file input for uploading audio files
2. Create a button to toggle between local files and radio stream
3. Add event listeners to handle control changes
4. Update the visualizer when switching sources

**Implementation Details**:
```javascript
// In HTML (add this to #controls div)
<input type="file" id="audioFileInput" accept="audio/*">
<button id="radioButton">Switch to Radio</button>

// In script.js
document.getElementById('radioButton').addEventListener('click', function() {
  const isRadio = !this.dataset.isRadio || this.dataset.isRadio === 'false';
  this.textContent = isRadio ? 'Switch to Local File' : 'Switch to Radio';
  this.dataset.isRadio = isRadio;

  if (isRadio) {
    loadRadioStream('http://example.com/radio.mp3');
  } else {
    document.getElementById('audioFileInput').disabled = false;
  }
});

document.getElementById('audioFileInput').addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    loadAudioFromFile(file);
  }
});
```

**Reference Documents**:
- [docs/components.md](components.md) for UI component patterns
- [docs/style-guide.md](style-guide.md) for coding standards

#### Step 4: Implement Basic Canvas Visualization
**Objective**: Create a simple frequency-based visualization.

**Tasks**:
1. Set up the canvas rendering context
2. Get frequency data from analyzer
3. Create basic bar visualization based on frequency bands
4. Update visualization in real-time during audio playback

**Implementation Details**:
```javascript
let canvas;
let ctx;

function setupVisualizer() {
  // Get canvas element and context
  canvas = document.getElementById('visualizer');
  ctx = canvas.getContext('2d');

  // Start animation loop
  requestAnimationFrame(visualize);
}

function visualize() {
  // Clear the canvas
  ctx.fillStyle = 'rgb(18, 18, 18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Get frequency data from analyzer
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteFrequencyData(dataArray);

  // Set up bar visualization parameters
  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  // Draw bars for each frequency band
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    x += barWidth + 1;
  }

  // Continue animation loop
  requestAnimationFrame(visualize);
}
```

**Reference Documents**:
- [docs/music-visualizer/README.md](music-visualizer/README.md) for visualization approach

### Phase 2: Advanced Visualization Features

#### Step 5: Implement GLSL Shader Support
**Objective**: Add WebGL support with GLSL shaders for advanced visualizations.

**Tasks**:
1. Set up WebGL rendering context
2. Create basic shader programs (vertex and fragment)
3. Implement uniform variables to pass frequency data
4. Load and compile shader files from the shaders directory

#### Step 6: Implement Shader-Based Visualization
**Objective**: Create advanced visualizations using GLSL shaders.

**Tasks**:
1. Update the visualization loop to use WebGL instead of Canvas 2D
2. Pass frequency data as texture or uniform variable to shaders
3. Create different shader presets (spectrum, waves, particles)
4. Implement smooth transitions between shader effects

#### Step 7: Implement Shader Presets
**Objective**: Allow users to switch between different visual effects.

**Tasks**:
1. Create different GLSL fragment shaders for various visual effects
2. Implement a UI control to select between presets
3. Load and compile shaders on demand when switching presets
4. Maintain smooth transitions between effects

### Phase 3: Audio Enhancements & Quality Assurance

#### Step 8: Implement Advanced Audio Features
**Objective**: Add sophisticated audio processing capabilities.

**Tasks**:
1. Implement real-time spectrum analyzer with configurable resolution
2. Add waveform visualization option
3. Create options for different audio analysis modes (RMS, peak detection)
4. Implement smooth crossfading between audio sources

#### Step 9: Testing and Debugging
**Objective**: Ensure robustness across platforms and devices.

**Tasks**:
1. Test with various audio file formats
2. Test on different browsers and devices
3. Check performance under heavy load
4. Fix any visual or audio glitches
5. Ensure responsive behavior across screen sizes

### Implementation Notes

- **File Organization**: Keep all JavaScript code in `script.js` initially, then modularize as the project grows
- **Testing**: Test each feature incrementally to catch integration issues early
- **Documentation**: Refer to the comprehensive documentation in [docs/music-visualizer/README.md](music-visualizer/README.md) for detailed implementation guidance

## Expected Development Sequence

1. [ ] Create `script.js` file and reference it
2. [ ] Implement basic Web Audio API setup
3. [ ] Add audio control functionality
4. [ ] Develop basic canvas visualization
5. [ ] Move to shader-based visualizations (once core pipeline works)
6. [ ] Implement advanced audio features
7. [ ] Perform comprehensive testing across platforms

## Task Completion Checklist

### Phase 1: Core Audio & Visualization Foundation

#### Step 1: Create `script.js` File
- [x] Create a new file: `music-visualizer/script.js`
- [x] Reference this file in `index.html`

#### Step 2: Implement Basic Web Audio API Integration
- [x] Set up AudioContext
- [x] Configure frequency analysis node
- [x] Implement audio source handling for files
- [x] Implement radio stream loading

#### Step 3: Implement Audio Controls Functionality
- [x] Add file input element to HTML
- [x] Add radio toggle button to HTML
- [x] Create event listeners for control changes
- [x] Update visualizer on source switch

#### Step 4: Implement Basic Canvas Visualization
- [x] Set up canvas rendering context
- [x] Get frequency data from analyzer
- [x] Create bar visualization based on frequency bands
- [x] Start animation loop for real-time updates

### Phase 2: Advanced Visualization Features

#### Step 5: Implement GLSL Shader Support
- [ ] Set up WebGL rendering context
- [ ] Create basic shader programs (vertex and fragment)
- [ ] Pass frequency data to shaders via uniforms
- [ ] Load shader files from the shaders directory

#### Step 6: Implement Shader-Based Visualization
- [ ] Update visualization loop for WebGL rendering
- [ ] Pass frequency data as texture or uniform variable
- [ ] Create different shader presets (spectrum, waves)
- [ ] Implement smooth transitions between effects

#### Step 7: Implement Shader Presets
- [ ] Create UI control for preset selection
- [ ] Load and compile shaders on demand when switching
- [ ] Maintain visual consistency during transitions

### Phase 3: Audio Enhancements & Quality Assurance

#### Step 8: Implement Advanced Audio Features
- [ ] Add configurable resolution spectrum analyzer
- [ ] Create waveform visualization option
- [ ] Implement different audio analysis modes (RMS, peak detection)
- [ ] Add smooth crossfading between sources

#### Step 9: Testing and Debugging
- [ ] Test with various audio file formats
- [ ] Perform cross-browser testing
- [ ] Check performance under heavy load
- [ ] Fix visual/audio glitches
- [ ] Ensure responsive behavior across screen sizes

By following this plan, we'll ensure a solid foundation is established before moving to more complex features.
