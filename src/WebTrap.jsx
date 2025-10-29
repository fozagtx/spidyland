import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WebTrap({ position, collected = false }) {
  const groupRef = useRef();
  const timeRef = useRef(0);

  const webGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];

    const rings = 8;
    const segments = 16;
    
    vertices.push(0, 0.1, 0);
    
    for (let ring = 1; ring <= rings; ring++) {
      const radius = (ring / rings) * 2;
      for (let seg = 0; seg < segments; seg++) {
        const angle = (seg / segments) * Math.PI * 2;
        vertices.push(
          Math.cos(angle) * radius,
          0.1,
          Math.sin(angle) * radius
        );
      }
    }

    for (let seg = 0; seg < segments; seg++) {
      indices.push(0, seg + 1, ((seg + 1) % segments) + 1);
    }

    for (let ring = 0; ring < rings - 1; ring++) {
      for (let seg = 0; seg < segments; seg++) {
        const current = ring * segments + seg + 1;
        const next = ring * segments + ((seg + 1) % segments) + 1;
        const nextRing = (ring + 1) * segments + seg + 1;
        const nextRingNext = (ring + 1) * segments + ((seg + 1) % segments) + 1;

        indices.push(current, nextRing, next);
        indices.push(next, nextRing, nextRingNext);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  useFrame((state, delta) => {
    if (collected) return;
    
    timeRef.current += delta;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  if (collected) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh geometry={webGeometry} receiveShadow>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0.1}
          emissive="#888888"
          emissiveIntensity={0.2}
        />
      </mesh>

      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.5, 0.05, Math.sin(angle) * 1.5]}
          >
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
        );
      })}

      <pointLight 
        position={[0, 0.5, 0]} 
        intensity={0.5} 
        distance={4} 
        color="#aaaaaa" 
      />
    </group>
  );
}
