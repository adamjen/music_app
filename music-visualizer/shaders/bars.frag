// WebGL-Compatible Neon Bars
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_audioData[256];

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 16 bars with fixed frequency mapping
    float totalBars = 16.0;
    float barIndex = floor(uv.x * totalBars);
    float barX = fract(uv.x * totalBars);
    
    // Fixed frequency bands for each bar
    float intensity = 0.0;
    
    // Use specific fixed indices for each bar
    if (barIndex < 0.5) intensity = (u_audioData[0] + u_audioData[1] + u_audioData[2] + u_audioData[3]) * 0.25;
    else if (barIndex < 1.5) intensity = (u_audioData[4] + u_audioData[5] + u_audioData[6] + u_audioData[7]) * 0.25;
    else if (barIndex < 2.5) intensity = (u_audioData[8] + u_audioData[9] + u_audioData[10] + u_audioData[11]) * 0.25;
    else if (barIndex < 3.5) intensity = (u_audioData[12] + u_audioData[13] + u_audioData[14] + u_audioData[15]) * 0.25;
    else if (barIndex < 4.5) intensity = (u_audioData[16] + u_audioData[17] + u_audioData[18] + u_audioData[19]) * 0.25;
    else if (barIndex < 5.5) intensity = (u_audioData[20] + u_audioData[21] + u_audioData[22] + u_audioData[23]) * 0.25;
    else if (barIndex < 6.5) intensity = (u_audioData[24] + u_audioData[25] + u_audioData[26] + u_audioData[27]) * 0.25;
    else if (barIndex < 7.5) intensity = (u_audioData[28] + u_audioData[29] + u_audioData[30] + u_audioData[31]) * 0.25;
    else if (barIndex < 8.5) intensity = (u_audioData[32] + u_audioData[33] + u_audioData[34] + u_audioData[35]) * 0.25;
    else if (barIndex < 9.5) intensity = (u_audioData[36] + u_audioData[37] + u_audioData[38] + u_audioData[39]) * 0.25;
    else if (barIndex < 10.5) intensity = (u_audioData[40] + u_audioData[41] + u_audioData[42] + u_audioData[43]) * 0.25;
    else if (barIndex < 11.5) intensity = (u_audioData[44] + u_audioData[45] + u_audioData[46] + u_audioData[47]) * 0.25;
    else if (barIndex < 12.5) intensity = (u_audioData[48] + u_audioData[49] + u_audioData[50] + u_audioData[51]) * 0.25;
    else if (barIndex < 13.5) intensity = (u_audioData[52] + u_audioData[53] + u_audioData[54] + u_audioData[55]) * 0.25;
    else if (barIndex < 14.5) intensity = (u_audioData[56] + u_audioData[57] + u_audioData[58] + u_audioData[59]) * 0.25;
    else if (barIndex < 15.5) intensity = (u_audioData[60] + u_audioData[61] + u_audioData[62] + u_audioData[63]) * 0.25;
    else intensity = (u_audioData[64] + u_audioData[65] + u_audioData[66] + u_audioData[67]) * 0.25;
    
    intensity = pow(intensity, 2.5) * 1.5;
    intensity = clamp(intensity, 0.0, 1.0);
    
    // Calculate bar height
    float barHeight = intensity * 0.9;
    float barTop = 1.0 - barHeight;
    
    // Create bar shape
    float barWidth = 0.85;
    float inBar = step(barTop, uv.y) * step(barX, barWidth);
    
    // Neon color scheme by frequency
    vec3 neonColor;
    if (barIndex < 5.0) {
        neonColor = mix(vec3(1.0, 0.0, 0.8), vec3(0.8, 0.0, 1.0), intensity);
    } else if (barIndex < 10.0) {
        neonColor = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 0.5, 1.0), intensity);
    } else {
        neonColor = mix(vec3(0.5, 1.0, 0.0), vec3(1.0, 1.0, 0.3), intensity);
    }
    
    // Background
    vec3 color = vec3(0.02, 0.01, 0.05);
    color += neonColor * inBar * intensity;
    
    // Neon glow at top
    float glow = 0.0;
    if (uv.y > barTop - 0.08 && uv.y < barTop + 0.02) {
        glow = (1.0 - abs(uv.y - barTop) / 0.08) * intensity * 2.0;
    }
    color += neonColor * glow;
    
    // Reflection below
    float reflection = 0.0;
    if (uv.y > 0.5) {
        float refY = 1.0 - uv.y;
        reflection = exp(-refY * 8.0) * intensity * 0.6;
    }
    color += neonColor * reflection;
    
    // Pulsing animation
    float pulse = sin(u_time * 4.0 + barIndex * 0.8) * 0.15 + 0.85;
    color *= pulse;
    
    gl_FragColor = vec4(color, 1.0);
}
