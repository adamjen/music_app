// Main script file for Music Visualizer
// This is where all audio processing and visualization logic will be implemented

console.log('Music Visualizer script loaded');

// Audio processing setup
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
  if (source) {
    // Connect the nodes
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    source.start(0);
  }
}

// Visualization setup
let canvas;
let ctx;

// WebGL variables
let gl;
let vertexShader;
let fragmentShader;
let shaderProgram;
let frequencyTexture;
let resolutionUniform;
let timeUniform;

function setupVisualizer() {
  // Get canvas element and context
  canvas = document.getElementById('visualizer');
  ctx = canvas.getContext('2d');

  // Set up WebGL context if available
  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      console.log('WebGL initialized successfully');
      setupShaders();
      setupWebGLBuffers();
    } else {
      console.warn('WebGL not supported, falling back to Canvas 2D');
    }
  } catch (e) {
    console.error('Error initializing WebGL:', e);
  }

  // Start animation loop
  requestAnimationFrame(visualize);
}

function visualize() {
  if (gl) {
    renderWithWebGL();
  } else {
    // Fallback to Canvas 2D visualization
    ctx.fillStyle = 'rgb(18, 18, 18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteFrequencyData(dataArray);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
      x += barWidth + 1;
    }
  }

  requestAnimationFrame(visualize);
}

// Initialize audio setup when the script loads
setupAudio();

// Set up event listeners for controls
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

function setupShaders() {
  // Load vertex shader
  const vsSource = `
    attribute vec4 a_position;
    void main(void) {
      gl_Position = a_position;
    }
  `;

  // Create vertex shader object
  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('Vertex shader error:', gl.getShaderInfoLog(vertexShader));
    return;
  }

  // Load fragment shader from file
  loadFragmentShader('shaders/spectrum.glsl', (shader) => {
    if (!shader) return;

    fragmentShader = shader;
    createShaderProgram();
  });
}

function loadFragmentShader(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const fsSource = xhr.responseText;

      // Create fragment shader object
      fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fsSource);
      gl.compileShader(fragmentShader);

      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader error:', gl.getShaderInfoLog(fragmentShader));
        callback(null);
      } else {
        callback(fragmentShader);
      }
    } else {
      console.error('Failed to load fragment shader:', url);
      callback(null);
    }
  };
  xhr.send();
}

function createShaderProgram() {
  // Create and link program
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Shader program linking error:', gl.getProgramInfoLog(shaderProgram));
    return;
  }

  // Get uniform locations
  resolutionUniform = gl.getUniformLocation(shaderProgram, 'u_resolution');
  timeUniform = gl.getUniformLocation(shaderProgram, 'u_time');

  // Set up initial uniforms
  if (resolutionUniform) {
    gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
  }

  console.log('Shader program created successfully');
}

function setupWebGLBuffers() {
  // Create a full-screen quad for rendering
  const vertices = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
     1.0,  1.0,
  ]);

  // Create buffer and put data in it
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Get attribute location for position
  const aPosition = gl.getAttribLocation(shaderProgram, 'a_position');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  // Set up frequency data texture
  setupFrequencyTexture();
}

function setupFrequencyTexture() {
  // Create a texture to hold frequency data
  frequencyTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, frequencyTexture);

  // Initialize with empty data (will be updated in render loop)
  const emptyData = new Uint8Array(analyzer.frequencyBinCount * 4);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,           // Mipmap level
    gl.RGBA,    // Format
    analyzer.frequencyBinCount,   // Width (number of frequency bins)
    1,          // Height (1 pixel tall)
    0,          // Border
    gl.RGBA,    // Format again
    gl.UNSIGNED_BYTE, // Data type
    emptyData   // Data
  );

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  console.log('Frequency data texture initialized');
}

