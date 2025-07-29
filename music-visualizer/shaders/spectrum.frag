// Enhanced Fragment shader for dynamic frequency spectrum visualization
#ifdef GL_ES
precision mediump float;
#endif

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_audioData[256];

// Varying from vertex shader
varying vec2 v_position;

// Helper functions
float getAudioValue(float index) {
    float idx = clamp(index, 0.0, 255.0);
    if (idx < 1.0) return u_audioData[0];
    else if (idx < 2.0) return u_audioData[1];
    else if (idx < 4.0) return u_audioData[2];
    else if (idx < 8.0) return u_audioData[4];
    else if (idx < 16.0) return u_audioData[8];
    else if (idx < 32.0) return u_audioData[16];
    else if (idx < 64.0) return u_audioData[32];
    else if (idx < 128.0) return u_audioData[64];
    else return u_audioData[128];
}

// Noise function for particle effects
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float fractalNoise(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    value += amplitude * noise(st);
    st *= 2.0;
    amplitude *= 0.5;
    value += amplitude * noise(st);
    st *= 2.0;
    amplitude *= 0.5;
    value += amplitude * noise(st);
    st *= 2.0;
    amplitude *= 0.5;
    value += amplitude * noise(st);
    return value;
}

// Custom smooth step function (renamed to avoid conflict)
float customSmoothstep(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

void main() {
    // Normalize coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 center = vec2(0.5, 0.5);
    vec2 pos = uv - center;
    
    // Calculate polar coordinates
    float dist = length(pos);
    float angle = atan(pos.y, pos.x) + 3.14159; // 0 to 2π
    
    // Audio analysis
    float bass = getAudioValue(0.0) * 0.4 + getAudioValue(1.0) * 0.3 + getAudioValue(2.0) * 0.3;
    float lowMid = getAudioValue(8.0) * 0.5 + getAudioValue(16.0) * 0.5;
    float mid = getAudioValue(32.0) * 0.5 + getAudioValue(48.0) * 0.5;
    float highMid = getAudioValue(64.0) * 0.5 + getAudioValue(96.0) * 0.5;
    float treble = getAudioValue(128.0) * 0.4 + getAudioValue(160.0) * 0.3 + getAudioValue(192.0) * 0.3;
    
    // Create 3D frequency bars in circular arrangement
    float barCount = 128.0;
    float barIndex = angle / (2.0 * 3.14159) * barCount;
    float barWidth = 1.0 / barCount;
    
    // Get frequency value for this bar
    float freqIndex = barIndex * 2.0;
    float freqValue = getAudioValue(freqIndex);
    
    // Create 3D bar height with audio response
    float barHeight = freqValue * 0.8;
    float barDepth = customSmoothstep(0.0, 1.0, barHeight);
    
    // Calculate bar position
    float radius = 0.1 + barHeight * 0.4;
    float innerRadius = 0.05;
    
    // Create bar shape
    float barAngle = fract(barIndex / barCount) * 2.0 * 3.14159;
    float angleDiff = abs(angle - barAngle);
    angleDiff = min(angleDiff, 2.0 * 3.14159 - angleDiff);
    
    float barMask = customSmoothstep(barWidth * 1.5, barWidth * 0.5, angleDiff);
    float barMask2 = customSmoothstep(innerRadius, radius, dist) * customSmoothstep(radius + 0.02, radius, dist);
    
    // Create pulsing effects
    float pulse = sin(u_time * 2.0 + barIndex * 0.1) * 0.3 + 0.7;
    float audioPulse = sin(u_time * 5.0 + bass * 10.0) * 0.5 + 0.5;
    
    // Color generation based on frequency
    vec3 color;
    
    // Low frequencies - red/orange
    color.r = 0.8 + bass * 0.5 + barHeight * 0.5;
    color.g = 0.2 + lowMid * 0.6 + barHeight * 0.3;
    color.b = 0.1 + highMid * 0.4;
    
    // Mid frequencies - green/yellow
    if (freqIndex > 16.0) {
        color.r = 0.6 + lowMid * 0.4;
        color.g = 0.8 + mid * 0.5;
        color.b = 0.3 + highMid * 0.3;
    }
    
    // High frequencies - blue/cyan
    if (freqIndex > 64.0) {
        color.r = 0.3 + treble * 0.3;
        color.g = 0.6 + treble * 0.4;
        color.b = 0.9 + treble * 0.5;
    }
    
    // Apply bar mask
    float intensity = barMask * barMask2 * pulse;
    color *= intensity;
    
    // Add glow effect
    float glow = exp(-abs(dist - radius) * 50.0) * barHeight * 0.5;
    color += vec3(1.0, 0.8, 0.6) * glow * audioPulse;
    
    // Create center glow
    float centerGlow = exp(-dist * 10.0) * (bass * 0.5 + 0.3);
    color += vec3(1.0, 0.5, 0.2) * centerGlow * audioPulse;
    
    // Add rotating energy rings
    float ringRadius1 = 0.2 + sin(u_time * 1.0) * 0.05;
    float ringWidth1 = 0.01 + freqValue * 0.02;
    float ring1 = smoothstep(ringRadius1 - ringWidth1, ringRadius1, dist) * 
                  smoothstep(ringRadius1 + ringWidth1, ringRadius1, dist);
    color += vec3(0.2, 0.4, 0.8) * ring1 * (0.3 + treble * 0.5);
    
    float ringRadius2 = 0.35 + sin(u_time * 1.5) * 0.05;
    float ringWidth2 = 0.01 + freqValue * 0.02;
    float ring2 = smoothstep(ringRadius2 - ringWidth2, ringRadius2, dist) * 
                  smoothstep(ringRadius2 + ringWidth2, ringRadius2, dist);
    color += vec3(0.3, 0.5, 0.9) * ring2 * (0.2 + treble * 0.4);
    
    float ringRadius3 = 0.5 + sin(u_time * 2.0) * 0.05;
    float ringWidth3 = 0.01 + freqValue * 0.02;
    float ring3 = smoothstep(ringRadius3 - ringWidth3, ringRadius3, dist) * 
                  smoothstep(ringRadius3 + ringWidth3, ringRadius3, dist);
    color += vec3(0.4, 0.6, 1.0) * ring3 * (0.1 + treble * 0.3);
    
    // Add particle effects
    vec2 particleUV = uv * 10.0 + vec2(u_time * 0.5, u_time * 0.3);
    float particles = fractalNoise(particleUV) * fractalNoise(particleUV * 2.0);
    color += vec3(0.3, 0.5, 0.7) * particles * freqValue * 0.3 * exp(-dist * 2.0);
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 0.7, dist);
    color *= vignette;
    
    // Final color boost
    color = pow(color, vec3(0.9));
    color = clamp(color, 0.0, 1.5);
    
    gl_FragColor = vec4(color, 1.0);
}
