import * as THREE from "three";
import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { SBDBResponse } from "../../app/types";
import { useAsteroid } from "@/components/AsteroidContext";

// Define interfaces for better type safety
interface OrbitalElements {
  a: number; // semi-major axis
  e: number; // eccentricity
  i: number; // inclination
  om: number; // longitude of ascending node
  w: number; // argument of perihelion
  ma: number; // mean anomaly
  n: number; // mean motion
  period: number; // orbital period
}

interface ProcessedAsteroid extends OrbitalElements {
  name: string;
  color: THREE.Color;
  orbitPath: THREE.Vector3[];
  markedAnomaly: number;
  neo_reference_id?: string;
  epoch?: number;
}

function parseOrbitalElements(
  asteroidData: SBDBResponse,
): OrbitalElements & { name: string; epoch: number } {
  const elements = {} as OrbitalElements;

  asteroidData.orbit.elements.forEach((elem) => {
    switch (elem.name) {
      case "a":
        elements.a = parseFloat(elem.value);
        break;
      case "e":
        elements.e = parseFloat(elem.value);
        break;
      case "i":
        elements.i = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "om":
        elements.om = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "w":
        elements.w = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "ma":
        elements.ma = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "n":
        elements.n = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "per":
        elements.period = parseFloat(elem.value);
        break;
    }
  });

  if (!elements.period && elements.a) {
    elements.period = 365.25 * Math.pow(elements.a, 1.5);
  }

  if (!elements.n && elements.period) {
    elements.n = (2 * Math.PI) / elements.period;
  }

  return {
    name: asteroidData.object.fullname || asteroidData.object.des,
    ...elements,
    epoch: parseFloat(asteroidData.orbit.epoch),
  };
}

function solveKeplerEquation(M: number, e: number): number {
  M = M % (2 * Math.PI);
  if (M < 0) M += 2 * Math.PI;

  let E = M + e * Math.sin(M);

  for (let i = 0; i < 10; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;

    if (Math.abs(dE) < 1e-8) break;
  }

  return E;
}

function calculateOrbitalPosition(
  elements: OrbitalElements,
  meanAnomaly: number,
  orbitScale: number = 10,
) {
  const { a, e, i, om, w } = elements;

  const E = solveKeplerEquation(meanAnomaly, e);

  const nu =
    2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2),
    );

  const r = a * (1 - e * Math.cos(E));

  const xOrb = r * Math.cos(nu);
  const yOrb = r * Math.sin(nu);

  const cosW = Math.cos(w);
  const sinW = Math.sin(w);
  const cosOm = Math.cos(om);
  const sinOm = Math.sin(om);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);

  const x =
    (cosW * cosOm - sinW * sinOm * cosI) * xOrb +
    (-sinW * cosOm - cosW * sinOm * cosI) * yOrb;
  const y =
    (cosW * sinOm + sinW * cosOm * cosI) * xOrb +
    (-sinW * sinOm + cosW * cosOm * cosI) * yOrb;
  const z = sinW * sinI * xOrb + cosW * sinI * yOrb;

  return {
    position: new THREE.Vector3(x * orbitScale, z * orbitScale, y * orbitScale),
    trueAnomaly: nu,
    radius: r,
    eccentricAnomaly: E,
  };
}

function generateOrbitPath(
  elements: OrbitalElements,
  numPoints: number = 200,
  orbitScale: number = 10,
): THREE.Vector3[] {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const meanAnomaly = (i / numPoints) * Math.PI * 2;
    const { position } = calculateOrbitalPosition(
      elements,
      meanAnomaly,
      orbitScale,
    );
    points.push(position);
  }
  return points;
}

function getAsteroidColor(elements: OrbitalElements): THREE.Color {
  const { a } = elements;

  if (a < 1) {
    return new THREE.Color(0xff6b6b);
  } else if (a < 1.5) {
    return new THREE.Color(0xffa500);
  } else if (a < 2.5) {
    return new THREE.Color(0xffeb3b);
  } else {
    return new THREE.Color(0x4ecdc4);
  }
}

interface AsteroidProps {
  asteroidsData: SBDBResponse[];
  timeScale?: number;
  onAsteroidClick: (neo_reference_id: string) => void;
  orbitScale?: number;
}

