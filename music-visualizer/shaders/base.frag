// Fragment shader for base visualization
#ifdef GL_ES
precision mediump float;
#endif

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_audioData[256];

// Varying from vertex shader
varying vec2 v_position;

void main() {
    // Normalize coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Simple color based on audio data
    float intensity = u_audioData[0] * 0.5 + 0.5;
    vec3 color = vec3(intensity, intensity * 0.7, intensity * 0.3);
    
    // Add some movement
    color += 0.1 * sin(u_time + uv.x * 10.0);
    
    gl_FragColor = vec4(color, 1.0);
}