#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform float u_speed;
uniform float u_noiseScale;
uniform vec3  u_color1;
uniform vec3  u_color2;
uniform vec2  resolution;

// ——————————————————
// 2D Simplex noise by Ian McEwan, Ashima Arts
// https://github.com/ashima/webgl-noise
// (Compressed here for brevity)
// ——————————————————
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187,  // (3.0−√3.0)/6.0
                      0.366025403784439,  // 0.5*(√3.0−1.0)
                     -0.577350269189626,  // −1.0 + 2.0*C.x
                      0.024390243902439); // 1.0/41.0
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute( permute(
             i.y + vec3(0.0, i1.y, 1.0 ))
           + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;

  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// ——————————————————
// Main
// ——————————————————
void main() {
  // 1) Normalize coords
  vec2 uv = gl_FragCoord.xy / resolution;

  // 2) Time & speed
  float t = u_time * u_speed;

  // 3) Swirl vector via two offset noise calls
  vec2 p = uv * u_noiseScale;
  float nx = snoise(p + vec2(t, -t));
  float ny = snoise(p + vec2(-t, t));
  vec2 curl = vec2(ny, -nx);

  // 4) Displace uv
  uv += curl * 0.1;

  // 5) Sample brightness
  float lum = snoise(uv * u_noiseScale + t);

  // 6) 4×4 Bayer dithering matrix (normalized)
  float bayer[16];
  bayer[0 ]=0./16.; bayer[1 ]=8./16.; bayer[2 ]=2./16.; bayer[3 ]=10./16.;
  bayer[4 ]=12./16.;bayer[5 ]=4./16.; bayer[6 ]=14./16.;bayer[7 ]=6./16.;
  bayer[8 ]=3./16.; bayer[9 ]=11./16.;bayer[10]=1./16.;bayer[11]=9./16.;
  bayer[12]=15./16.;bayer[13]=7./16.;bayer[14]=13./16.;bayer[15]=5./16.;

  int ix = int(mod(gl_FragCoord.x, 4.0));
  int iy = int(mod(gl_FragCoord.y, 4.0));
  float thresh = bayer[ix + iy * 4];

  // 7) Binary dot  
  float dotVal = step(thresh, lum);

  // 8) Mix between two colors
  vec3 color = mix(u_color1, u_color2, dotVal);

  gl_FragColor = vec4(color, 1.0);
}
