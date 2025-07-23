## Task 8: Implement Shader-Based Visualization

**Description**: Create advanced visualizations using GLSL shaders that respond to audio frequency data.

**Requirements**:
- Update the visualization loop to use WebGL instead of Canvas 2D
- Pass frequency data as texture or uniform variable to shaders
- Create different shader presets (spectrum, waves, particles)
- Implement smooth transitions between shader effects

**Acceptance Criteria**:
- Shader visualizations work correctly on canvas
- Audio frequencies drive shader effects
- Smooth transitions when switching effects
- No performance issues with complex shaders

**Example Implementation**:
```javascript
// In script.js (continue from previous task)
function setupVisualizerWithShaders() {
  // Set up buffers and attributes for WebGL rendering
  setupBuffers();

  // Start animation loop
  requestAnimationFrame(renderWithShaders);
}

function renderWithShaders() {
  // Clear canvas
  webGLContext.clear(webGLContext.COLOR_BUFFER_BIT);

  // Get frequency data
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteFrequencyData(dataArray);

  // Update shader uniforms with frequency data
  updateShaderUniforms(dataArray);

  // Draw the scene
  drawScene();

  // Continue animation loop
  requestAnimationFrame(renderWithShaders);
}

function updateShaderUniforms(frequencyData) {
  // Send frequency data to shader as uniform or texture
  webGLContext.uniform1fv(frequencyUniformLocation, frequencyData);

  // Update other shader parameters (color, effect settings)
}

function drawScene() {
  // Draw the visualization using current shader program
  const positionAttributeLocation = webGLContext.getAttribLocation(program, 'a_position');
  webGLContext.bindBuffer(webGLContext.ARRAY_BUFFER, positionBuffer);
  webGLContext.vertexAttribPointer(positionAttributeLocation, 2, webGLContext.FLOAT, false, 0, 0);
  webGLContext.enableVertexAttribArray(positionAttributeLocation);

  // Draw call
  webGLContext.drawArrays(webGLContext.TRIANGLE_STRIP, 0, 4);
}
