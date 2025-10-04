import * as THREE from "three";
import React from "react";

const defaultSunDirection = new THREE.Vector3(-2, 0.5, 1.5).normalize();

function getEarthMat(sunDirection = defaultSunDirection) {
  const earthTexture = new THREE.TextureLoader().load(
    "./textures/earth-daymap-4k.jpg",
  );
  const cloudsMap = new THREE.TextureLoader().load(
    "./textures/earth-clouds-4k.jpg",
  );

  const uniforms = {
    earthTexture: { value: earthTexture },
    cloudsTexture: { value: cloudsMap },
    sunDirection: { value: sunDirection },
  };

  const vs = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * modelPosition;

      vUv = uv;
      vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
      vPosition = modelPosition.xyz;
    }
  `;

  const fs = `
  uniform sampler2D earthTexture;
  uniform sampler2D cloudsTexture;
  uniform vec3 sunDirection;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);

    // Base Earth texture
    vec3 color = texture(earthTexture, vUv).rgb;

    // Clouds
    float cloudsMix = texture(cloudsTexture, vUv).g;
    color = mix(color, vec3(1.0), cloudsMix * 0.5);

    // Simple lighting with reduced brightness
    float lightIntensity = max(dot(normal, sunDirection), 0.0) * 0.5; // Reduce brightness by 50%
    color *= lightIntensity;

    gl_FragColor = vec4(color, 1.0);
  }
`;

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
  });
  return material;
}

function EarthMaterial({ sunDirection }) {
  const material = React.useMemo(() => getEarthMat(sunDirection), []);
  return <primitive object={material} />;
}

export default EarthMaterial;
