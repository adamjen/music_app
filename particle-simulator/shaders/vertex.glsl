attribute vec3 aPosition;
attribute float aPointSize;

void main() {
    gl_PointSize = aPointSize;
    gl_Position = vec4(aPosition, 1.0);
}
