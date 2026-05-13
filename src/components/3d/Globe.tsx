'use client';

/* eslint-disable react-hooks/immutability, react-hooks/purity -- Three.js textures and R3F useFrame/camera updates are imperative by design */

import { Suspense, useMemo, useRef } from 'react';
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
  const { camera } = useThree();
  const scaleGroupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);
  const globeMeshRef = useRef<THREE.Mesh>(null);

  // 8192x4096 Natural Earth III map. Massive jump in surface detail vs the old
  // 2048 — required so Turkey doesn't look like a JPEG sticker when we zoom in.
  const colorMap = useTexture('/textures/earth/earth_8k.jpg');

  // sRGB so the diffuse colors aren't gamma-flattened.
  colorMap.colorSpace = THREE.SRGBColorSpace;
  // Max GPU anisotropy + trilinear mipmaps eliminates the pixel-grid aliasing
  // you get at glancing angles. Three caps to whatever the GPU supports.
  colorMap.anisotropy = 16;
  colorMap.minFilter = THREE.LinearMipmapLinearFilter;
  colorMap.magFilter = THREE.LinearFilter;
  colorMap.generateMipmaps = true;
  colorMap.needsUpdate = true;

  // Rotation that brings Istanbul to face the camera (+Z) WITH the north pole
  // staying up. Done as yaw-around-Y then pitch-around-X (a proper look-at,
  // not a shortest-arc rotation), so the globe never rolls sideways.
  const turkeyQuat = useMemo(() => {
    const v = latLngToVec3(ISTANBUL[0], ISTANBUL[1], 1).normalize();
    const yaw = Math.atan2(-v.x, v.z);              // around +Y, brings longitude in front of camera
    const pitch = Math.atan2(v.y, Math.hypot(v.x, v.z)); // around +X, lifts the latitude up to centre
    const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
    // Apply yaw first, then pitch. quaternion.multiply: result = qX * qY (qY applied first to a vector).
    return qX.multiply(qY);
  }, []);

  // Reusable scratch objects so we don't allocate every frame.
  const autoQuat = useMemo(() => new THREE.Quaternion(), []);
  const upAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  // Damped follower for the scroll value so the globe glides toward the
  // target each frame instead of snapping with the scroll wheel.
  const smoothedSp = useRef(0);
  const outlineMatRef = useRef<THREE.LineBasicMaterial>(null);

  const turkeyOutlineGeometry = useMemo(() => {
    const lift = 1.008;
    const positions = new Float32Array(TURKEY_OUTLINE_LATLNG.length * 3);
    let i = 0;
    for (const [lat, lng] of TURKEY_OUTLINE_LATLNG) {
      const v = latLngToVec3(lat, lng, lift);
      positions[i++] = v.x;
      positions[i++] = v.y;
      positions[i++] = v.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    // Clamp delta so a long pause (e.g. frameloop went 'never' while the user
    // was on Destinations) doesn't produce a giant first-frame jump on resume.
    const dt = Math.min(delta, 0.05);
    const target = Math.max(0, Math.min(1, scrollYProgress.get()));
    // Critically damped lerp: ~1.5 s to converge from 0 to 1 on a fast scroll.
    smoothedSp.current += (target - smoothedSp.current) * Math.min(1, dt * 1.6);
    const sp = smoothedSp.current;

    // Cubic ease-in-out for a cinematic camera-fly-in feel.
    const eased =
      sp < 0.5 ? 4 * sp * sp * sp : 1 - Math.pow(-2 * sp + 2, 3) / 2;

    const t = state.clock.getElapsedTime();

    const isWideViewport = state.size.width >= 1024;
    const targetCamZ = isWideViewport ? 2.8 : 3.15;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.z += (targetCamZ - camera.position.z) * Math.min(1, dt * 10);
    }

    if (rotationGroupRef.current) {
      // Slow idle spin when sp ≈ 0; smoothly slerp toward the Turkey lock-on as eased grows.
      autoQuat.setFromAxisAngle(upAxis, t * 0.02);
      rotationGroupRef.current.quaternion.copy(autoQuat).slerp(turkeyQuat, eased);
    }

    if (scaleGroupRef.current) {
      // Gentle camera dolly: 1x at top; stronger zoom on desktop, subtler on mobile.
      const dollyMax = isWideViewport ? 0.45 : 0.3;
      const scale = 1 + eased * dollyMax;
      scaleGroupRef.current.scale.setScalar(scale);

      // Desktop: slide left so the side column has clear space over the globe.
      const slideX = isWideViewport ? 0.13 : 0;
      scaleGroupRef.current.position.x = -eased * state.viewport.width * slideX;
      // Mobile: lift the globe so Türkiye clears the bottom text stack (~lg is 1024px).
      const rise = isWideViewport ? 0 : 0.17;
      scaleGroupRef.current.position.y = eased * state.viewport.height * rise;
    }

    const rp = revealProgress.get();

    if (outlineMatRef.current) {
      const zoomOpacity = THREE.MathUtils.smoothstep(eased, 0.42, 0.88) * 0.95;
      // Fade out together with the earth texture as the hero section ends
      const heroFade = THREE.MathUtils.smoothstep(sp, 0.85, 1.0);
      const revealSnap = THREE.MathUtils.smoothstep(rp, 0.0, 0.06);
      outlineMatRef.current.opacity = zoomOpacity * (1 - Math.max(heroFade, revealSnap));
    }

    // Two-stage sphere fade:
    // 1. Hero wind-down: smooth fade as zoom finishes (sp 0.85 → 1.0)
    // 2. Reveal snap: guarantee sphere is gone before shatter fires (rp 0.0 → 0.06)
    // Taking the max ensures the fastest fade wins regardless of scroll speed.
    if (globeMeshRef.current) {
      const mat = globeMeshRef.current.material as THREE.MeshBasicMaterial;
      const heroFade = THREE.MathUtils.smoothstep(sp, 0.85, 1.0);
      const revealSnap = THREE.MathUtils.smoothstep(rp, 0.0, 0.06);
      mat.opacity = 1 - Math.max(heroFade, revealSnap);
    }
  });

  return (
    <group ref={scaleGroupRef}>
      <group ref={rotationGroupRef}>
        {/* Earth surface — flat-lit, no normal/specular shading.
            Brighter and looks clean/illustrated even when zoomed in. */}
        <mesh ref={globeMeshRef}>
          <sphereGeometry args={[1, 128, 128]} />
          <meshBasicMaterial map={colorMap} toneMapped={false} transparent />
        </mesh>
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
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    if (matRef.current) {
      const rp = revealProgress.get();
      matRef.current.opacity = 0.6 * (1 - THREE.MathUtils.smoothstep(rp, 0.08, 0.24));
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.005}
        color="#67E8F9"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface GlobeCanvasProps {
  scrollYProgress: MotionValue<number>;
  revealProgress: MotionValue<number>;
  /**
   * When false, R3F stops calling its render loop entirely. The component
   * stays mounted (texture stays in GPU memory, refs survive), but no frames
   * are produced. Toggle this from a parent that knows when the canvas is
   * actually visible — it removes both the GPU cost while hidden and the
   * remount/texture-reload lag that would happen if you unmounted instead.
   */
  visible?: boolean;
}

export default function GlobeCanvas({
  scrollYProgress,
  revealProgress,
  visible = true,
}: GlobeCanvasProps) {
  return (
    <Canvas
      // Pause the render loop entirely when the globe is hidden behind another
      // section. We never unmount the canvas, so when `visible` flips back to
      // true the existing texture, scene graph, and refs resume from where
      // they were — no remount, no decode, no animation reset.
      frameloop={visible ? 'always' : 'never'}
      // dpr clamp to 2 — without this, R3F can render the WebGL framebuffer
      // at 1x on HiDPI screens, which alone makes the globe look pixelated
      // even with a high-res texture. Cap at 2 so we don't blow up the
      // shader cost on 3x phones.
      dpr={[1, 2]}
      camera={{ position: [0, 0, 2.8], fov: 45 }}
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
