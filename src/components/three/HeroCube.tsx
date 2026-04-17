"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Simple 3x3x3 Rubik's cube — NO scroll, NO text, just rotation
const GRID = 3;
const GAP = 0.15;
const MINI = 0.62;
const TOTAL = (GRID - 1) * (MINI + GAP);

const COLORS: Record<string, string> = {
  front: "#4A6FA5",
  back: "#2d5a3d",
  right: "#C9A84C",
  left: "#6b3fa0",
  top: "#A6DAFF",
  bottom: "#1a1a2e",
  inner: "#0e0e0e",
};

function getColor(x: number, y: number, z: number): string {
  if (z === 0) return COLORS.front;
  if (z === 2) return COLORS.back;
  if (x === 0) return COLORS.left;
  if (x === 2) return COLORS.right;
  if (y === 2) return COLORS.top;
  if (y === 0) return COLORS.bottom;
  return COLORS.inner;
}

interface Cell { pos: [number, number, number]; color: string }

function buildGrid(): Cell[] {
  const cells: Cell[] = [];
  const off = TOTAL / 2;
  for (let x = 0; x < GRID; x++)
    for (let y = 0; y < GRID; y++)
      for (let z = 0; z < GRID; z++)
        cells.push({
          pos: [x * (MINI + GAP) - off, y * (MINI + GAP) - off, z * (MINI + GAP) - off],
          color: getColor(x, y, z),
        });
  return cells;
}

export default function HeroCube() {
  const ref = useRef<THREE.Group>(null);
  const grid = useMemo(() => buildGrid(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.2;
    ref.current.rotation.x = Math.sin(t * 0.15) * 0.2;
  });

  return (
    <group ref={ref} position={[2.8, 0, 0]}>
      {grid.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <boxGeometry args={[MINI, MINI, MINI]} />
          <meshStandardMaterial color={c.color} metalness={0.55} roughness={0.3} />
        </mesh>
      ))}
      <mesh>
        <boxGeometry args={[TOTAL + 0.15, TOTAL + 0.15, TOTAL + 0.15]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.04} />
      </mesh>
    </group>
  );
}
