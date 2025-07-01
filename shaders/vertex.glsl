attribute vec3 aPosition;
uniform vec2 resolution;

void main() {
  vec2 clip = (aPosition.xy / resolution) * 2.0;
  clip.y *= -1.0;
  gl_Position = vec4(clip, aPosition.z, 1.0);
}
