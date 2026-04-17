"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { getScrollProgress } from "@/lib/smoothScroll";

export default function PostProcessingEffects() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chromaRef = useRef<any>(null);

  useFrame(() => {
    if (!chromaRef.current) return;
    const progress = getScrollProgress();

    // Chromatic aberration peaks during tunnel entry (0.28–0.40)
    let intensity = 0;
    if (progress > 0.26 && progress < 0.42) {
      const t = (progress - 0.26) / 0.16;
      intensity = Math.sin(t * Math.PI) * 0.004;
    }
    chromaRef.current.offset = new THREE.Vector2(intensity, intensity);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette darkness={0.5} offset={0.1} blendFunction={BlendFunction.NORMAL} />
      <ChromaticAberration
        ref={chromaRef}
        offset={new THREE.Vector2(0, 0)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}
