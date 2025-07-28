// Fragment shader for waveform visualization
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
    
    // Create waveform
    float y = uv.y;
    float x = uv.x;
    
    // Calculate waveform from audio data
    float wave = 0.0;
    float maxAmplitude = 0.0;
    
    // Sample multiple points from audio data to create smooth wave
    // Use constant indices for WebGL compatibility
    wave += u_audioData[0] * sin(6.28318 * x * 1.0 + u_time * 2.0) * exp(-0.0);
    wave += u_audioData[25] * sin(6.28318 * x * 2.0 + u_time * 2.0) * exp(-0.3);
    wave += u_audioData[50] * sin(6.28318 * x * 3.0 + u_time * 2.0) * exp(-0.6);
    wave += u_audioData[75] * sin(6.28318 * x * 4.0 + u_time * 2.0) * exp(-0.9);
    wave += u_audioData[100] * sin(6.28318 * x * 5.0 + u_time * 2.0) * exp(-1.2);
    wave += u_audioData[125] * sin(6.28318 * x * 6.0 + u_time * 2.0) * exp(-1.5);
    wave += u_audioData[150] * sin(6.28318 * x * 7.0 + u_time * 2.0) * exp(-1.8);
    wave += u_audioData[175] * sin(6.28318 * x * 8.0 + u_time * 2.0) * exp(-2.1);
    wave += u_audioData[200] * sin(6.28318 * x * 9.0 + u_time * 2.0) * exp(-2.4);
    wave += u_audioData[225] * sin(6.28318 * x * 10.0 + u_time * 2.0) * exp(-2.7);
    
    maxAmplitude = exp(-0.0) + exp(-0.3) + exp(-0.6) + exp(-0.9) + exp(-1.2) +
                   exp(-1.5) + exp(-1.8) + exp(-2.1) + exp(-2.4) + exp(-2.7);
    
    // Normalize wave
    if (maxAmplitude > 0.0) {
        wave = wave / maxAmplitude;
    }
    
    // Create wave appearance
    float wavePosition = 0.5 + wave * 0.3;
    float waveThickness = 0.02 + u_audioData[0] * 0.03;  // Thickness responds to bass
    float waveEdge = 0.005;
    
    // Create soft edges for the wave
    float waveMask = smoothstep(wavePosition - waveThickness - waveEdge, 
                                wavePosition - waveThickness, 
                                y) - 
                     smoothstep(wavePosition + waveThickness, 
                                wavePosition + waveThickness + waveEdge, 
                                y);
    
    // Add glow effect
    float glow = waveMask * (0.5 / (abs(y - wavePosition) * 100.0 + 0.1));
    
    // Color based on audio intensity
    float intensity = u_audioData[0] * 0.7 + u_audioData[64] * 0.3;  // Weighted average of bass and mid
    vec3 color = vec3(
        0.2 + 0.8 * intensity,  // Red
        0.1 + 0.9 * intensity * 0.7,  // Green
        0.3 + 0.7 * intensity  // Blue
    );
    
    // Add pulsing effect
    color *= 0.8 + 0.2 * sin(u_time * 3.0) * intensity;
    
    // Combine wave and glow
    vec3 finalColor = color * (waveMask + glow);
    
    // Add background
    vec3 backgroundColor = vec3(0.05, 0.0, 0.1);
    finalColor = mix(backgroundColor, finalColor, waveMask + glow);
    
    gl_FragColor = vec4(finalColor, 1.0);
}