'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';

export default function ShatterGlobe({ revealProgress }: { revealProgress: MotionValue<number> }) {
  const shockRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const shockMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x67e8f9),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      shockMat.dispose();
    },
    [shockMat],
  );

  useFrame(() => {
    const rp = revealProgress.get();

    if (groupRef.current) groupRef.current.visible = rp > 0.09;

    // Shockwave ring (rp 0.12 → 0.26)
    const shock = shockRef.current;
    if (shock) {
      const sw = THREE.MathUtils.clamp((rp - 0.12) / 0.14, 0, 1);
      const swEase = 1 - Math.pow(1 - sw, 3);
      shock.scale.setScalar(1 + swEase * 3.2);
      shock.visible = sw > 0 && sw < 1;
      const mat = shock.material;
      if (mat instanceof THREE.MeshBasicMaterial) {
        mat.opacity = (1 - sw) * 0.85;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={shockRef} position={[0, 0, 1.01]} visible={false} material={shockMat}>
        <ringGeometry args={[0, 0.04, 64]} />
      </mesh>
    </group>
  );
}
