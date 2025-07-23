## Task 7: Implement GLSL Shader Support

**Description**: Add WebGL support with GLSL shaders for advanced visualizations.

**Requirements**:
- Set up WebGL rendering context
- Create basic shader programs (vertex and fragment)
- Implement uniform variables to pass frequency data
- Load and compile shader files from the shaders directory

**Acceptance Criteria**:
- Shader-based visualization works on canvas
- Frequency data is passed to shaders correctly
- No compilation errors in console
- Basic visual effects appear when audio plays

**Example Implementation**:
```javascript
// In script.js (continue from previous task)
let webGLContext;
let vertexShaderSource;
let fragmentShaderSource;

function setupWebGL() {
  // Get WebGL context from canvas
  webGLContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!webGLContext) {
    console.error('WebGL not supported');
    return;
  }

  // Load shader sources
  loadShaderSources().then(() => {
    createShaderProgram();
    setupVisualizerWithShaders();
  });
}

async function loadShaderSources() {
  vertexShaderSource = await fetchShader('shaders/base.vert');
  fragmentShaderSource = await fetchShader('shaders/spectrum.frag');

  // Compile shaders
  const vertexShader = compileShader(webGLContext, webGLContext.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(webGLContext, webGLContext.FRAGMENT_SHADER, fragmentShaderSource);

  return { vertexShader, fragmentShader };
}

function createShaderProgram() {
  // Create and link shader program
  const program = webGLContext.createProgram();
  webGLContext.attachShader(program, vertexShader);
  webGLContext.attachShader(program, fragmentShader);
  webGLContext.linkProgram(program);

  if (!webGLContext.getProgramParameter(program, webGLContext.LINK_STATUS)) {
    console.error('Failed to link shader program');
    return;
  }

  webGLContext.useProgram(program);

  // Get uniform locations
  frequencyUniformLocation = webGLContext.getUniformLocation(program, 'u_frequencyData');

  // Set up buffers and attributes (omitted for brevity)
}
