## Task 6: Implement Basic Canvas Visualization

**Description**: Create a simple canvas visualization that responds to audio frequencies.

**Requirements**:
- Set up 2D rendering context
- Get frequency data from analyzer
- Create basic bar visualization based on frequency bands
- Update visualization in real-time during audio playback

**Acceptance Criteria**:
- Bars appear and move with audio frequencies
- Visualization updates smoothly during playback
- No graphical glitches or errors

**Example Implementation**:
```javascript
// In script.js (continue from previous task)
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
  let barHeight;
  let x = 0;

  // Draw bars for each frequency band
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  }

  // Continue animation loop
  requestAnimationFrame(visualize);
}
