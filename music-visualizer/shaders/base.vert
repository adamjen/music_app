// Vertex shader
#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 a_position;
varying vec2 v_position;

void main() {
    v_position = a_position * 0.5 + 0.5;  // Convert from clip space to texture coordinates
    gl_Position = vec4(a_position, 0.0, 1.0);
}