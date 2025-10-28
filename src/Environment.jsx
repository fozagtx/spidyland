import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WebBackground() {
  const meshRef = useRef();
  const timeRef = useRef(0);

  const webGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];
    
    const centerX = 0;
    const centerY = 2;
    const centerZ = -5;
    
    const numSpokes = 24;
    const numRings = 12;
    const maxRadius = 8;
    
    let vertexIndex = 0;
    const vertexMap = new Map();
    
    for (let ring = 0; ring <= numRings; ring++) {
      const radius = (ring / numRings) * maxRadius;
      
      for (let spoke = 0; spoke < numSpokes; spoke++) {
        const angle = (spoke / numSpokes) * Math.PI * 2;
        const jitter = ring > 0 ? (Math.random() - 0.5) * 0.3 : 0;
        
        const x = centerX + Math.cos(angle) * radius + jitter;
        const y = centerY + Math.sin(angle) * radius + jitter;
        const z = centerZ + (Math.random() - 0.5) * 0.5;
        
        positions.push(x, y, z);
        vertexMap.set(`${ring}-${spoke}`, vertexIndex++);
      }
    }
    
    for (let ring = 0; ring < numRings; ring++) {
      for (let spoke = 0; spoke < numSpokes; spoke++) {
        const current = vertexMap.get(`${ring}-${spoke}`);
        const next = vertexMap.get(`${ring + 1}-${spoke}`);
        
        if (current !== undefined && next !== undefined) {
          indices.push(current, next);
        }
      }
    }
    
    for (let ring = 0; ring <= numRings; ring++) {
      for (let spoke = 0; spoke < numSpokes; spoke++) {
        const current = vertexMap.get(`${ring}-${spoke}`);
        const nextSpoke = (spoke + 1) % numSpokes;
        const next = vertexMap.get(`${ring}-${nextSpoke}`);
        
        if (current !== undefined && next !== undefined) {
          indices.push(current, next);
        }
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    
    return geometry;
  }, []);

  const webMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.4 },
      },
      vertexShader: `
        uniform float time;
        varying float vDistance;
        
        void main() {
          vec3 pos = position;
          float dist = length(pos.xy - vec2(0.0, 2.0));
          vDistance = dist;
          
          float wave = sin(time * 2.0 + dist * 0.5) * 0.05;
          pos.z += wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float opacity;
        varying float vDistance;
        
        void main() {
          float alpha = opacity * (1.0 - vDistance / 8.0) * 0.4;
          vec3 color = vec3(0.95, 0.97, 1.0);
          float shimmer = 0.8 + 0.2 * sin(vDistance * 3.0);
          gl_FragColor = vec4(color * shimmer, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame(() => {
    timeRef.current += 0.016;
    if (webMaterial.uniforms) {
      webMaterial.uniforms.time.value = timeRef.current;
    }
  });

  return (
    <lineSegments ref={meshRef} geometry={webGeometry} material={webMaterial} />
  );
}

export function MistyAtmosphere() {
  const mistRef = useRef();
  const timeRef = useRef(0);

  const mistParticles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const scales = [];
    
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 20 - 3;
      
      positions.push(x, y, z);
      scales.push(Math.random() * 2 + 0.5);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.Float32BufferAttribute(scales, 1));
    
    return geometry;
  }, []);

  const mistMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0.85, 0.92, 0.98) },
      },
      vertexShader: `
        attribute float scale;
        uniform float time;
        varying float vScale;
        
        void main() {
          vScale = scale;
          vec3 pos = position;
          
          pos.x += sin(time * 0.3 + position.y * 0.1) * 0.5;
          pos.z += cos(time * 0.2 + position.x * 0.1) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = scale * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vScale;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - dist * 2.0) * 0.15 * vScale;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, []);

  useFrame(() => {
    timeRef.current += 0.016;
    if (mistMaterial.uniforms) {
      mistMaterial.uniforms.time.value = timeRef.current;
    }
  });

  return (
    <points ref={mistRef} geometry={mistParticles} material={mistMaterial} />
  );
}

export function AmbientParticles() {
  const particlesRef = useRef();
  const timeRef = useRef(0);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const scales = [];
    
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = Math.random() * 10 - 2;
      const z = (Math.random() - 0.5) * 15;
      
      positions.push(x, y, z);
      
      const color = new THREE.Color();
      if (Math.random() > 0.5) {
        color.setHSL(0.55, 0.3, 0.85);
      } else {
        color.setHSL(0.6, 0.2, 0.9);
      }
      colors.push(color.r, color.g, color.b);
      
      scales.push(Math.random() * 0.5 + 0.2);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.Float32BufferAttribute(scales, 1));
    
    return geometry;
  }, []);

  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float scale;
        attribute vec3 color;
        uniform float time;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          pos.y += sin(time * 0.5 + position.x * 0.3) * 0.3;
          pos.x += cos(time * 0.3 + position.z * 0.2) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = scale * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - dist * 2.0) * 0.8;
          float glow = pow(1.0 - dist * 2.0, 3.0);
          
          gl_FragColor = vec4(vColor + vec3(glow * 0.3), alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
  }, []);

  useFrame(() => {
    timeRef.current += 0.016;
    if (particleMaterial.uniforms) {
      particleMaterial.uniforms.time.value = timeRef.current;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
  );
}

export function VolumetricLight({ position = [0, 5, 0], color = '#ff6600' }) {
  const lightRef = useRef();
  const timeRef = useRef(0);

  useFrame(() => {
    timeRef.current += 0.016;
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(timeRef.current * 2) * 0.3;
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={position}
        color={color}
        intensity={1.5}
        distance={15}
        decay={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-bias={-0.001}
      />
      <mesh position={position}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </>
  );
}

export function HDRILighting() {
  const lightProbeRef = useRef();

  return (
    <>
      <ambientLight intensity={0.6} color="#f0f8ff" />
      
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#fffef8"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
        shadow-radius={4}
      />
      
      <directionalLight
        position={[-5, 8, -5]}
        intensity={0.8}
        color="#d0e8ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-radius={3}
      />
      
      <hemisphereLight
        skyColor="#e8f4f8"
        groundColor="#d0e0e8"
        intensity={0.7}
      />
      
      <pointLight position={[4, 4, 3]} color="#ffffff" intensity={0.8} distance={15} />
      <pointLight position={[-3, 5, 2]} color="#f0f8ff" intensity={0.6} distance={15} />
      <pointLight position={[2, 6, -4]} color="#e8f0ff" intensity={0.5} distance={15} />
    </>
  );
}
