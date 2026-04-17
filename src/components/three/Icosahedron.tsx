"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { getScrollProgress } from "@/lib/smoothScroll";

export default function Icosahedron() {
  const groupRef = useRef<THREE.Group>(null);
  const mainRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matRef = useRef<any>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const progress = getScrollProgress();
    const t = state.clock.elapsedTime;

    // Rotation — speeds up as you scroll into transition
    const speed = progress < 0.08 ? 1 : 1 + Math.min(4, ((progress - 0.08) / 0.1) * 4);
    if (mainRef.current) {
      mainRef.current.rotation.y = t * 0.2 * speed;
      mainRef.current.rotation.x = t * 0.1 * speed;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.2 * speed;
      wireRef.current.rotation.x = t * 0.1 * speed;
    }

    // Distortion: 0 → 0.4 during 0.08–0.15
    if (matRef.current) {
      if (progress < 0.08) matRef.current.distort = 0;
      else if (progress < 0.15) matRef.current.distort = ((progress - 0.08) / 0.07) * 0.4;
      else matRef.current.distort = 0.4;
    }

    // Scale: dissolve during 0.14–0.20
    if (progress < 0.14) {
      groupRef.current.scale.setScalar(1);
      groupRef.current.visible = true;
    } else if (progress < 0.20) {
      const s = 1 - (progress - 0.14) / 0.06;
      groupRef.current.scale.setScalar(Math.max(0, s));
      groupRef.current.visible = s > 0.01;
    } else {
      groupRef.current.visible = false;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.5} rotationIntensity={0.1}>
      <group ref={groupRef} position={[2.5, 0, 0]}>
        <mesh ref={mainRef}>
          <icosahedronGeometry args={[2, 4]} />
          <MeshDistortMaterial
            ref={matRef}
            color="#4A6FA5"
            metalness={0.8}
            roughness={0.2}
            distort={0}
            speed={2}
          />
        </mesh>
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[2.1, 4]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
        </mesh>
      </group>
    </Float>
  );
}
