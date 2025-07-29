// Audio Bars Fragment Shader
#ifdef GL_ES
precision mediump float;
#endif

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_audioData[256];

// Varying from vertex shader
varying vec2 v_position;

// Smooth step function for anti-aliasing
float smoothEdge(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

// Calculate bar height based on frequency data
float getBarHeight(float index, float totalBars) {
    // Map bar index to frequency bin
    float binIndex = floor(index * 256.0 / totalBars);
    binIndex = clamp(binIndex, 0.0, 255.0);
    
    // Get audio intensity
    float intensity = u_audioData[int(binIndex)];
    
    // Apply some smoothing and scaling
    intensity = pow(intensity, 1.5) * 1.2;
    intensity = clamp(intensity, 0.0, 1.0);
    
    return intensity;
}

void main() {
    // Normalize coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Define bar layout
    float totalBars = 64.0;
    float barWidth = 1.0 / totalBars;
    
    // Calculate which bar this pixel belongs to
    float barIndex = floor(uv.x * totalBars);
    
    // Calculate bar position within the bar
    float barX = fract(uv.x * totalBars);
    
    // Get bar height based on frequency range
    float barHeight = 0.0;
    vec3 barColor = vec3(0.0);
    
    // Map bars to frequency ranges
    if (barIndex < 21.0) {
        // Bass bars (0-20): Red/Orange
        barHeight = getBarHeight(barIndex, 21.0);
        barColor = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 0.6, 0.0), barHeight);
    } else if (barIndex < 42.0) {
        // Midrange bars (21-41): Green/Yellow
        float midIndex = barIndex - 21.0;
        barHeight = getBarHeight(midIndex + 21.0, 21.0);
        barColor = mix(vec3(0.0, 1.0, 0.3), vec3(1.0, 1.0, 0.0), barHeight);
    } else {
        // Treble bars (42-63): Blue/Purple
        float trebleIndex = barIndex - 42.0;
        barHeight = getBarHeight(trebleIndex + 128.0, 21.0);
        barColor = mix(vec3(0.0, 0.3, 1.0), vec3(0.6, 0.0, 1.0), barHeight);
    }
    
    // Calculate actual bar height in screen space
    float screenHeight = barHeight * 0.8; // Leave some space at top
    
    // Create bar shape with anti-aliasing
    float barTop = 1.0 - screenHeight;
    float barBottom = 1.0;
    
    // Check if pixel is within bar height
    float inBar = smoothEdge(barTop - 0.01, barTop + 0.01, uv.y);
    
    // Add glow effect at top of bars
    float glow = 0.0;
    if (uv.y > barTop - 0.05 && uv.y < barTop + 0.05) {
        glow = (1.0 - abs(uv.y - barTop) / 0.05) * 0.5;
    }
    
    // Add subtle background glow
    float bgGlow = barHeight * 0.1 * (1.0 - uv.y);
    
    // Combine colors
    vec3 color = barColor * inBar;
    color += barColor * glow;
    color += vec3(0.1, 0.1, 0.2) * bgGlow;
    
    // Add some ambient lighting
    color += vec3(0.05, 0.05, 0.1) * (1.0 - uv.y) * 0.3;
    
    // Add subtle animation
    float pulse = sin(u_time * 2.0 + barIndex * 0.5) * 0.05 + 0.95;
    color *= pulse;
    
    // Add bar separators
    float separator = smoothEdge(0.85, 0.95, barX) * smoothEdge(0.05, 0.15, barX);
    color *= 0.8 + separator * 0.2;
    
    gl_FragColor = vec4(color, 1.0);
}
