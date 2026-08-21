export const particleVert = /* glsl */ `
  attribute vec3 aField;
  attribute vec3 aLattice;
  attribute vec3 aRibbon;
  attribute vec3 aBranch;
  attribute vec4 aRand;     // x,y,z jitter dirs (-1..1), w = 0..1 id

  uniform float uTime;
  uniform float uCalm;
  uniform float uChaos;
  uniform float uMorph;
  uniform float uSplit;
  uniform float uCondense;
  uniform float uLift;
  uniform float uVelocity;
  uniform float uPointSize;
  uniform float uPixelRatio;
  uniform vec3  uFieldOffset;
  uniform vec3  uCondenseTarget;

  varying float vAlpha;
  varying float vCoral;
  varying float vId;
  varying float vCalm;

  void main() {
    float id = aRand.w;
    float live = 1.0 - uCalm;

    // raw field: slow drift (suppressed while calm)
    vec3 field = aField + uFieldOffset;
    field += vec3(
      sin(uTime * 0.25 + id * 31.0),
      cos(uTime * 0.2 + id * 17.0),
      sin(uTime * 0.18 + id * 7.0)
    ) * 0.25 * live;

    // calm hero: ordered lattice, gently undulating like a clean signal
    vec3 lat = aLattice;
    lat.y += 0.7 * sin(lat.x * 0.4 + uTime * 0.5) * cos(lat.z * 0.45 + uTime * 0.35);

    vec3 base = mix(field, lat, uCalm);
    vec3 p = mix(base, aRibbon, uMorph);
    p += aBranch * uSplit;

    // chaos: jitter + coral flares
    float jit = sin(uTime * 3.0 + id * 40.0) * uChaos;
    p += aRand.xyz * jit * 0.9;

    // velocity-reactive turbulence
    p.y += sin(p.x * 1.5 + uTime * 2.0 + id * 3.0) * uVelocity * 0.0025 * live;

    // condense into a single point (staggered by id)
    float cond = clamp(uCondense * (0.35 + 0.65 * id) * 1.4, 0.0, 1.0);
    p = mix(p, uCondenseTarget, cond);

    // launch: a subset gathers at the launch point and streams upward in a widening column
    float s = step(0.6, id) * uLift;
    float h = aRand.y * 0.5 + 0.5;                     // height along the column (independent random)
    float spread = 0.18 + h * h * 1.6 * s;             // narrow at the base, flaring at the top
    float sway = sin(uTime * 1.6 + h * 12.0) * 0.12 * s * h;
    vec3 column = uCondenseTarget + vec3(
      aRand.x * spread + sway,
      h * 10.0 * s + s * s * 2.0,
      aRand.z * spread
    );
    p = mix(p, column, s);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = uPointSize * (0.55 + 0.9 * fract(id * 7.31)) * uPixelRatio * mix(1.0, 0.7, uCalm);
    gl_PointSize = min(size * (18.0 / max(-mv.z, 0.5)), 26.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;

    // coral: outliers in chaos, bias markers on the ribbon, lower branch when split
    float outlier = step(0.9, id) * uChaos;
    float bias = step(0.965, id) * uMorph;
    float branchCoral = step(0.5, -aBranch.y) * uSplit * uMorph;
    vCoral = clamp(outlier + bias + branchCoral + s * step(0.9, fract(id * 5.3)) * h, 0.0, 1.0);

    float depthFade = smoothstep(40.0, 6.0, -mv.z);
    vAlpha = (0.35 + 0.65 * fract(id * 3.7)) * mix(depthFade, 0.9, uCalm * 0.8) * mix(1.0, 1.3 - (aRand.y * 0.5 + 0.5) * 0.9, s);
    vId = id;
    vCalm = uCalm;
  }
`;

export const particleFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uTeal;
  uniform vec3 uBright;
  uniform vec3 uCoral;
  uniform float uAlpha;
  uniform float uTime;

  varying float vAlpha;
  varying float vCoral;
  varying float vId;
  varying float vCalm;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float disc = smoothstep(0.5, 0.12, d);
    float core = smoothstep(0.22, 0.0, d);
    vec3 base = mix(uTeal, uBright, fract(vId * 5.3));
    vec3 col = mix(base, uCoral, vCoral);
    col += core * 0.35;
    float twinkleAmp = mix(0.2, 0.04, vCalm);
    float twinkle = (1.0 - twinkleAmp) + twinkleAmp * sin(uTime * 1.5 + vId * 60.0);
    float a = disc * vAlpha * uAlpha * twinkle * mix(1.0, 0.9, vCalm);
    if (a < 0.01) discard;
    gl_FragColor = vec4(col, a);
  }
`;
