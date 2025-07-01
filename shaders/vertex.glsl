attribute vec3 aPosition;
void main() {
  // Passthrough vertex shader
  gl_Position = vec4(aPosition, 1.0);
}
