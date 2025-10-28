import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Treasure({ position, collected }) {
  const groupRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (collected) return;
    
    timeRef.current += delta;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = timeRef.current * 2;
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 3) * 0.2;
    }
  });

  if (collected) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 8]} />
        <meshStandardMaterial
          color="#ffd700"
          roughness={0.2}
          metalness={0.9}
          emissive="#ffaa00"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.4, 0.15, 8]} />
        <meshStandardMaterial
          color="#ffed4e"
          roughness={0.1}
          metalness={1.0}
          emissive="#ffcc00"
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial
          color="#b8860b"
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.3,
            0.15 + Math.random() * 0.1,
            Math.sin((i / 5) * Math.PI * 2) * 0.3
          ]}
          castShadow
        >
          <sphereGeometry args={[0.05 + Math.random() * 0.03, 8, 8]} />
          <meshStandardMaterial
            color={['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffff00'][i]}
            roughness={0.1}
            metalness={0.8}
            emissive={['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffff00'][i]}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      <pointLight position={[0, 0.5, 0]} intensity={3} distance={8} color="#ffd700" />

      <mesh position={[0, 0, 0]} scale={[1.5, 0.01, 1.5]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshBasicMaterial
          color="#ffff00"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