function renderWithWebGL() {
  // Clear the canvas
  gl.clearColor(0.07, 0.07, 0.07, 1.0); // Dark gray background
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Use the shader program
  gl.useProgram(shaderProgram);

  // Update time uniform
  const currentTime = Date.now() / 1000; // Time in seconds
  if (timeUniform) {
    gl.uniform1f(timeUniform, currentTime);
  }

  // Update frequency data texture
  updateFrequencyTexture();

  // Bind the frequency texture to a specific unit
  gl.activeTexture(gl.TEXTURE0);

  // Set the sampler2D uniform in the shader program
  const freqTextureUniform = gl.getUniformLocation(shaderProgram, 'u_frequencyData');
  if (freqTextureUniform) {
    gl.uniform1i(freqTextureUniform, 0); // Texture unit 0
  }

  // Draw full-screen quad
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function updateFrequencyTexture() {
  if (!frequencyTexture || !analyzer) return;

  // Get frequency data from the analyzer
  const dataArray = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteFrequencyData(dataArray);

  // Create RGBA data where R=G=B=frequency, A=1
  const textureData = new Uint8Array(analyzer.frequencyBinCount * 4);
  for (let i = 0; i < analyzer.frequencyBinCount; i++) {
    const freq = dataArray[i];
    textureData[i * 4] = freq;       // R channel
    textureData[i * 4 + 1] = freq;   // G channel
    textureData[i * 4 + 2] = freq;   // B channel
    textureData[i * 4 + 3] = 255;   // A channel (fully opaque)
  }

  // Update the texture with new frequency data
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, frequencyTexture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    analyzer.frequencyBinCount,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    textureData
  );
}

function loadFragmentShader(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const fsSource = xhr.responseText;

      // Create fragment shader object
      fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fsSource);
      gl.compileShader(fragmentShader);

      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader error:', gl.getShaderInfoLog(fragmentShader));
        callback(null);
      } else {
        callback(fragmentShader);
      }
    } else {
      console.error('Failed to load fragment shader:', url);
      callback(null);
    }
  };
  xhr.send();
}

function createShaderProgram() {
  // Create and link program
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Shader program linking error:', gl.getProgramInfoLog(shaderProgram));
    return;
  }

  // Get uniform locations
  resolutionUniform = gl.getUniformLocation(shaderProgram, 'u_resolution');
  timeUniform = gl.getUniformLocation(shaderProgram, 'u_time');

  // Set up initial uniforms
  if (resolutionUniform) {
    gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
  }

  console.log('Shader program created successfully');
}

function loadShaderPreset(shaderFile) {
  if (!shaderFile || !gl || !shaderProgram) return;

  // Load and compile new fragment shader
  console.log(`Loading shader preset: ${shaderFile}`);
  loadFragmentShader(`shaders/${shaderFile}`, (newShader) => {
    if (newShader) {
      // Replace the current fragment shader in the program
      gl.deleteShader(fragmentShader);
      fragmentShader = newShader;

      // Re-link the shader program with the new fragment shader
      const newProgram = gl.createProgram();
      gl.attachShader(newProgram, vertexShader);
      gl.attachShader(newProgram, fragmentShader);
      gl.linkProgram(newProgram);

      if (!gl.getProgramParameter(newProgram, gl.LINK_STATUS)) {
        console.error('Failed to link new shader program:', gl.getProgramInfoLog(newProgram));
        return;
      }

      // Update the active shader program
      shaderProgram = newProgram;

      // Update uniform locations for the new program
      resolutionUniform = gl.getUniformLocation(shaderProgram, 'u_resolution');
      timeUniform = gl.getUniformLocation(shaderProgram, 'u_time');

      if (resolutionUniform) {
        gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      }

      console.log(`Successfully loaded shader preset: ${shaderFile}`);
    }
  });
}

// Set up event listener for shader selection
document.getElementById('shaderSelect').addEventListener('change', function() {
  const selectedShader = this.value;
  loadShaderPreset(selectedShader);
});

// Initialize visualizer when the window loads
window.addEventListener('load', setupVisualizer);
