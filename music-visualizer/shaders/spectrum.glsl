// Spectrum fragment shader
// Creates a visual representation of audio frequency data

precision mediump float;

// Input uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_frequencyData;

void main(void) {
    // Get normalized coordinates (0.0 to 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Sample frequency data from texture
    // Note: We use the x coordinate as index into frequency bins
    float frequencyIndex = uv.x * u_resolution.x;
    float bass = texture2D(u_frequencyData, vec2(0.0, 1.0)).r;   // Lowest frequencies (bass)
    float mid = texture2D(u_frequencyData, vec2(frequencyIndex / u_resolution.x, 1.0)).r; // Mid-range
    float treble = texture2D(u_frequencyData, vec2(uv.x, 0.5)).r; // Higher frequencies

    // Create colors based on frequency bands
    vec3 color = vec3(
        max(bass * 2.0, 0.1),   // Bass (red)
        mid * 0.8 + 0.2,      // Mid-range (green)
        treble * 0.5 + 0.4     // High frequencies (blue)
    );

    // Add some animation based on time
    color *= 0.8 + 0.2 * sin(u_time);

    gl_FragColor = vec4(color, 1.0);
}
