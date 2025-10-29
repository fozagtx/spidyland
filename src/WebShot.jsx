import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WebShot({ startPosition, direction, onHitFirefly, fireflies, onComplete }) {
  const meshRef = useRef();
  const trailRef = useRef([]);
  const distanceRef = useRef(0);
  const maxDistance = 15;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const speed = 20;
    const movement = speed * delta;
    distanceRef.current += movement;

    meshRef.current.position.x += direction.x * movement;
    meshRef.current.position.y += direction.y * movement;
    meshRef.current.position.z += direction.z * movement;

    const currentPos = meshRef.current.position;
    
    fireflies.forEach((firefly, index) => {
      if (firefly.collected) return;
      
      const dx = currentPos.x - firefly.position[0];
      const dy = currentPos.y - firefly.position[1];
      const dz = currentPos.z - firefly.position[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < 1) {
        onHitFirefly(index);
      }
    });

    if (distanceRef.current > maxDistance) {
      onComplete();
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={startPosition}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#cccccc"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
        
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshStandardMaterial
            color="#eeeeee"
            transparent
            opacity={0.6}
            emissive="#aaaaaa"
            emissiveIntensity={0.5}
          />
        </mesh>
      </mesh>
    </group>
  );
}
