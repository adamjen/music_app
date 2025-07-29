// Enhanced Fragment shader for dynamic base visualization
#ifdef GL_ES
precision mediump float;
#endif

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_audioData[256];

// Varying from vertex shader
varying vec2 v_position;

// Noise function for organic movement
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Smooth noise
float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal noise
float fractalNoise(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    value += amplitude * smoothNoise(p);
    p *= 2.0;
    amplitude *= 0.5;
    value += amplitude * smoothNoise(p);
    p *= 2.0;
    amplitude *= 0.5;
    value += amplitude * smoothNoise(p);
    p *= 2.0;
    amplitude *= 0.5;
    value += amplitude * smoothNoise(p);
    return value;
}

void main() {
    // Normalize coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 center = vec2(0.5, 0.5);
    vec2 pos = uv - center;
    
    // Calculate distance from center
    float dist = length(pos);
    float angle = atan(pos.y, pos.x);
    
    // Audio analysis
    float bass = u_audioData[0] * 0.5 + u_audioData[1] * 0.3 + u_audioData[2] * 0.2;
    float mid = u_audioData[32] * 0.5 + u_audioData[48] * 0.3 + u_audioData[64] * 0.2;
    float treble = u_audioData[128] * 0.5 + u_audioData[160] * 0.3 + u_audioData[192] * 0.2;
    
    // Create swirling galaxy effect
    float time = u_time * 0.5;
    float spiral = sin(angle * 6.0 + time * 2.0 + dist * 20.0) * 0.5 + 0.5;
    
    // Audio-reactive rotation
    float rotationSpeed = bass * 3.0 + 0.5;
    float rotatedAngle = angle + time * rotationSpeed;
    
    // Create particle field
    vec2 particlePos = vec2(
        rotatedAngle * 0.5 + sin(time * 0.3) * 2.0,
        dist * 5.0 + cos(time * 0.2) * 2.0
    );
    float particles = fractalNoise(particlePos * 3.0);
    
    // Audio-reactive scaling
    float scale = 1.0 + bass * 0.3;
    float scaledDist = dist * scale;
    
    // Color generation
    vec3 color;
    
    // Base color from audio
    color.r = 0.5 + bass * 0.5 + sin(time + scaledDist * 10.0) * 0.2;
    color.g = 0.3 + mid * 0.7 + cos(time * 1.3 + scaledDist * 8.0) * 0.2;
    color.b = 0.7 + treble * 0.3 + sin(time * 0.7 + scaledDist * 12.0) * 0.2;
    
    // Add spiral patterns
    color *= spiral * (1.5 - scaledDist);
    
    // Add particle glow
    color += particles * (0.3 + bass * 0.4) * exp(-scaledDist * 2.0);
    
    // Create pulsing center
    float pulse = sin(time * 3.0 + bass * 10.0) * 0.5 + 0.5;
    color += vec3(1.0, 0.5, 0.8) * pulse * exp(-scaledDist * 5.0) * 0.5;
    
    // Add edge glow
    float edgeGlow = 1.0 - smoothstep(0.3, 0.5, dist);
    color += vec3(0.2, 0.4, 0.8) * edgeGlow * (0.2 + mid * 0.3);
    
    // Vignette effect
    float vignette = 1.0 - smoothstep(0.5, 0.8, dist);
    color *= vignette;
    
    // Final intensity boost
    color = pow(color, vec3(0.9));
    color = clamp(color, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.0);
}
