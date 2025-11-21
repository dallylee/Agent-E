precision mediump float;
varying vec2 vUv;
uniform float uTime;

// Simple hash and noise helpers
float hash(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return -1.0 + 2.0 * fract(sin(h) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float res = mix(
    mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x),
    u.y);
  return res;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for(int i=0;i<5;i++){
    v += a*noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= 1.5;
  float t = uTime * 0.02;
  vec2 swirl = vec2(
    uv.x*cos(0.2*t) - uv.y*sin(0.2*t),
    uv.x*sin(0.2*t) + uv.y*cos(0.2*t)
  );
  float n = fbm(swirl*1.5 + t*0.1);
  float glow = smoothstep(0.2, 0.8, 0.6 - length(uv));
  vec3 color = mix(vec3(0.1,0.05,0.15), vec3(0.05,0.2,0.18), uv.y*0.5+0.5);
  color += vec3(0.3,0.1,0.5)*n*n;
  color += vec3(0.1,0.4,0.35)*glow*0.8;
  color = mix(color, vec3(0.02,0.05,0.08), 0.15 - 0.1*sin(uv.x*2.0+t));
  gl_FragColor = vec4(color,1.0);
}
