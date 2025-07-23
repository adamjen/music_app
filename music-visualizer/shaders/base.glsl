// Base vertex shader - placeholder file
// This will be the base vertex shader for all visualizations

attribute vec2 a_position;
void main(void) {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
