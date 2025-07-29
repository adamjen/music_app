// WebGL-Compatible Cosmic Galaxy
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_audioData[256];

// Simple noise function
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 center = vec2(0.5, 0.5);
    vec2 pos = uv - center;
    
    float dist = length(pos);
    float angle = atan(pos.y, pos.x);
    
    // Safe audio analysis - use fixed indices
    float bass = (u_audioData[0] + u_audioData[1] + u_audioData[2] + u_audioData[3]) * 0.25;
    float mid = (u_audioData[32] + u_audioData[33] + u_audioData[34] + u_audioData[35]) * 0.25;
    float treble = (u_audioData[128] + u_audioData[129] + u_audioData[130] + u_audioData[131]) * 0.25;
    
    bass = clamp(bass, 0.0, 1.0);
    mid = clamp(mid, 0.0, 1.0);
    treble = clamp(treble, 0.0, 1.0);
    
    // Cosmic spiral effect
    float time = u_time * 0.3 + bass * 0.2;
    float spiral = sin(angle * 8.0 + time * 3.0 + dist * 15.0) * 0.5 + 0.5;
    
    // Create nebula patterns
    float nebula = noise(pos * 10.0 + time * 0.5);
    nebula = pow(nebula, 3.0);
    
    // Create star field
    float stars = noise(pos * 30.0 + time * 2.0);
    stars = pow(stars, 8.0) * 0.8;
    
    // Color generation - cosmic palette
    vec3 color = vec3(0.05, 0.02, 0.1); // Deep space
    
    // Nebula colors
    vec3 nebulaColor = vec3(
        0.6 + bass * 0.4 + sin(time + dist * 8.0) * 0.2,
        0.2 + mid * 0.3 + cos(time * 1.5 + dist * 6.0) * 0.1,
        0.8 + treble * 0.2 + sin(time * 0.7 + dist * 10.0) * 0.3
    );
    
    color += nebulaColor * nebula * (0.3 + bass * 0.4);
    
    // Add spiral arms
    float spiralArms = spiral * (1.5 - dist * 2.0);
    spiralArms = clamp(spiralArms, 0.0, 1.0);
    color += vec3(0.8, 0.4, 1.0) * spiralArms * (0.4 + mid * 0.3);
    
    // Add stars
    color += vec3(1.0, 0.9, 0.7) * stars * (0.5 + treble * 0.5);
    
    // Add pulsing center
    float pulse = sin(time * 2.0 + bass * 5.0) * 0.3 + 0.7;
    color += vec3(0.9, 0.6, 1.0) * pulse * exp(-dist * 4.0) * 0.3;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 0.8, dist);
    color *= vignette;
    
    color = clamp(color, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.0);
}
