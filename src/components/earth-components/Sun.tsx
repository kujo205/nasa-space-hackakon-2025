import { useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function Sun() {
  const sunRef = useRef();

  // Animation for rotation
  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      {/* Sun mesh */}
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 15]} />
        <meshBasicMaterial color="#FDB813" />
        <pointLight intensity={10} distance={50} decay={2} />
      </mesh>

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          intensity={6}
          radius={0.1}
        />
      </EffectComposer>
    </>
  );
}
