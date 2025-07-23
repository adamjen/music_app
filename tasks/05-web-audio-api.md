## Task 5: Implement Web Audio API Integration

**Description**: Set up Web Audio API to handle audio processing and visualization.

**Requirements**:
- Create an audio context
- Implement audio source handling for both local files and radio stream
- Set up frequency analysis
- Connect analyzer to canvas rendering

**Acceptance Criteria**:
- Audio plays from both file input and radio button
- Frequency data is properly analyzed
- No errors in console when switching sources
- Basic visualization appears on canvas (even if simple)

**Example Implementation**:
```javascript
// In script.js
let audioContext;
let source;
let analyzer;

function setupAudio() {
  // Create a new AudioContext
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Set up the analyzer node
  analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 256; // Number of data points

  // Connect nodes in chain: source -> analyzer -> destination
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);

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
