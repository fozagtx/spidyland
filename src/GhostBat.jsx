import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GhostBat({ startPosition, onCollision, playerPosition }) {
  const groupRef = useRef();
  const wingLeftRef = useRef();
  const wingRightRef = useRef();
  const timeRef = useRef(Math.random() * 100);
  const pathRef = useRef({
    startX: startPosition[0],
    startZ: startPosition[2],
    speed: 3 + Math.random() * 2,
    height: 3 + Math.random() * 2,
    direction: Math.random() > 0.5 ? 1 : -1,
  });

  const lastCollisionRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    timeRef.current += delta;
    const time = timeRef.current;
    const path = pathRef.current;

    const x = path.startX + Math.sin(time * 0.5) * 20 * path.direction;
    const y = path.height + Math.sin(time * 2) * 1;
    const z = path.startZ + Math.cos(time * 0.5) * 20;

    groupRef.current.position.set(x, y, z);

    const lookDirection = new THREE.Vector3(
      Math.cos(time * 0.5) * path.direction,
      0,
      -Math.sin(time * 0.5)
    );
    groupRef.current.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      lookDirection.normalize()
    );

    if (wingLeftRef.current) {
      wingLeftRef.current.rotation.z = Math.sin(time * 10) * 0.8;
    }
    if (wingRightRef.current) {
      wingRightRef.current.rotation.z = -Math.sin(time * 10) * 0.8;
    }

    if (playerPosition && time - lastCollisionRef.current > 2) {
      const dx = x - playerPosition[0];
      const dz = z - playerPosition[2];
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 1.5) {
        onCollision();
        lastCollisionRef.current = time;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
          emissive="#9966ff"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0, 0, 0.2]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.7}
          emissive="#9966ff"
          emissiveIntensity={0.6}
        />
      </mesh>

      <mesh position={[0.1, 0.05, 0.3]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[-0.1, 0.05, 0.3]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1}
        />
      </mesh>

      <mesh ref={wingLeftRef} position={[0.3, 0, 0]}>
        <coneGeometry args={[0.5, 0.1, 4]} />
        <meshStandardMaterial
          color="#6633cc"
          transparent
          opacity={0.4}
          emissive="#6633cc"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={wingRightRef} position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.5, 0.1, 4]} />
        <meshStandardMaterial
          color="#6633cc"
          transparent
          opacity={0.4}
          emissive="#6633cc"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color="#9966ff" intensity={1.5} distance={5} />
    </group>
  );
}
