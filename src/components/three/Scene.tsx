"use client";

import { Canvas } from "@react-three/fiber";
import StarField from "./StarField";
import HeroCube from "./HeroCube";

export default function Scene() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    >
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 60, near: 0.1, far: 200, position: [0, 0, 8] }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000");
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, -2, 4]} intensity={0.4} color="#A6DAFF" />
        <pointLight position={[0, 3, 6]} intensity={0.6} />

        <StarField />
        <HeroCube />
      </Canvas>
    </div>
  );
}