export default function Asteroids({
  asteroidsData = [],
  timeScale = 0.0001, // Very small value for minimal movement
  onAsteroidClick,
  orbitScale = 10,
}: AsteroidProps) {
  const { selectedNaoReferenceId, isSidebarOpen } = useAsteroid();
  const markerMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [hoveredAsteroid, setHoveredAsteroid] = useState<number | null>(null);

  // Parse all asteroid data
  const asteroids = useMemo(() => {
    if (!asteroidsData || asteroidsData.length === 0) {
      return [
        {
          name: "Example Asteroid",
          a: 1.5,
          e: 0.2,
          i: 0.2,
          om: 0.5,
          w: 1.0,
          ma: 0,
          n: (0.5 * Math.PI) / 180,
          period: 670,
          color: new THREE.Color(0xffeb3b),
          orbitPath: generateOrbitPath(
            {
              a: 1.5,
              e: 0.2,
              i: 0.2,
              om: 0.5,
              w: 1.0,
              ma: 0,
              n: (0.5 * Math.PI) / 180,
              period: 670,
            },
            200,
            orbitScale,
          ),
          markedAnomaly: 0,
        },
      ] as ProcessedAsteroid[];
    }

    return asteroidsData.map((data) => {
      const elements = parseOrbitalElements(data);
      return {
        ...elements,
        color: getAsteroidColor(elements),
        orbitPath: generateOrbitPath(elements, 200, orbitScale),
        markedAnomaly: 0,
        neo_reference_id: data.neo_reference_id,
      } as ProcessedAsteroid;
    });
  }, [asteroidsData, orbitScale]);

  const [currentTime, setCurrentTime] = useState(0);

  // Update markers positions
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    setCurrentTime(time);

    if (markerMeshRef.current) {
      asteroids.forEach((asteroid, i) => {
        const markerData = calculateOrbitalPosition(
          asteroid,
          asteroid.markedAnomaly,
          orbitScale,
        );

        dummy.position.copy(markerData.position);
        dummy.scale.set(1.5, 1.5, 1.5);
        dummy.rotation.y = time * 0.5; // Keep rotation for visual effect
        dummy.updateMatrix();
        markerMeshRef.current.setMatrixAt(i, dummy.matrix);
      });

      markerMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const handleAsteroidClick = (index: number) => {
    if (onAsteroidClick && asteroids[index]?.neo_reference_id) {
      onAsteroidClick(asteroids[index].neo_reference_id!);
    }
  };

  return (
    <>
      {/* Orbital paths */}
      {asteroids.map((asteroid, i) => {
        const makeLineHovered =
          hoveredAsteroid === i ||
          (asteroid.neo_reference_id === selectedNaoReferenceId &&
            isSidebarOpen);

        return (
          <Line
            depthWrite={false}
            key={`orbit-${i}`}
            points={asteroid.orbitPath}
            color={makeLineHovered ? "yellow" : asteroid.color}
            lineWidth={makeLineHovered ? 2.5 : 1.5}
            transparent
            depthTest={true}
            opacity={makeLineHovered ? 0.9 : 0.6}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredAsteroid(i);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHoveredAsteroid(null);
              document.body.style.cursor = "auto";
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleAsteroidClick(i);
            }}
          />
        );
      })}

      {/* Asteroids - at fixed positions matching markers */}
      {asteroids.map((asteroid, i) => {
        const { position, radius } = calculateOrbitalPosition(
          asteroid,
          asteroid.markedAnomaly, // Fixed position
          orbitScale,
        );
        const isHovered = hoveredAsteroid === i;
        const scale = (1 + (radius / asteroid.a) * 0.2) * (isHovered ? 1.3 : 1);

        return (
          <mesh
            key={`asteroid-${i}`}
            position={position}
            scale={[scale, scale, scale]}
            rotation={[currentTime * 0.01, currentTime * 0.02, 0]} // Subtle rotation
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredAsteroid(i);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHoveredAsteroid(null);
              document.body.style.cursor = "auto";
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleAsteroidClick(i);
            }}
          >
            <icosahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial
              color={isHovered ? "#ffff00" : "#817a6e"}
              emissive={isHovered ? "#ffff00" : "#000000"}
              emissiveIntensity={isHovered ? 0.5 : 0}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Markers - ADDED THIS MISSING SECTION */}
      <instancedMesh ref={markerMeshRef} args={[null, null, asteroids.length]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={"#4da4a4"} transparent opacity={0.8} />
      </instancedMesh>
    </>
  );
}

// Example usage with NASA data:
// const asteroidDataArray = [nasaData1, nasaData2, nasaData3];
// <Asteroids asteroidsData={asteroidDataArray} timeScale={50} />
//
// timeScale: How many days pass per real second (default 50 for visibility)
// Example usage with NASA data:
// const asteroidDataArray = [nasaData1, nasaData2, nasaData3];
// <Asteroids asteroidsData={asteroidDataArray} />
