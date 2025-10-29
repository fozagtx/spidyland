import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Totem({ position, activated = false }) {
  const groupRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (groupRef.current && activated) {
      groupRef.current.rotation.y += delta * 3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1.5, 6]} />
        <meshStandardMaterial
          color={activated ? "#00ff00" : "#8B4513"}
          emissive={activated ? "#00ff00" : "#000000"}
          emissiveIntensity={activated ? 1.5 : 0}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      <mesh castShadow position={[0, 1.5, 0]}>
        <coneGeometry args={[0.4, 0.6, 6]} />
        <meshStandardMaterial
          color={activated ? "#00ff88" : "#A0522D"}
          emissive={activated ? "#00ff88" : "#000000"}
          emissiveIntensity={activated ? 2 : 0}
        />
      </mesh>

      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={activated ? "#ffffff" : "#FFD700"}
          emissive={activated ? "#ffffff" : "#FFD700"}
          emissiveIntensity={activated ? 3 : 0.5}
        />
      </mesh>

      {activated && (
        <>
          <pointLight 
            position={[0, 1.8, 0]} 
            intensity={5} 
            distance={15} 
            color="#00ff00" 
          />
          
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 3) * Math.PI * 2 + timeRef.current) * 1.5,
                1 + Math.sin(timeRef.current * 2 + i) * 0.5,
                Math.sin((i / 3) * Math.PI * 2 + timeRef.current) * 1.5
              ]}
            >
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial color="#00ff00" />
            </mesh>
          ))}
        </>
      )}

      {!activated && (
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[0.8, 0.3, 0.1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}
