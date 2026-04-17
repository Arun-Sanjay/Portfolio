"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getScrollProgress } from "@/lib/smoothScroll";

const PORTAL_POSITIONS: [number, number, number][] = [
  [-3, 0, -33],
  [2, 0.5, -37],
  [5, -0.3, -41],
];

const PORTAL_ROTATIONS: [number, number, number][] = [
  [0, 0.3, 0],
  [0, -0.15, 0],
  [0, -0.4, 0],
];

function PortalFrame({
  position,
  rotation,
  index,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const edgeMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!groupRef.current || !edgeMaterialRef.current) return;
    const progress = getScrollProgress();
    const time = state.clock.elapsedTime;

    // Portals visible 0.40 → 0.72
    const fadeIn = progress < 0.40 ? 0 : Math.min(1, (progress - 0.40) / 0.02);
    const fadeOut = progress > 0.70 ? Math.max(0, 1 - (progress - 0.70) / 0.02) : 1;
    const visibility = fadeIn * fadeOut;

    groupRef.current.visible = visibility > 0;
    groupRef.current.scale.setScalar(visibility);

    // Float
    groupRef.current.position.y =
      position[1] + Math.sin(time * 0.5 + index * 2) * 0.15;

    // Active glow based on which project scroll range we're in
    const projectRanges = [
      [0.44, 0.54],
      [0.54, 0.62],
      [0.62, 0.70],
    ];
    const isActive =
      progress >= projectRanges[index][0] &&
      progress < projectRanges[index][1];

    edgeMaterialRef.current.opacity = isActive ? 0.8 : 0.2;
    edgeMaterialRef.current.color.set(isActive ? "#A6DAFF" : "#ffffff");
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Portal frame — edges of a rectangle */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(3, 4)]} />
        <lineBasicMaterial
          ref={edgeMaterialRef}
          color="#ffffff"
          transparent
          opacity={0.2}
          linewidth={1}
        />
      </lineSegments>

      {/* Subtle inner glow */}
      <mesh>
        <planeGeometry args={[3, 4]} />
        <meshBasicMaterial
          color="#A6DAFF"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function ProjectPortals() {
  return (
    <group>
      {PORTAL_POSITIONS.map((pos, i) => (
        <PortalFrame
          key={i}
          position={pos}
          rotation={PORTAL_ROTATIONS[i]}
          index={i}
        />
      ))}
    </group>
  );
}
