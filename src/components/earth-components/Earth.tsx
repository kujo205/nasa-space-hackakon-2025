import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import EarthMaterial from "./EarthMaterial";
import AtmosphereMesh from "./AtmosphereMesh";
import { useAsteroid } from "@/components/AsteroidContext";

export function Earth({ orbitScale = 10, orbitSpeed = 0.001 }) {
  const { selectedDate } = useAsteroid();

  const date = new Date(selectedDate);

  const earthRef = useRef();
  const orbitRef = useRef();

  // Calculate Earth's position based on date - fixed TypeScript errors
  const earthPosition = useMemo(() => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
    );
    // Use 365.25 days for a year to account for leap years
    const angle = (dayOfYear / 365.25) * Math.PI * 2;

    // Earth orbit is approximately circular with radius 1 AU
    return new THREE.Vector3(
      Math.sin(angle) * orbitScale,
      0,
      Math.cos(angle) * orbitScale,
    );
  }, [date, orbitScale]);

  // Generate Earth's orbital path
  const orbitPath = useMemo(() => {
    const points = [];
    const segments = 64;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.sin(angle) * orbitScale,
          0,
          Math.cos(angle) * orbitScale,
        ),
      );
    }

    return points;
  }, [orbitScale]);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  const axialTilt = (23.4 * Math.PI) / 180;

  // Sun direction adjusted based on Earth's position
  const adjustedSunDirection = new THREE.Vector3(0, 0, 0)
    .sub(earthPosition)
    .normalize();

  return (
    <>
      {/* Earth's orbital path */}
      <Line
        points={orbitPath}
        color="blue"
        lineWidth={1}
        transparent
        opacity={0.5}
      />

      {/* Earth group at orbital position - fixed rotation syntax */}
      <group
        position={earthPosition}
        rotation={[0, 0, axialTilt]}
        ref={orbitRef}
      >
        <mesh scale={[0.15, 0.15, 0.15]} ref={earthRef}>
          <icosahedronGeometry args={[2, 64]} />
          <EarthMaterial sunDirection={adjustedSunDirection} />
          {/* Added default props for AtmosphereMesh */}
          <AtmosphereMesh rimHex={0x0088ff} facingHex={0x000000} />
        </mesh>
      </group>
    </>
  );
}
