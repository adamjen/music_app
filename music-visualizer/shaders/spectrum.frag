// Fragment shader for frequency spectrum visualization
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
    
    // Create radial gradient
    float radius = length(uv - 0.5);
    float angle = atan(uv.y - 0.5, uv.x - 0.5);
    
    // Map audio data to visual properties
    float bass = u_audioData[0];  // Low frequencies (bass)
    float mid = u_audioData[64];  // Mid frequencies
    float treble = u_audioData[128];  // High frequencies (treble)
    
    // Create pulsing effect based on bass
    float pulse = 0.5 + 0.5 * sin(u_time * 2.0 + bass * 10.0);
    
    // Create frequency bars
    float barCount = 64.0;
    float barWidth = 1.0 / barCount;
    float barIndex = floor(mod(angle / (2.0 * 3.14159) + u_time * 0.1, 1.0) * barCount);
    
    // Use texture sampling instead of dynamic array indexing
    float normalizedIndex = barIndex / 255.0;
    float barValue = u_audioData[0]; // Fallback to first element
    
    // Manual sampling for different indices
    if (barIndex < 1.0) barValue = u_audioData[0];
    else if (barIndex < 2.0) barValue = u_audioData[1];
    else if (barIndex < 4.0) barValue = u_audioData[2];
    else if (barIndex < 8.0) barValue = u_audioData[4];
    else if (barIndex < 16.0) barValue = u_audioData[8];
    else if (barIndex < 32.0) barValue = u_audioData[16];
    else if (barIndex < 64.0) barValue = u_audioData[32];
    else barValue = u_audioData[64];
    
    // Create bar appearance
    float bar = step(fract((uv.x + u_time * 0.2) * 10.0), barValue * 0.5 + 0.1);
    
    // Color based on frequency
    vec3 color = vec3(
        mix(0.8, 1.0, treble) * (0.5 + 0.5 * sin(u_time + 0.0)),  // Red component
        mix(0.5, 1.0, mid) * (0.5 + 0.5 * sin(u_time + 2.0)),     // Green component
        mix(0.2, 1.0, bass) * (0.5 + 0.5 * sin(u_time + 4.0))      // Blue component
    );
    
    // Combine effects
    float intensity = (bar * 0.8 + pulse * 0.2) * (1.0 - radius * 1.5);
    color *= intensity;
    
    // Add glow effect
    color += color * (0.2 / (radius * 10.0 + 0.1));
    
    gl_FragColor = vec4(color, 1.0);
}