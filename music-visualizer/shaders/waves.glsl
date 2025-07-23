// Waves fragment shader
// Creates a water wave animation using audio frequency data

precision mediump float;

// Input uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_frequencyData;

void main(void) {
    // Get normalized coordinates (0.0 to 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float x = uv.x;
    float y = uv.y;

    // Sample frequency data from texture
    float freqIndex = x * u_resolution.x;
    float bass = texture2D(u_frequencyData, vec2(0.0, 1.0)).r;   // Low frequencies (bass)
    float mid = texture2D(u_frequencyData, vec2(freqIndex / u_resolution.x, 1.0)).r; // Mid-range
    float treble = texture2D(u_frequencyData, vec2(x, 0.5)).r; // High frequencies

    // Create wave animation based on frequency data
    float wave = sin((x + bass * 0.005) * 30.0 + u_time * 2.0);
    wave += cos((x + mid * 0.008) * 40.0 + u_time * 1.5) * 0.5;
    wave += sin((x + treble * 0.01) * 60.0 + u_time * 3.0) * 0.3;

    // Color based on wave and frequency
    vec3 color = mix(
        vec3(0.2, 0.5, 0.8),   // Blue for waves
        vec3(0.1, 0.3, 0.6),
        abs(wave) * 0.5 + 0.2
    );

    color *= (0.2 + bass * 0.005 + mid * 0.008 + treble * 0.01);

    // Apply some glow effect based on intensity
    float intensity = bass * 0.3 + mid * 0.5 + treble * 0.7;
    color += vec3(intensity * 0.2, intensity * 0.15, intensity * 0.1);

    gl_FragColor = vec4(color, 1.0);
}
