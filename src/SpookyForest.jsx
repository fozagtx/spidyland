import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Tree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#2d1f1a" roughness={0.9} />
      </mesh>
      
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial
          color="#1a1a1a"
          transparent
          opacity={0.8}
          roughness={0.8}
        />
      </mesh>
      
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial
          color="#151515"
          transparent
          opacity={0.7}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

function Tombstone({ position, rotation }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Pumpkin({ position }) {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      const intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
      lightRef.current.intensity = intensity;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="#ff6600"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.2, 8]} />
        <meshStandardMaterial color="#2d5016" roughness={0.8} />
      </mesh>

      <mesh position={[0.15, 0.1, 0.45]}>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ff6600"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-0.15, 0.1, 0.45]}>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ff6600"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0, -0.1, 0.45]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ff6600"
          emissiveIntensity={2}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color="#ff6600"
        intensity={2}
        distance={5}
        position={[0, 0, 0.5]}
      />
    </group>
  );
}

export function SpookyForest() {
  const trees = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 25 + Math.random() * 15;
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ]);
    }
    return positions;
  }, []);

  const tombstones = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 8; i++) {
      positions.push({
        position: [
          (Math.random() - 0.5) * 40,
          0,
          (Math.random() - 0.5) * 40
        ],
        rotation: Math.random() * Math.PI * 2
      });
    }
    return positions;
  }, []);

  const pumpkins = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 15 + Math.random() * 10;
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ]);
    }
    return positions;
  }, []);

  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1024);
    gradient.addColorStop(0, '#1a0f0a');
    gradient.addColorStop(0.5, '#0f0a05');
    gradient.addColorStop(1, '#050301');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 2048);
    
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = Math.random() * 30 + 10;
      const opacity = Math.random() * 0.2;
      
      ctx.fillStyle = `rgba(50, 30, 10, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);

  return (
    <group>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#1a1410"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {trees.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} />
      ))}

      {tombstones.map((tomb, i) => (
        <Tombstone key={`tomb-${i}`} position={tomb.position} rotation={tomb.rotation} />
      ))}

      {pumpkins.map((pos, i) => (
        <Pumpkin key={`pumpkin-${i}`} position={pos} />
      ))}
    </group>
  );
}
