import { useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";

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
        <pointLight intensity={20} distance={100} decay={2} />
      </mesh>

      {/* Corona effect */}
      <mesh position={[0, 0, 0]} layers={1}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#FF5F1F"
          transparent={true}
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Match reference code bloom parameters exactly */}
      <EffectComposer>
        <Bloom
          kernelSize={KernelSize.LARGE}
          luminanceThreshold={0} // match reference
          luminanceSmoothing={0.2}
          intensity={1.5} // match reference
          radius={0.85} // match reference
          blendFunction={BlendFunction.SCREEN}
        />
      </EffectComposer>
    </>
  );
}
