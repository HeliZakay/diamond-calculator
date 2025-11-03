import React, { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

/**
 * DiamondViewer
 * Renders a realistic diamond using a custom ShaderMaterial on a textured quad.
 * Parameters:
 *  - colorGrade (0..1): 0=D (no tint) → 1=Z (yellow tint)
 *  - cut        (0..1): 0=Poor (flat/low contrast) → 1=Ideal (crisp facets, high contrast & edge highlights)
 *  - clarity    (0..1): 0=I3 (hazy, many inclusions) → 1=FL (clear, no inclusions)
 *
 * The fragment shader applies:
 *  - subtle yellow tint from colorGrade
 *  - Sobel-based edge luminance for facet edge highlights, scaled by cut
 *  - contrast curve scaled by cut
 *  - haze (radial) and sparse animated inclusions from clarity (more inclusions when clarity is low)
 *
 * Usage:
 *   <DiamondViewer colorGrade={0.3} cut={0.8} clarity={0.6} />
 */

export type DiamondViewerProps = {
  colorGrade: number; // 0..1 (D->Z)
  cut: number; // 0..1 (Poor->Ideal)
  clarity: number; // 0..1 (I3->FL)
  texturePath?: string; // optional custom texture path, defaults to /diamond.png
  style?: React.CSSProperties;
  className?: string;
};

// Inline GLSL vertex/fragment shaders
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;         // base diamond texture (with alpha)
  uniform vec2 uTexel;            // 1.0 / textureSize
  uniform vec2 uResolution;       // canvas pixel resolution
  uniform float uTime;            // seconds
  uniform float uColorGrade;      // 0..1 (D->Z)
  uniform float uCut;             // 0..1 (Poor->Ideal)
  uniform float uClarity;         // 0..1 (I3->FL)

  // Luminance helper
  float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }

  // Pseudo-random (hash) based on a vec2 coordinate
  float hash(vec2 p) {
    // Fast hash, no loops
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  // Small static blue noise for subtle dithering
  float blueNoise(vec2 uv){
    return fract(sin(dot(uv * uResolution.xy, vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    // Base sample
    vec4 base = texture2D(uTex, vUv);

    // Early out: outside texture alpha => keep background
    if (base.a < 0.001) {
      discard; // blend with clear background
    }

    vec3 color = base.rgb;

  // 1) Color Grade → yellow tint (more nuanced, lower max)
  float tintAmt = smoothstep(0.0, 1.0, uColorGrade) * 0.35;
    vec3 yellow = vec3(1.0, 0.94, 0.55);
    color = mix(color, color * yellow, tintAmt);

    // 2) Cut → contrast, edge highlights via Sobel + dispersion along gradient
    //    Compute Sobel gradient on luminance from surrounding texels
    float c00 = luma(texture2D(uTex, vUv + vec2(-uTexel.x, -uTexel.y)).rgb);
    float c10 = luma(texture2D(uTex, vUv + vec2( 0.0,       -uTexel.y)).rgb);
    float c20 = luma(texture2D(uTex, vUv + vec2( uTexel.x,  -uTexel.y)).rgb);
    float c01 = luma(texture2D(uTex, vUv + vec2(-uTexel.x,   0.0      )).rgb);
    float c11 = luma(texture2D(uTex, vUv).rgb);
    float c21 = luma(texture2D(uTex, vUv + vec2( uTexel.x,   0.0      )).rgb);
    float c02 = luma(texture2D(uTex, vUv + vec2(-uTexel.x,   uTexel.y)).rgb);
    float c12 = luma(texture2D(uTex, vUv + vec2( 0.0,        uTexel.y)).rgb);
    float c22 = luma(texture2D(uTex, vUv + vec2( uTexel.x,   uTexel.y)).rgb);

    float gx = -c00 - 2.0*c10 - c20 + c02 + 2.0*c12 + c22;
    float gy = -c00 - 2.0*c01 - c02 + c20 + 2.0*c21 + c22;
    vec2 grad = vec2(gx, gy);
    float edge = clamp(length(grad), 0.0, 1.0);
    vec2 dir = normalize(grad + 1e-5);

    // Edge boost scales with cut (ideal → more crisp edges)
    float edgeBoost = uCut * 0.75;
    color += edge * edgeBoost;

    // Subtle chromatic dispersion along edge direction
    float disp = 0.75 * uCut * (0.5 + 0.5*edge) * max(0.0, 1.0 - tintAmt) * 0.003;
    vec3 dispersed;
    dispersed.r = texture2D(uTex, vUv + dir * disp).r;
    dispersed.g = texture2D(uTex, vUv).g;
    dispersed.b = texture2D(uTex, vUv - dir * disp).b;
    color = mix(color, dispersed, smoothstep(0.1, 0.9, edge) * 0.6 * uCut);

    // Contrast curve from cut (slightly filmic curve)
    float contrast = 1.0 + uCut * 0.8;
    color = clamp(0.5 + (color - 0.5) * contrast, 0.0, 1.0);

    // 3) Clarity → haze + inclusions (more when clarity is low)
    float clarityLack = 1.0 - uClarity; // 0=FL, 1=I3

    // Haze: radial gradient from center
    vec2 center = vec2(0.5);
    float d = distance(vUv, center) / 0.5; // 0 at center, 1 at edge
    float haze = clarityLack * smoothstep(0.15, 0.95, d) * 0.35;
    color = mix(color, vec3(1.0), haze * 0.28);

    // Fresnel-like rim to add brilliance on outline
    float fres = pow(smoothstep(0.2, 1.0, d), 1.5);
    color += fres * edge * (0.15 + 0.25*uCut);

    // Inclusions: soft dots inside diamond area (efficient, no loops)
    float circleMask = step(d, 1.0);
    // Cell-based random position
    float density = mix(24.0, 140.0, clarityLack); // fewer, subtler
    vec2 cell = floor(vUv * density);
    vec2 cellUv = fract(vUv * density) - 0.5;
    // Random center per cell, slightly animated
    float h1 = hash(cell + 13.17);
    float h2 = hash(cell + 37.91);
    vec2 centerOff = vec2(h1 - 0.5, h2 - 0.5) * 0.35 + 0.08 * vec2(
      sin(uTime * 1.2 + h1 * 6.2831),
      cos(uTime * 1.1 + h2 * 6.2831)
    );
    float distTo = length(cellUv - centerOff);
    float dotRad = mix(0.006, 0.016, clarityLack);
    float inkl = smoothstep(dotRad, dotRad * 0.6, distTo);
    // Gate appearance probability per cell by another hash
    float appear = step(mix(0.995, 0.88, clarityLack), hash(cell + 91.7));
    float speck = (1.0 - inkl) * appear * circleMask * smoothstep(1.0, 0.15, d);
    // Apply as dark inclusion (slightly weaker)
    color *= (1.0 - speck * (0.18 + 0.25 * clarityLack));

    // Procedural micro-glints: angular streaks rotating slowly
    vec2 p = vUv - 0.5;
    float ang = atan(p.y, p.x) + uTime * 0.35;
    float star1 = pow(max(0.0, cos(6.0*ang)), 24.0) * smoothstep(0.5, 0.02, length(p));
    float star2 = pow(max(0.0, cos(8.0*(ang + 1.57))), 22.0) * smoothstep(0.5, 0.02, length(p));
    float glint = (star1 + star2) * 0.12 * uCut;
    color += glint;

    // Subtle vignette to focus the eye
    float vign = smoothstep(0.95, 0.4, d);
    color *= mix(0.95, 1.0, vign);

    // Tiny blue noise dithering to avoid banding
    color += (blueNoise(vUv*1.7) - 0.5) * 0.003;

    gl_FragColor = vec4(color, base.a);
  }
`;

// A mesh with the shader material applied to a unit quad
function DiamondQuad(props: {
  colorGrade: number;
  cut: number;
  clarity: number;
  texturePath?: string;
}) {
  const url = props.texturePath ?? `${import.meta.env.BASE_URL}diamond.png`;
  const texture = useLoader(THREE.TextureLoader, url);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uTexel: {
        value: new THREE.Vector2(
          1 /
            Math.max(
              1,
              (texture.image as HTMLImageElement | undefined)?.width || 1024
            ),
          1 /
            Math.max(
              1,
              (texture.image as HTMLImageElement | undefined)?.height || 1024
            )
        ),
      },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTime: { value: 0 },
      uColorGrade: { value: 0 },
      uCut: { value: 0 },
      uClarity: { value: 0 },
    }),
    [texture, size.width, size.height]
  );

  useLayoutEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Smoothly approach target props to avoid abrupt jumps
  const smooth = useRef({ cg: 0, ct: 0, cl: 0 });

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    // Update dynamic uniforms with damping
    const damp = 0.08; // smoothing factor
    smooth.current.cg += (props.colorGrade - smooth.current.cg) * damp;
    smooth.current.ct += (props.cut - smooth.current.ct) * damp;
    smooth.current.cl += (props.clarity - smooth.current.cl) * damp;
    matRef.current.uniforms.uColorGrade.value = smooth.current.cg;
    matRef.current.uniforms.uCut.value = smooth.current.ct;
    matRef.current.uniforms.uClarity.value = smooth.current.cl;
    matRef.current.uniforms.uResolution.value.set(
      state.size.width,
      state.size.height
    );
    if (texture && (texture.image as HTMLImageElement)?.width) {
      const w = (texture.image as HTMLImageElement).width;
      const h = (texture.image as HTMLImageElement).height;
      matRef.current.uniforms.uTexel.value.set(1 / w, 1 / h);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

// Automatically fit the quad in view using an orthographic camera
function OrthoAutoZoom() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    // Make 2x2 world units fit comfortably; zoom is pixels per world unit
    cam.zoom = Math.min(size.width, size.height) / 2.2; // small padding
    cam.near = -10;
    cam.far = 10;
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export function DiamondViewer({
  colorGrade,
  cut,
  clarity,
  texturePath,
  style,
  className,
}: DiamondViewerProps) {
  return (
    <div
      style={{ width: "100%", height: "100%", background: "#eceff3", ...style }}
      className={className}
    >
      <Canvas orthographic gl={{ antialias: true }} dpr={[1, 2]}>
        {/* Neutral background */}
        <color attach="background" args={["#eceff3"]} />
        {/* Ortho camera that auto-fits the 2x2 quad */}
        <OrthographicCamera makeDefault position={[0, 0, 5]} />
        <OrthoAutoZoom />
        {/*
          Wrap content that uses useLoader with Suspense so the Canvas stays
          mounted while textures load. This avoids the initial show-then-hide
          flicker when the loader suspends.
        */}
        <Suspense fallback={null}>
          <DiamondQuad
            colorGrade={THREE.MathUtils.clamp(colorGrade, 0, 1)}
            cut={THREE.MathUtils.clamp(cut, 0, 1)}
            clarity={THREE.MathUtils.clamp(clarity, 0, 1)}
            texturePath={texturePath}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default DiamondViewer;
