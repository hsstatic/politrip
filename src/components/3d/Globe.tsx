'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Geographic coordinates (lat/lng → 3D point on sphere)
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Arc points between two lat/lng positions
function createArcPoints(
  from: [number, number],
  to: [number, number],
  radius: number,
  segments = 80
): THREE.Vector3[] {
  const start = latLngToVec3(from[0], from[1], radius);
  const end = latLngToVec3(to[0], to[1], radius);
  const points: THREE.Vector3[] = [];
  const arcHeight = radius * 0.5;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pos = new THREE.Vector3().lerpVectors(start, end, t);
    const up = pos.clone().normalize();
    const elevation = Math.sin(Math.PI * t) * arcHeight;
    pos.addScaledVector(up, elevation);
    points.push(pos);
  }
  return points;
}

// Gulf cities → Istanbul routes
const ISTANBUL: [number, number] = [41.01, 28.95];
const routes: { from: [number, number]; label: string; color: string }[] = [
  { from: [24.68, 46.72], label: 'Riyadh', color: '#C9A96E' },
  { from: [25.20, 55.27], label: 'Dubai', color: '#E8CC9A' },
  { from: [25.28, 51.52], label: 'Doha', color: '#A07840' },
  { from: [29.37, 47.98], label: 'Kuwait', color: '#D4AF37' },
  { from: [26.21, 50.59], label: 'Manama', color: '#C9A96E' },
  { from: [23.61, 58.59], label: 'Muscat', color: '#E8CC9A' },
];

// Highlight dots for Gulf cities
const gulfDots = routes.map((r) => ({
  pos: latLngToVec3(r.from[0], r.from[1], 1.02),
  color: r.color,
}));
const istanbulDot = latLngToVec3(ISTANBUL[0], ISTANBUL[1], 1.02);

function GlobeEarth({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Custom globe shader - dark ocean with subtle land masses
  const globeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        lightDir: { value: new THREE.Vector3(1, 0.5, 0.5).normalize() },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 lightDir;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float smoothNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 5; i++) {
            v += amp * smoothNoise(p);
            p *= 2.1;
            amp *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          float n = fbm(uv * 4.0);
          float n2 = fbm(uv * 8.0 + vec2(1.7, 9.2));
          float land = smoothstep(0.48, 0.55, n * 0.7 + n2 * 0.3);

          vec3 oceanColor = vec3(0.04, 0.08, 0.22);
          vec3 landColor = vec3(0.06, 0.14, 0.28);
          vec3 shallowColor = vec3(0.05, 0.12, 0.32);

          vec3 baseColor = mix(oceanColor, landColor, land);

          // Lighting
          float diff = max(dot(vNormal, lightDir), 0.0);
          float ambient = 0.25;
          vec3 lit = baseColor * (ambient + diff * 0.75);

          // Fresnel glow at edges
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0,0,1)), 0.0), 3.0);
          vec3 glowColor = vec3(0.1, 0.4, 1.0);
          lit = mix(lit, glowColor, fresnel * 0.4);

          // Grid lines
          vec2 grid = abs(fract(uv * vec2(24.0, 12.0) - 0.5) - 0.5);
          float gridLine = smoothstep(0.02, 0.01, min(grid.x, grid.y));
          lit += gridLine * 0.04 * vec3(0.3, 0.6, 1.0);

          gl_FragColor = vec4(lit, 1.0);
        }
      `,
    });
  }, []);

  // Atmosphere material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          vec3 color = mix(vec3(0.1, 0.4, 1.0), vec3(0.3, 0.7, 1.0), intensity);
          gl_FragColor = vec4(color, intensity * 0.7);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      globeMaterial.uniforms.time.value = t;
      // Auto-rotate
      meshRef.current.rotation.y = t * 0.08;
    }
    if (groupRef.current) {
      const sp = scrollProgress.current;
      // Move globe up and back as user scrolls
      groupRef.current.position.y = sp * -1.5;
      groupRef.current.position.z = sp * -2;
      groupRef.current.scale.setScalar(1 - sp * 0.3);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main globe */}
      <mesh ref={meshRef} material={globeMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial}>
        <sphereGeometry args={[1.15, 32, 32]} />
      </mesh>

      {/* Gulf city dots */}
      {gulfDots.map((dot, i) => (
        <mesh key={i} position={dot.pos}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color={dot.color} />
        </mesh>
      ))}

      {/* Istanbul dot - larger */}
      <mesh position={istanbulDot}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      {/* Travel arcs */}
      {routes.map((route, i) => {
        const points = createArcPoints(route.from, ISTANBUL, 1.0);
        return (
          <Line
            key={i}
            points={points}
            color={route.color}
            lineWidth={1.5}
            transparent
            opacity={0.7}
          />
        );
      })}
    </group>
  );
}

function AnimatedParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.05 + Math.random() * 0.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.005}
        color="#C9A96E"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface GlobeCanvasProps {
  scrollProgress: React.MutableRefObject<number>;
}

export default function GlobeCanvas({ scrollProgress }: GlobeCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#1E90FF" />

      <Stars
        radius={50}
        depth={30}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      <GlobeEarth scrollProgress={scrollProgress} />
      <AnimatedParticles />
    </Canvas>
  );
}
