import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GlowingOrb({ position, collected = false }) {
  const groupRef = useRef();
  const orbRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (collected) return;
    
    timeRef.current += delta;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 2;
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 2) * 0.3;
    }

    if (orbRef.current) {
      orbRef.current.rotation.x += delta * 3;
      orbRef.current.rotation.z += delta * 2;
    }
  });

  if (collected) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={orbRef} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#ffff00"
          emissive="#ffff00"
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#ffff00"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight 
        position={[0, 0, 0]} 
        intensity={3} 
        distance={8} 
        color="#ffff00" 
      />

      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.8,
            0,
            Math.sin((i / 4) * Math.PI * 2) * 0.8
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#ffdd00"
            emissive="#ffdd00"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
}
