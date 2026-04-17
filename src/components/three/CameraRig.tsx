"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getScrollProgress } from "@/lib/smoothScroll";

const KEYFRAMES = [
  { t: 0.0,  pos: [0, 0, 8],    look: [2, 0, 0] },   // looking toward globe
  { t: 0.06, pos: [0, 0, 7],    look: [1, 0, -1] },
  { t: 0.12, pos: [0, 0, 5],    look: [0, 0, -3] },
  { t: 0.18, pos: [0, 0, 2],    look: [0, 0, -8] },
  { t: 0.22, pos: [0, 0, -2],   look: [0, 0, -12] },
  { t: 0.28, pos: [0, 0, -6],   look: [0, 0, -16] },
  { t: 0.34, pos: [0, 0, -12],  look: [0, 0, -22] },
  { t: 0.40, pos: [0, 0, -22],  look: [0, 0, -32] },
  { t: 0.50, pos: [0, 0, -28],  look: [0, 0, -38] },
  { t: 1.0,  pos: [0, 0, -28],  look: [0, 0, -38] },
];

export default function CameraRig() {
  const { camera } = useThree();
  const initialized = useRef(false);
  const currentPos = useRef(new THREE.Vector3(0, 0, 8));
  const currentLook = useRef(new THREE.Vector3(2, 0, 0));

  const { posCurve, lookCurve, progressToParam } = useMemo(() => {
    const posPoints = KEYFRAMES.map(
      (kf) => new THREE.Vector3(kf.pos[0], kf.pos[1], kf.pos[2])
    );
    const lookPoints = KEYFRAMES.map(
      (kf) => new THREE.Vector3(kf.look[0], kf.look[1], kf.look[2])
    );
    const posCurve = new THREE.CatmullRomCurve3(posPoints, false, "catmullrom", 0.3);
    const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, "catmullrom", 0.3);

    const progressToParam = (scroll: number): number => {
      const c = Math.max(0, Math.min(1, scroll));
      for (let i = 0; i < KEYFRAMES.length - 1; i++) {
        if (c >= KEYFRAMES[i].t && c <= KEYFRAMES[i + 1].t) {
          const local = (c - KEYFRAMES[i].t) / (KEYFRAMES[i + 1].t - KEYFRAMES[i].t);
          const ca = i / (KEYFRAMES.length - 1);
          const cb = (i + 1) / (KEYFRAMES.length - 1);
          return ca + local * (cb - ca);
        }
      }
      return 1;
    };

    return { posCurve, lookCurve, progressToParam };
  }, []);

  useFrame(() => {
    const progress = getScrollProgress();
    const param = progressToParam(progress);

    const targetPos = posCurve.getPoint(param);
    const targetLook = lookCurve.getPoint(param);

    if (!initialized.current) {
      // Snap on first frame — no lerp
      currentPos.current.copy(targetPos);
      currentLook.current.copy(targetLook);
      initialized.current = true;
    } else {
      currentPos.current.lerp(targetPos, 0.07);
      currentLook.current.lerp(targetLook, 0.07);
    }

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}
