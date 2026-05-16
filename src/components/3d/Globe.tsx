'use client';

/* eslint-disable react-hooks/immutability, react-hooks/purity -- Three.js textures and R3F useFrame/camera updates are imperative by design */

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import { TURKEY_OUTLINE_LATLNG } from '@/components/3d/turkeyOutlineRing';
import ShatterGlobe from '@/components/3d/ShatterGlobe';

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

const ISTANBUL: [number, number] = [41.01, 28.95];




function RealEarth({
  scrollYProgress,
  revealProgress,
}: {
  scrollYProgress: MotionValue<number>;
  revealProgress: MotionValue<number>;
}) {
  const { camera, size } = useThree();
  const sphereSegments = size.width < 560 ? 42 : size.width < 1024 ? 80 : 128;
  const scaleGroupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);
  const globeMeshRef = useRef<THREE.Mesh>(null);
  const colorMap = useTexture('/textures/earth/earth_8k.jpg');
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.anisotropy = 16;
  colorMap.minFilter = THREE.LinearMipmapLinearFilter;
  colorMap.magFilter = THREE.LinearFilter;
  colorMap.generateMipmaps = true;
  colorMap.needsUpdate = true;

  const turkeyQuat = useMemo(() => {
    const v = latLngToVec3(ISTANBUL[0], ISTANBUL[1], 1).normalize();
    const yaw = Math.atan2(-v.x, v.z);
    const pitch = Math.atan2(v.y, Math.hypot(v.x, v.z));
    const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
    return qX.multiply(qY);
  }, []);

  const autoQuat = useMemo(() => new THREE.Quaternion(), []);
  const upAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const smoothedSp = useRef(0);
  const outlineMatRef = useRef<THREE.LineBasicMaterial>(null);

  const turkeyOutlineGeometry = useMemo(() => {
    const lift = 1.008;
    const positions = new Float32Array(TURKEY_OUTLINE_LATLNG.length * 3);
    let i = 0;
    for (const [lat, lng] of TURKEY_OUTLINE_LATLNG) {
      const v = latLngToVec3(lat, lng, lift);
      positions[i++] = v.x; positions[i++] = v.y; positions[i++] = v.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const cityLightsPositions = useMemo(() => {
    const cities: [number, number][] = [
      [41.01, 28.95], [39.92, 32.85], [37.87, 32.48], [36.89, 30.70],
      [38.41, 27.13], [40.19, 29.06], [37.00, 35.32], [41.67, 26.55],
      [24.47, 54.37], [25.28, 51.53], [26.23, 50.59], [23.61, 58.59],
      [29.37, 47.98], [24.69, 46.72], [21.39, 39.85], [48.86, 2.35],
      [51.51, -0.13], [52.52, 13.40], [41.38, 2.17], [50.45, 30.52],
    ];
    const lift = 1.009;
    // Use a seeded-like fixed offset instead of Math.random() to avoid recreation
    const jitter = [0.1, -0.2, 0.15, -0.05];
    const pos = new Float32Array(cities.length * 4 * 3);
    let idx = 0;
    for (const [lat, lng] of cities) {
      for (let j = 0; j < 4; j++) {
        const v = latLngToVec3(lat + jitter[j] * 0.5, lng + jitter[(j + 1) % 4] * 0.5, lift);
        pos[idx++] = v.x; pos[idx++] = v.y; pos[idx++] = v.z;
      }
    }
    return pos;
  }, []);

  const cityLightsMatRef = useRef<THREE.PointsMaterial>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = Math.max(0, Math.min(1, scrollYProgress.get()));
    smoothedSp.current += (target - smoothedSp.current) * Math.min(1, dt * 4.0);
    const sp = smoothedSp.current;

    const eased = sp < 0.5 ? 4 * sp * sp * sp : 1 - Math.pow(-2 * sp + 2, 3) / 2;

    const t = state.clock.getElapsedTime();

    const isWideViewport = state.size.width >= 1024;
    const targetCamZ = isWideViewport ? 2.45 : 5.8;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.z += (targetCamZ - camera.position.z) * Math.min(1, dt * 10);
      // Cinematic slight camera drift — barely perceptible breathing
      camera.position.x = Math.sin(t * 0.07) * 0.018;
      camera.position.y = Math.sin(t * 0.05) * 0.012;
    }

    if (rotationGroupRef.current) {
      autoQuat.setFromAxisAngle(upAxis, t * 0.02);
      rotationGroupRef.current.quaternion.copy(autoQuat).slerp(turkeyQuat, eased);
    }

    if (scaleGroupRef.current) {
      const dollyMax = isWideViewport ? 0.58 : 0.6;
      const scale = 1 + eased * dollyMax;
      scaleGroupRef.current.scale.setScalar(scale);

      const slideX = isWideViewport ? 0.13 : 0;
      scaleGroupRef.current.position.x = -eased * state.viewport.width * slideX;
      scaleGroupRef.current.position.y = 0;
    }

    const rp = revealProgress.get();

    // Globe fade
    const heroFade = THREE.MathUtils.smoothstep(sp, 0.85, 1.0);
    const revealSnap = THREE.MathUtils.smoothstep(rp, 0.0, 0.06);
    const globeOpacity = 1 - Math.max(heroFade, revealSnap);

    if (globeMeshRef.current) {
      const mat = globeMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = globeOpacity;
    }

    // City lights — appear as globe zooms toward Turkey
    if (cityLightsMatRef.current) {
      const lightsOpacity = THREE.MathUtils.smoothstep(eased, 0.35, 0.75) * globeOpacity;
      cityLightsMatRef.current.opacity = lightsOpacity * (0.5 + 0.5 * Math.sin(t * 1.3));
    }

    // Turkey outline
    if (outlineMatRef.current) {
      const zoomOpacity = THREE.MathUtils.smoothstep(eased, 0.42, 0.88) * 0.95;
      outlineMatRef.current.opacity = zoomOpacity * (1 - Math.max(heroFade, THREE.MathUtils.smoothstep(rp, 0.0, 0.06)));
    }
  });

  return (
    <group ref={scaleGroupRef}>
      <group ref={rotationGroupRef}>
        {/* Earth surface */}
        <mesh ref={globeMeshRef}>
          <sphereGeometry args={[1, sphereSegments, sphereSegments]} />
          <meshBasicMaterial map={colorMap} toneMapped={false} transparent />
        </mesh>


        {/* City lights */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[cityLightsPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={cityLightsMatRef}
            size={0.006}
            color="#ffe4a0"
            transparent
            opacity={0}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Turkey outline ring */}
        <lineLoop geometry={turkeyOutlineGeometry} renderOrder={2}>
          <lineBasicMaterial
            ref={outlineMatRef}
            color="#67E8F9"
            transparent
            opacity={0}
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </lineLoop>
      </group>
    </group>
  );
}

