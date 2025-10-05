"use client";
import * as THREE from "three";
import React from "react";
import { Canvas } from "@react-three/fiber";

import { OrbitControls } from "@react-three/drei";
import Nebula from "./earth-components/Nebula";
import Starfield from "./earth-components/Starfield";
import Asteroids from "@/components/earth-components/Asteroids";
import { useAsteroid } from "@/components/AsteroidContext";
import { BasicLoadingOverlay } from "@/components/earth-components/Spinner";
import Sun from "./earth-components/Sun";
import { Earth } from "./earth-components/Earth";

export function UniverseScene() {
  const {
    setIsSidebarOpen,
    allSelectedAsteroidData,
    setSelectedNaoReferenceId,
    isDataLoading,
  } = useAsteroid();

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <BasicLoadingOverlay isLoading={isDataLoading} />

      <Canvas
        camera={{ position: [0, 0.1, 5] }}
        gl={{ toneMapping: THREE.NoToneMapping }}
      >
        <Sun />
        <Earth orbitScale={15} />

        <Asteroids
          orbitScale={15}
          onAsteroidClick={(asteroid) => {
            setSelectedNaoReferenceId(asteroid);
            setIsSidebarOpen(true);
          }}
          timeScale={0.5}
          asteroidsData={
            allSelectedAsteroidData ? allSelectedAsteroidData.final_data : []
          }
        />
        <hemisphereLight args={[0xffffff, 0x000000, 3.0]} />
        {/*<directionalLight position={[x, y, z]} />*/}
        <Nebula />
        <Starfield />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
