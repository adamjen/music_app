// Enhanced Fragment shader for dynamic wave visualization
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

// Noise function for organic effects
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
    float angle = atan(pos.y, pos.x) + 3.14159;
    
    // Audio analysis
    float bass = getAudioValue(0.0) * 0.4 + getAudioValue(1.0) * 0.3 + getAudioValue(2.0) * 0.3;
    float lowMid = getAudioValue(8.0) * 0.5 + getAudioValue(16.0) * 0.5;
    float mid = getAudioValue(32.0) * 0.5 + getAudioValue(48.0) * 0.5;
    float highMid = getAudioValue(64.0) * 0.5 + getAudioValue(96.0) * 0.5;
    float treble = getAudioValue(128.0) * 0.4 + getAudioValue(160.0) * 0.3 + getAudioValue(192.0) * 0.3;
    
    // Create dynamic wave patterns
    float waveCount = 8.0 + bass * 12.0;
    float waveSpeed = 2.0 + treble * 3.0;
    
    // Create multiple wave layers
    vec3 color = vec3(0.0);
    
    // Layer 1: Bass waves (large, slow)
    float bassWave = sin(pos.x * waveCount * 0.5 + u_time * waveSpeed * 0.3) * 
                     cos(pos.y * waveCount * 0.3 + u_time * waveSpeed * 0.2);
    bassWave *= bass * 0.5;
    color += vec3(1.0, 0.3, 0.1) * bassWave * 0.5;
    
    // Layer 2: Mid waves (medium)
    float midWave = sin(pos.x * waveCount * 1.2 + u_time * waveSpeed * 0.8) * 
                    cos(pos.y * waveCount * 0.8 + u_time * waveSpeed * 0.6);
    midWave *= mid * 0.4;
    color += vec3(0.3, 1.0, 0.6) * midWave * 0.4;
    
    // Layer 3: Treble waves (fast, detailed)
    float trebleWave = sin(pos.x * waveCount * 2.5 + u_time * waveSpeed * 1.5) * 
                       cos(pos.y * waveCount * 2.0 + u_time * waveSpeed * 1.2);
    trebleWave *= treble * 0.3;
    color += vec3(0.4, 0.6, 1.0) * trebleWave * 0.3;
    
    // Create radial waves
    float radialWave = sin(dist * 15.0 - u_time * 3.0) * (bass + mid) * 0.3;
    color += vec3(0.8, 0.5, 1.0) * radialWave * 0.4;
    
    // Add spiral effects
    float spiral = sin(angle * 6.0 + dist * 20.0 - u_time * 4.0) * 
                   (lowMid + highMid) * 0.2;
    color += vec3(1.0, 0.8, 0.4) * spiral * 0.3;
    
    // Create particle flow
    vec2 flowUV = uv * 8.0 + vec2(u_time * 0.8, u_time * 0.6);
    float flow = fractalNoise(flowUV) * (bass + treble) * 0.2;
    color += vec3(0.6, 0.8, 1.0) * flow * 0.2;
    
    // Add energy bursts
    float burst = exp(-abs(dist - 0.3 - sin(u_time * 2.0) * 0.2) * 10.0) * 
                  (bass + mid) * 0.5;
    color += vec3(1.0, 0.6, 0.2) * burst * 0.6;
    
    // Create interference patterns
    float interference = sin(pos.x * 20.0 + u_time * 3.0) * 
                        sin(pos.y * 15.0 + u_time * 2.5) * 
                        (mid + treble) * 0.1;
    color += vec3(0.8, 0.8, 1.0) * interference * 0.3;
    
    // Add glowing edges
    float edgeGlow = exp(-abs(dist - 0.4) * 8.0) * (bass + treble) * 0.3;
    color += vec3(0.9, 0.7, 1.0) * edgeGlow * 0.4;
    
    // Create pulsing center
    float centerPulse = exp(-dist * 5.0) * (bass * 0.5 + 0.3) * 
                       (1.0 + sin(u_time * 4.0) * 0.3);
    color += vec3(1.0, 0.8, 0.5) * centerPulse * 0.5;
    
    // Add chromatic aberration
    float chromatic = sin(pos.x * 30.0 + u_time * 5.0) * 
                     cos(pos.y * 25.0 + u_time * 4.5) * 0.02;
    color.r += chromatic * treble * 0.5;
    color.b -= chromatic * treble * 0.5;
    
    // Vignette effect
    float vignette = 1.0 - customSmoothstep(0.5, 0.8, dist);
    color *= vignette;
    
    // Final color enhancement
    color = pow(color, vec3(0.9));
    color = clamp(color, 0.0, 2.0);
    
    gl_FragColor = vec4(color, 1.0);
}
