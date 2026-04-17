"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getScrollProgress } from "@/lib/smoothScroll";
import { ALL_SKILLS_FLAT } from "@/lib/constants";

const CUBE_COUNT = 50;
const TUNNEL_RADIUS = 5;
const TUNNEL_LENGTH = 25;

interface CubeData {
  scattered: THREE.Vector3;
  tunnel: THREE.Vector3;
  size: number;
  rotSpeed: [number, number, number];
  skill: string | null;
}

function makeCubes(): CubeData[] {
  const out: CubeData[] = [];
  for (let i = 0; i < CUBE_COUNT; i++) {
    // Scattered: random cylindrical volume ahead of camera
    const sa = Math.random() * Math.PI * 2;
    const sr = 1.5 + Math.random() * 7;
    const sz = -4 - Math.random() * 28;

    // Tunnel: organized cylinder formation
    const ta = (i / CUBE_COUNT) * Math.PI * 2 * 3.5 + (Math.random() - 0.5) * 0.6;
    const tr = TUNNEL_RADIUS + (Math.random() - 0.5) * 2;
    const tz = -8 - (i / CUBE_COUNT) * TUNNEL_LENGTH;

    out.push({
      scattered: new THREE.Vector3(Math.cos(sa) * sr, Math.sin(sa) * sr, sz),
      tunnel: new THREE.Vector3(Math.cos(ta) * tr, Math.sin(ta) * tr, tz),
      size: 0.25 + Math.random() * 0.55,
      rotSpeed: [
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.3,
      ],
      skill: i < ALL_SKILLS_FLAT.length ? ALL_SKILLS_FLAT[i] : null,
    });
  }
  return out;
}

export default function FloatingCubes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() => makeCubes(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpV = useMemo(() => new THREE.Vector3(), []);
  const labeled = useMemo(() => data.filter((c) => c.skill), [data]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const progress = getScrollProgress();
    const time = state.clock.elapsedTime;

    // Cubes fade in 0.14→0.20, fade out 0.42→0.45
    const fadeIn = progress < 0.14 ? 0 : Math.min(1, (progress - 0.14) / 0.06);
    const fadeOut = progress > 0.42 ? Math.max(0, 1 - (progress - 0.42) / 0.03) : 1;
    const vis = fadeIn * fadeOut;

    if (vis <= 0) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    // Tunnel formation: 0.28→0.40
    let tLerp = 0;
    if (progress >= 0.28 && progress < 0.40) {
      tLerp = (progress - 0.28) / 0.12;
    } else if (progress >= 0.40) {
      tLerp = 1;
    }
    // Smooth ease
    tLerp = tLerp * tLerp * (3 - 2 * tLerp);

    for (let i = 0; i < CUBE_COUNT; i++) {
      const c = data[i];
      tmpV.lerpVectors(c.scattered, c.tunnel, tLerp);

      dummy.position.copy(tmpV);
      dummy.rotation.set(
        time * c.rotSpeed[0],
        time * c.rotSpeed[1],
        time * c.rotSpeed[2]
      );
      dummy.scale.setScalar(c.size * vis);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, CUBE_COUNT]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={0.5}
        />
      </instancedMesh>

      {labeled.map((c, i) => (
        <SkillLabel key={i} cube={c} />
      ))}
    </group>
  );
}

function SkillLabel({ cube }: { cube: CubeData }) {
  const ref = useRef<THREE.Group>(null);
  const tmpV = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!ref.current) return;
    const progress = getScrollProgress();

    const fadeIn = progress < 0.18 ? 0 : Math.min(1, (progress - 0.18) / 0.04);
    const fadeOut = progress > 0.36 ? Math.max(0, 1 - (progress - 0.36) / 0.04) : 1;
    const vis = fadeIn * fadeOut;

    if (vis <= 0) { ref.current.visible = false; return; }
    ref.current.visible = true;

    let tLerp = 0;
    if (progress >= 0.28 && progress < 0.40) tLerp = (progress - 0.28) / 0.12;
    else if (progress >= 0.40) tLerp = 1;
    tLerp = tLerp * tLerp * (3 - 2 * tLerp);

    tmpV.lerpVectors(cube.scattered, cube.tunnel, tLerp);
    ref.current.position.copy(tmpV);
    ref.current.position.y += cube.size * 0.9;
  });

  return (
    <group ref={ref}>
      <Text fontSize={0.18} anchorX="center" anchorY="bottom" maxWidth={2}>
        {cube.skill}
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} depthTest={false} />
      </Text>
    </group>
  );
}
