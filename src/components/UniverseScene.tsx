"use client";
import * as THREE from "three";
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useControls, button } from "leva";

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

  const cameraControlsRef = useRef<any>();
  const earthGroupRef = useRef<THREE.Group>(null);

  // Leva Navigation Controls
  useControls(
    "🚀 Navigation",
    {
      "☀️ View Sun": button(() => {
        cameraControlsRef.current?.setLookAt(10, 5, 10, 0, 0, 0, true);
      }),
      "🌍 View Earth": button(() => {
        // Get Earth's current position
        if (earthGroupRef.current) {
          const earthPos = earthGroupRef.current.position;
          console.log("Earth position:", earthPos);

          // Position camera relative to Earth's actual position
          const offset = 5; // Distance from Earth
          cameraControlsRef.current?.setLookAt(
            earthPos.x + offset,
            earthPos.y + 3,
            earthPos.z + offset,
            earthPos.x,
            earthPos.y,
            earthPos.z,
            true,
          );
        }
      }),
      "🛰️ Top View": button(() => {
        cameraControlsRef.current?.setLookAt(0, 80, 0.1, 0, 0, 0, true);
      }),
      "🔭 Side View": button(() => {
        cameraControlsRef.current?.setLookAt(50, 0, 0, 0, 0, 0, true);
      }),
      "🏠 Reset Camera": button(() => {
        cameraControlsRef.current?.setLookAt(0, 0.1, 5, 0, 0, 0, true);
      }),
    },
    { collapsed: true }, // Collapsed by default
  );

  // Leva Movement Controls
  useControls(
    "🎮 Move Camera",
    {
      "⬆️ Move Up": button(() => {
        cameraControlsRef.current?.truck(0, -5, true);
      }),
      "⬇️ Move Down": button(() => {
        cameraControlsRef.current?.truck(0, 5, true);
      }),
      "⬅️ Move Left": button(() => {
        cameraControlsRef.current?.truck(-5, 0, true);
      }),
      "➡️ Move Right": button(() => {
        cameraControlsRef.current?.truck(5, 0, true);
      }),
      "↑ Forward": button(() => {
        cameraControlsRef.current?.forward(5, true);
      }),
      "↓ Backward": button(() => {
        cameraControlsRef.current?.forward(-5, true);
      }),
    },
    { collapsed: true }, // Collapsed by default
  );

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <BasicLoadingOverlay isLoading={isDataLoading} />

      <Canvas
        camera={{ position: [0, 0.1, 5], fov: 75 }}
        gl={{ toneMapping: THREE.NoToneMapping }}
      >
        <Sun />
        <Earth orbitScale={15} ref={earthGroupRef} />

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
        <Nebula />
        <Starfield />

        <CameraControls
          ref={cameraControlsRef}
          minDistance={1}
          maxDistance={500}
          smoothTime={0.5}
        />
      </Canvas>
    </div>
  );
}