function AnimatedParticles({ revealProgress }: { revealProgress: MotionValue<number> }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const count = 300;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.05 + Math.random() * 0.35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.04;
    if (matRef.current) {
      const rp = revealProgress.get();
      matRef.current.opacity = 0.7 * (1 - THREE.MathUtils.smoothstep(rp, 0.08, 0.24));
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.004}
        color="#67E8F9"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function useAdaptiveCanvasDpr(): [number, number] {
  const [dpr, setDpr] = useState<[number, number]>(() => [1, 2]);
  useEffect(() => {
    const mqNarrow = window.matchMedia('(max-width: 1023px)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    const sync = () => {
      const lighten = mqNarrow.matches || mqCoarse.matches;
      setDpr(lighten ? [1, 1.4] : [1, 2]);
    };
    sync();
    mqNarrow.addEventListener('change', sync);
    mqCoarse.addEventListener('change', sync);
    return () => {
      mqNarrow.removeEventListener('change', sync);
      mqCoarse.removeEventListener('change', sync);
    };
  }, []);
  return dpr;
}

interface GlobeCanvasProps {
  scrollYProgress: MotionValue<number>;
  revealProgress: MotionValue<number>;
  visible?: boolean;
}

export default function GlobeCanvas({
  scrollYProgress,
  revealProgress,
  visible = true,
}: GlobeCanvasProps) {
  const canvasDpr = useAdaptiveCanvasDpr();

  return (
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      dpr={canvasDpr}
      camera={{ position: [0, 0, 2.45], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <RealEarth scrollYProgress={scrollYProgress} revealProgress={revealProgress} />
      </Suspense>
      <AnimatedParticles revealProgress={revealProgress} />
      <ShatterGlobe revealProgress={revealProgress} />
    </Canvas>
  );
}
