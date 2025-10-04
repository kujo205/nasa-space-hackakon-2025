"use client";
import * as THREE from "three";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Nebula from "./earth-components/Nebula";
import Starfield from "./earth-components/Starfield";
import EarthMaterial from "./earth-components/EarthMaterial";
import AtmosphereMesh from "./earth-components/AtmosphereMesh";
import Asteroids from "@/components/earth-components/Asteroids";
import { items } from "@/components/exampleApiReturn";
import { useAsteroid } from "@/components/AsteroidContext";
import { getNasaJplDataArray } from "../lib/nasaApi";

const sunDirection = new THREE.Vector3(-2, 0.5, 1.5);

function Earth() {
  const ref = React.useRef();

  useFrame(() => {
    ref.current.rotation.y += 0.001;
  });
  const axialTilt = (23.4 * Math.PI) / 180;
  return (
    <group rotation-z={axialTilt}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[2, 64]} />
        <EarthMaterial sunDirection={sunDirection} />
        <AtmosphereMesh />
      </mesh>
    </group>
  );
}

export function EarthScene() {
  const { setIsSidebarOpen, allSelectedAsteroidData } = useAsteroid();

  const { x, y, z } = sunDirection;
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas
        camera={{ position: [0, 0.1, 5] }}
        gl={{ toneMapping: THREE.NoToneMapping }}
      >
        <Earth />

        <Asteroids
          onAsteroidClick={(asteroid) => {
            console.log("onAsteroidClick", asteroid);
            setIsSidebarOpen(true);
          }}
          asteroidsData={
            allSelectedAsteroidData ? allSelectedAsteroidData.final_data : []
          }
        />
        <hemisphereLight args={[0xffffff, 0x000000, 3.0]} />
        <directionalLight position={[x, y, z]} />
        <Nebula />
        <Starfield />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
