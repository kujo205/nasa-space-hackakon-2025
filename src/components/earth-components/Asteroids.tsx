import * as THREE from "three";
import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Cone } from "@react-three/drei";
import { SBDBResponse } from "../../app/types";

/**
 * Parse NASA SBDB orbital elements and create Keplerian orbit
 * @param {Object} asteroidData - NASA SBDB API data
 * @returns {Object} Parsed orbital parameters
 */
function parseOrbitalElements(asteroidData) {
  const elements = {};

  asteroidData.orbit.elements.forEach((elem) => {
    switch (elem.name) {
      case "a": // semi-major axis (AU)
        elements.a = parseFloat(elem.value);
        break;
      case "e": // eccentricity
        elements.e = parseFloat(elem.value);
        break;
      case "i": // inclination (degrees)
        elements.i = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "om": // longitude of ascending node (degrees)
        elements.om = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "w": // argument of perihelion (degrees)
        elements.w = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "ma": // mean anomaly (degrees)
        elements.ma = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "n": // mean motion (deg/day)
        elements.n = (parseFloat(elem.value) * Math.PI) / 180;
        break;
      case "per": // orbital period (days)
        elements.period = parseFloat(elem.value);
        break;
    }
  });

  // If period not provided, calculate from semi-major axis (Kepler's 3rd law)
  if (!elements.period && elements.a) {
    elements.period = 365.25 * Math.pow(elements.a, 1.5); // Period in days
  }

  // If mean motion not provided, calculate from period
  if (!elements.n && elements.period) {
    elements.n = (2 * Math.PI) / elements.period; // radians per day
  }

  return {
    name: asteroidData.object.fullname || asteroidData.object.des,
    ...elements,
    epoch: parseFloat(asteroidData.orbit.epoch),
  };
}

/**
 * Solve Kepler's equation: E - e*sin(E) = M
 * Uses Newton-Raphson iteration for accuracy
 * @param {number} M - Mean anomaly (radians)
 * @param {number} e - Eccentricity
 * @returns {number} Eccentric anomaly (radians)
 */
function solveKeplerEquation(M, e) {
  // Normalize M to [0, 2π]
  M = M % (2 * Math.PI);
  if (M < 0) M += 2 * Math.PI;

  // Initial guess
  let E = M + e * Math.sin(M);

  // Newton-Raphson iteration
  for (let i = 0; i < 10; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;

    // Check convergence
    if (Math.abs(dE) < 1e-8) break;
  }

  return E;
}

/**
 * Calculate position and velocity on Keplerian orbit
 * @param {Object} elements - Orbital elements
 * @param {number} meanAnomaly - Current mean anomaly
 * @returns {Object} {position: THREE.Vector3, trueAnomaly: number, radius: number}
 */
function calculateOrbitalPosition(elements, meanAnomaly) {
  const { a, e, i, om, w } = elements;

  // Solve Kepler's equation for eccentric anomaly
  const E = solveKeplerEquation(meanAnomaly, e);

  // True anomaly - actual angle from perihelion
  const nu =
    2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2),
    );

  // Orbital radius (distance from Sun)
  const r = a * (1 - e * Math.cos(E));

  // Position in orbital plane
  const xOrb = r * Math.cos(nu);
  const yOrb = r * Math.sin(nu);

  // Rotation matrices to transform from orbital plane to ecliptic coordinates
  const cosW = Math.cos(w);
  const sinW = Math.sin(w);
  const cosOm = Math.cos(om);
  const sinOm = Math.sin(om);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);

  // Apply rotations: w (argument of perihelion), i (inclination), om (longitude of node)
  const x =
    (cosW * cosOm - sinW * sinOm * cosI) * xOrb +
    (-sinW * cosOm - cosW * sinOm * cosI) * yOrb;
  const y =
    (cosW * sinOm + sinW * cosOm * cosI) * xOrb +
    (-sinW * sinOm + cosW * cosOm * cosI) * yOrb;
  const z = sinW * sinI * xOrb + cosW * sinI * yOrb;

  // Scale to visualization units (1 AU = 5 units in our scene)
  const scale = 5;

  return {
    position: new THREE.Vector3(x * scale, z * scale, y * scale),
    trueAnomaly: nu,
    radius: r,
    eccentricAnomaly: E,
  };
}

/**
 * Generate orbital path points
 * @param {Object} elements - Orbital elements
 * @param {number} numPoints - Number of points to generate
 * @returns {Array<THREE.Vector3>} Array of position vectors
 */
