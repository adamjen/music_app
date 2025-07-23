## Task 9: Implement Shader Presets

**Description**: Create multiple shader preset options that users can switch between.

**Requirements**:
- Create different GLSL fragment shaders for various visual effects
- Implement a UI control to select between presets
- Load and compile shaders on demand when switching presets
- Maintain smooth transitions between effects

**Acceptance Criteria**:
- Preset selection works from UI
- Each preset displays distinct visual effect
- No errors when switching between presets
- Visualization continues smoothly during transitions

**Example Implementation**:
```javascript
// In script.js (continue from previous task)
// Add this to your existing code

const shaderPresets = {
  spectrum: 'shaders/spectrum.glsl',
  waves: 'shaders/waves.glsl',
  particles: 'shaders/particles.glsl'
};

let currentShaderPreset = 'spectrum';

// Create preset selector UI (add to HTML)
const presetSelector = document.createElement('select');
Object.keys(shaderPresets).forEach(preset => {
  const option = document.createElement('option');
  option.value = preset;
  option.textContent = preset.charAt(0).toUpperCase() + preset.slice(1);
  presetSelector.appendChild(option);
});
document.getElementById('controls').appendChild(presetSelector);

presetSelector.addEventListener('change', async function() {
  const newPreset = this.value;
  if (newPreset !== currentShaderPreset) {
    currentShaderPreset = newPreset;

    // Load and compile the new shader
    fragmentShaderSource = await fetchShader(shaderPresets[newPreset]);
    const newFragmentShader = compileShader(webGLContext, webGLContext.FRAGMENT_SHADER, fragmentShaderSource);

    // Update shader program with new fragment shader
    updateShaderProgram(newFragmentShader);
  }
});

async function updateShaderProgram(newFragmentShader) {
  // Delete old fragment shader and attach new one
  webGLContext.deleteShader(fragmentShader);
  fragmentShader = newFragmentShader;
  webGLContext.attachShader(program, fragmentShader);
  webGLContext.linkProgram(program);

  if (!webGLContext.getProgramParameter(program, webGLContext.LINK_STATUS)) {
    console.error('Failed to link new shader program');
    return;
  }

  // Update shader variables and continue rendering
}
