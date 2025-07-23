# Interactive Music Visualizer

A web-based application that creates dynamic visualizations synchronized with audio in real-time.

## Overview

The Interactive Music Visualizer transforms music into captivating visual patterns. It analyzes the audio frequency spectrum and generates responsive light patterns using WebGL shaders.

## Key Features

- **Real-Time Audio Analysis**: Using Web Audio API
- **Dynamic Light Patterns**: React to music frequency spectrum
- **Customizable Visual Styles**: Adjustable shader parameters
- **User Input Support**: Upload audio files or stream radio

## Technologies Used

- HTML5 for structure
- CSS3 for styling
- JavaScript (ES6) for interactivity
- Web Audio API for audio analysis
- WebGL and GLSL shaders for visual effects

## Project Structure

```
music-visualizer/
├── index.html          # Main entry point
├── style.css           # Styling
├── script.js            # Core visualization logic
├── audio/               # Audio processing modules
│   ├── analyzer.js       # Audio frequency analysis
│   └── loader.js        # Audio file loading
└── shaders/             # GLSL shader files
    ├── base.glsl         # Base visual effects
    ├── spectrum.glsl     # Frequency spectrum visualization
    └── waves.glsl        # Waveform visualization
```

## Setup and Usage

1. **Prerequisites**: Ensure you have a modern web browser with WebGL support
2. **Installation**:
   ```
   git clone [repository_url]
   cd music-visualizer
   npm install
   ```
3. **Run the application**:
   ```
   npm start
   ```
4. **Access** the visualizer at `http://localhost:8080`

## Configuration Options

The visualizer can be configured via JavaScript parameters:

```javascript
const config = {
  defaultAudioSource: 'radio', // or 'upload'
  radioStation: 'http://example.com/radio.mp3',
  shaderPresets: ['spectrum', 'waves', 'particles'],
  autoRotate: true,
  sensitivity: 0.75 // audio analysis sensitivity
};
```

## Audio Processing

The visualizer uses the Web Audio API for real-time audio processing:

```javascript
function setupAudio() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(document.getElementById('audio'));
  const analyzer = audioContext.createAnalyser();

  source.connect(analyzer);
  source.connect(audioContext.destination);

  return {
    context: audioContext,
    analyzer: analyzer
  };
}
```

## Shader Effects

The visualizer includes various shader effects:

- **Spectrum**: Visualizes frequency spectrum as bars
- **Waves**: Displays waveform patterns
- **Particles**: Particle animations synchronized with audio

Example shader configuration:

```javascript
const shaderConfig = {
  type: 'spectrum',
  parameters: {
    barWidth: 5,
    maxBars: 64,
    color: [255, 100, 100]
  }
};
```

## Testing the Application

To test the application, run the following command:
```
npm test
```

This will execute unit tests for audio processing and rendering components.

## Known Issues

- Performance can vary based on browser WebGL implementation
- Some audio formats may not be supported in all browsers

## Future Enhancements

1. Add support for MIDI input
2. Implement user-customizable shaders
3. Develop a preset library
4. Create collaborative visualizer sessions

## Contributing

We welcome contributions! Please follow our [contribution guidelines](CONTRIBUTING.md) when submitting pull requests.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