function generateOrbitPath(elements, numPoints = 200) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const meanAnomaly = (i / numPoints) * Math.PI * 2;
    const { position } = calculateOrbitalPosition(elements, meanAnomaly);
    points.push(position);
  }
  return points;
}

/**
 * Get color based on asteroid type or orbital characteristics
 */
function getAsteroidColor(elements) {
  const { a, e } = elements;

  // Color based on semi-major axis (distance from sun)
  if (a < 1) {
    return new THREE.Color(0xff6b6b); // Red for inner asteroids (Atens/Apollos)
  } else if (a < 1.5) {
    return new THREE.Color(0xffa500); // Orange
  } else if (a < 2.5) {
    return new THREE.Color(0xffeb3b); // Yellow (main belt)
  } else {
    return new THREE.Color(0x4ecdc4); // Cyan for outer asteroids
  }
}

interface AsteroidProps {
  asteroidsData: SBDBResponse[];
  timeScale: number;
  onAsteroidClick: (arg0: OrbitData) => void;
}

export default function Asteroids({
  asteroidsData = [],
  timeScale = 2,
  onAsteroidClick,
}: AsteroidProps) {
  const markerMeshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [hoveredAsteroid, setHoveredAsteroid] = useState(null);

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
          orbitPath: generateOrbitPath({
            a: 1.5,
            e: 0.2,
            i: 0.2,
            om: 0.5,
            w: 1.0,
          }),
          markedAnomaly: 0,
        },
      ];
    }
    return asteroidsData.map((data) => {
      const elements = parseOrbitalElements(data);
      return {
        ...elements,
        color: getAsteroidColor(elements),
        orbitPath: generateOrbitPath(elements),
        markedAnomaly: 0,
      };
    });
  }, [asteroidsData]);

  // Track current time for asteroid positions
  const [currentTime, setCurrentTime] = useState(0);

  // Animate markers and update time
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    setCurrentTime(time);

    asteroids.forEach((asteroid, i) => {
      const markerData = calculateOrbitalPosition(
        asteroid,
        asteroid.markedAnomaly,
      );
      dummy.position.copy(markerData.position);
      dummy.scale.set(1.5, 1.5, 1.5);
      dummy.rotation.y = time * 0.5;
      dummy.updateMatrix();
      markerMeshRef.current.setMatrixAt(i, dummy.matrix);
    });
    markerMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  const handleAsteroidClick = (index: number) => {
    if (onAsteroidClick) {
      onAsteroidClick(asteroids[index], index);
    }
  };

  return (
    <>
      {/* Orbital paths */}
      {asteroids.map((asteroid, i) => (
        <Line
          key={`orbit-${i}`}
          points={asteroid.orbitPath}
          color={hoveredAsteroid === i ? "yellow" : asteroid.color}
          lineWidth={hoveredAsteroid === i ? 2.5 : 1.5}
          transparent
          opacity={hoveredAsteroid === i ? 0.9 : 0.6}
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
      ))}
      {/* Asteroids - with individual meshes for hover detection */}
      {asteroids.map((asteroid, i) => {
        const elapsedDays = currentTime * timeScale;
        const currentMeanAnomaly = asteroid.ma + asteroid.n * elapsedDays;
        const { position, radius } = calculateOrbitalPosition(
          asteroid,
          currentMeanAnomaly,
        );
        const isHovered = hoveredAsteroid === i;
        const scale = (1 + (radius / asteroid.a) * 0.2) * (isHovered ? 1.3 : 1);

        return (
          <mesh
            key={`asteroid-${i}`}
            position={position}
            scale={[scale, scale, scale]}
            rotation={[currentTime * 0.01, currentTime * 0.02, 0]}
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
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={isHovered ? "yellow" : "grey"}
              emissive={isHovered ? "yellow" : "black"}
              emissiveIntensity={isHovered ? 0.5 : 0}
            />
          </mesh>
        );
      })}
      {/* Markers */}
      <instancedMesh ref={markerMeshRef} args={[null, null, asteroids.length]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={0.8} />
      </instancedMesh>
      {/* Rings */}
      {asteroids.map((asteroid, i) => {
        const markerData = calculateOrbitalPosition(
          asteroid,
          asteroid.markedAnomaly,
        );
        const isHovered = hoveredAsteroid === i;
        return (
          <mesh
            key={`marker-ring-${i}`}
            position={markerData.position}
            scale={[1, 1, 1]}
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
            <ringGeometry args={[0.15, 0.2, 32]} />
            <meshBasicMaterial
              color={isHovered ? "cyan" : asteroid.color}
              side={THREE.DoubleSide}
              transparent
              opacity={isHovered ? 0.9 : 0.6}
            />
          </mesh>
        );
      })}
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
