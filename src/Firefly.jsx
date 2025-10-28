import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Firefly({ position, onCollect, collected, id }) {
  const meshRef = useRef();
  const lightRef = useRef();
  const trailRef = useRef();
  const timeRef = useRef(Math.random() * 100);
  const offsetRef = useRef({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random() * 2 - 1,
  });

  const glowColor = useMemo(() => {
    const hue = Math.random() * 60 + 30;
    return new THREE.Color().setHSL(hue / 360, 1, 0.5);
  }, []);

  useFrame((state, delta) => {
    if (collected || !meshRef.current) return;
    
    timeRef.current += delta;
    const time = timeRef.current;

    const floatX = position[0] + Math.sin(time * 0.5 + offsetRef.current.x) * 2;
    const floatY = position[1] + Math.sin(time * 0.7 + offsetRef.current.y) * 1.5 + 0.5;
    const floatZ = position[2] + Math.cos(time * 0.6 + offsetRef.current.z) * 2;

    meshRef.current.position.set(floatX, floatY, floatZ);

    const pulseIntensity = (Math.sin(time * 3) + 1) * 0.5;
    meshRef.current.scale.setScalar(0.15 + pulseIntensity * 0.05);

    if (lightRef.current) {
      lightRef.current.intensity = 1 + pulseIntensity * 2;
    }

    if (trailRef.current) {
      trailRef.current.rotation.y += delta;
      trailRef.current.material.opacity = 0.3 + pulseIntensity * 0.2;
    }
  });

  if (collected) {
    return null;
  }

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
        
        <pointLight
          ref={lightRef}
          color={glowColor}
          intensity={2}
          distance={8}
          decay={2}
        />

        <mesh ref={trailRef}>
          <ringGeometry args={[0.2, 0.4, 16]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </mesh>
    </group>
  );
}
