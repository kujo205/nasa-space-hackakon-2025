import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

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

export default function Asteroids({ asteroidsData = [], timeScale = 1 }) {
  const meshRef = useRef();
  const markerMeshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Parse all asteroid data
  const asteroids = useMemo(() => {
    if (!asteroidsData || asteroidsData.length === 0) {
      // Fallback to example data if none provided
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
        },
      ];
    }

    return asteroidsData.map((data) => {
      const elements = parseOrbitalElements(data);
      return {
        ...elements,
        color: getAsteroidColor(elements),
        orbitPath: generateOrbitPath(elements),
        // Mark perihelion (closest approach)
        markedAnomaly: 0, // Mean anomaly at perihelion is 0
      };
    });
  }, [asteroidsData]);

  // Animate asteroids with correct Keplerian motion
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    asteroids.forEach((asteroid, i) => {
      // Calculate elapsed time in days (sped up for visualization)
      const elapsedDays = time * timeScale;

      // Calculate current mean anomaly
      // M = M0 + n*t (where n is mean motion in radians/day)
      const currentMeanAnomaly = asteroid.ma + asteroid.n * elapsedDays;

      // Get position (this accounts for varying speed via Kepler's equation)
      const { position, radius, trueAnomaly } = calculateOrbitalPosition(
        asteroid,
        currentMeanAnomaly,
      );

      // Update asteroid position
      dummy.position.copy(position);

      // Rotate asteroid (spin rate could also be based on real data)
      dummy.rotation.x += 0.01;
      dummy.rotation.y += 0.02;

      // Optional: scale asteroid based on distance for visibility
      const scale = 1 + (radius / asteroid.a) * 0.2;
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Update marker position (at perihelion - marked point)
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

    meshRef.current.instanceMatrix.needsUpdate = true;
    markerMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Draw orbital paths */}
      {asteroids.map((asteroid, i) => (
        <Line
          key={`orbit-${i}`}
          points={asteroid.orbitPath}
          color={asteroid.color}
          lineWidth={1.5}
          transparent
          opacity={0.6}
        />
      ))}

      {/* Render asteroids */}
      <instancedMesh ref={meshRef} args={[null, null, asteroids.length]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial />
      </instancedMesh>

      {/* Render markers at specific orbital points (perihelion) */}
      <instancedMesh ref={markerMeshRef} args={[null, null, asteroids.length]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={0.8} />
      </instancedMesh>

      {/* Add rings around markers */}
      {asteroids.map((asteroid, i) => {
        const markerData = calculateOrbitalPosition(
          asteroid,
          asteroid.markedAnomaly,
        );
        return (
          <mesh key={`marker-ring-${i}`} position={markerData.position}>
            <ringGeometry args={[0.15, 0.2, 32]} />
            <meshBasicMaterial
              color={asteroid.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
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
