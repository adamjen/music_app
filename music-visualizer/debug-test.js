// Debug test script to validate WebGL setup
console.log('=== Music Visualizer Debug Test ===');

// Test 1: Check if canvas exists
const canvas = document.getElementById('visualizer');
console.log('Canvas found:', !!canvas);
if (canvas) {
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
    console.log('Canvas client dimensions:', canvas.clientWidth, 'x', canvas.clientHeight);
}

// Test 2: Check WebGL context
let gl = null;
try {
    gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    console.log('WebGL context:', !!gl);
    if (gl) {
        console.log('WebGL version:', gl.getParameter(gl.VERSION));
        console.log('WebGL vendor:', gl.getParameter(gl.VENDOR));
        console.log('WebGL renderer:', gl.getParameter(gl.RENDERER));
    }
} catch (e) {
    console.error('WebGL context error:', e);
}

// Test 3: Check shader compilation
async function testShaderCompilation() {
    if (!gl) return;
    
    const vertexShaderSource = `
        attribute vec2 a_position;
        varying vec2 v_position;
        void main() {
            v_position = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;
    
    const fragmentShaderSource = `
        #ifdef GL_ES
        precision mediump float;
        #endif
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_audioData[256];
        varying vec2 v_position;
        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            float intensity = u_audioData[0] * 0.5 + 0.5;
            vec3 color = vec3(intensity, intensity * 0.7, intensity * 0.3);
            color += 0.1 * sin(u_time + uv.x * 10.0);
            gl_FragColor = vec4(color, 1.0);
        }
    `;
    
    try {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
            return false;
        }
        
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
            return false;
        }
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return false;
        }
        
        console.log('Shader compilation test: SUCCESS');
        return true;
    } catch (e) {
        console.error('Shader compilation test error:', e);
        return false;
    }
}

// Test 4: Check audio context
function testAudioContext() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        console.log('AudioContext available:', !!AudioContext);
        
        if (AudioContext) {
            const audioContext = new AudioContext();
            console.log('AudioContext state:', audioContext.state);
            console.log('AudioContext sample rate:', audioContext.sampleRate);
            audioContext.close();
        }
    } catch (e) {
        console.error('AudioContext test error:', e);
    }
}

// Run tests
setTimeout(() => {
    testShaderCompilation();
    testAudioContext();
}, 1000);

console.log('=== Debug Test Complete ===');