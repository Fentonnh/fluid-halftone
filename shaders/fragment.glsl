#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform float u_speed;
uniform float u_noiseScale;
uniform vec3  u_color1;
uniform vec3  u_color2;
uniform vec2  resolution;

// ————————————————————————
// 2D Simplex noise (Ashima)
// Copy the full snoise(vec2) implementation here
// ————————————————————————
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865,0.366025404,-0.577350269,0.024390244);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0) );
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m*m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.792842914 - 0.853734720 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// ————————————————————————
// Bayer dithering via if/else
// ————————————————————————
float getBayer(vec2 fragCoord) {
  float fx = floor(fract(fragCoord.x * 0.25) * 4.0);
  float fy = floor(fract(fragCoord.y * 0.25) * 4.0);

  if (fy < 1.0) {
    if (fx < 1.0) return  0.0/16.0;
    else if (fx < 2.0) return  8.0/16.0;
    else if (fx < 3.0) return  2.0/16.0;
    else               return 10.0/16.0;
  } else if (fy < 2.0) {
    if (fx < 1.0) return 12.0/16.0;
    else if (fx < 2.0) return  4.0/16.0;
    else if (fx < 3.0) return 14.0/16.0;
    else               return  6.0/16.0;
  } else if (fy < 3.0) {
    if (fx < 1.0) return  3.0/16.0;
    else if (fx < 2.0) return 11.0/16.0;
    else if (fx < 3.0) return  1.0/16.0;
    else               return  9.0/16.0;
  } else {
    if (fx < 1.0) return 15.0/16.0;
    else if (fx < 2.0) return  7.0/16.0;
    else if (fx < 3.0) return 13.0/16.0;
    else               return  5.0/16.0;
  }
}

void main() {
  // 1) Normalize pixel coords
  vec2 uv = gl_FragCoord.xy / resolution;

  // 2) Time warp
  float t = u_time * u_speed;

  // 3) Curl advect
  vec2 p = uv * u_noiseScale;
  float nx = snoise(p + vec2( t, -t));
  float ny = snoise(p + vec2(-t,  t));
  vec2 curl = vec2(ny, -nx);
  uv += curl * 0.1;  // swirl intensity

  // 4) Sample brightness
  float lum = snoise(uv * u_noiseScale + t);

  // 5) Dither threshold
  float thresh = getBayer(gl_FragCoord.xy);

  // 6) Binary dot
  float dotVal = step(thresh, lum);

  // 7) Mix colors
  vec3 color = mix(u_color1, u_color2, dotVal);

  gl_FragColor = vec4(color, 1.0);
}
