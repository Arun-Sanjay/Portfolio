"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getScrollProgress } from "@/lib/smoothScroll";

const STAR_COUNT = 2000;

export default function StarField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute stars in a large volume around the camera path
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const progress = getScrollProgress();
    const material = pointsRef.current.material as THREE.PointsMaterial;

    // Stars become more visible during finale
    const baseOpacity = 0.6;
    const finalBoost = progress > 0.85 ? (progress - 0.85) / 0.15 * 0.3 : 0;
    material.opacity = baseOpacity + finalBoost;

    // Gentle rotation for ambient motion
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
