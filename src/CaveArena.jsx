import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CaveArena() {
  const floorRef = useRef();

  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1024);
    gradient.addColorStop(0, '#2a1a1a');
    gradient.addColorStop(0.7, '#1a1010');
    gradient.addColorStop(1, '#0a0505');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 2048);
    
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = Math.random() * 30 + 10;
      const opacity = Math.random() * 0.2;
      
      ctx.fillStyle = `rgba(80, 50, 40, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 100; i++) {
      ctx.strokeStyle = `rgba(120, 100, 80, ${Math.random() * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 2048, Math.random() * 2048);
      ctx.lineTo(Math.random() * 2048, Math.random() * 2048);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);

  return (
    <group>
      <mesh ref={floorRef} receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.5, 0]}>
        <circleGeometry args={[28, 64]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#1a0f0f"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 26;
        return (
          <group key={i}>
            <mesh
              position={[Math.cos(angle) * radius, 3, Math.sin(angle) * radius]}
              rotation-y={-angle}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[4, 8, 2]} />
              <meshStandardMaterial
                color="#3a2a1a"
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>

            <mesh
              position={[Math.cos(angle) * radius, 7, Math.sin(angle) * radius]}
              rotation-y={-angle}
            >
              <coneGeometry args={[2.5, 1.5, 4]} />
              <meshStandardMaterial
                color="#2a1a0a"
                roughness={0.9}
              />
            </mesh>
          </group>
        );
      })}

      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.3;
        const radius = 15 + Math.random() * 5;
        const height = 2 + Math.random() * 3;
        return (
          <mesh
            key={`rock-${i}`}
            position={[Math.cos(angle) * radius, height / 2 - 0.5, Math.sin(angle) * radius]}
            rotation={[Math.random() * 0.5, Math.random() * Math.PI * 2, Math.random() * 0.5]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[height * 0.8, 0]} />
            <meshStandardMaterial
              color="#4a3a2a"
              roughness={0.95}
              metalness={0.05}
            />
          </mesh>
        );
      })}

      <mesh position={[0, 12, 0]} receiveShadow>
        <cylinderGeometry args={[28, 28, 0.5, 64]} />
        <meshStandardMaterial
          color="#0a0505"
          roughness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function ExitPortal({ position, active = false }) {
  const groupRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    
    if (groupRef.current && active) {
      groupRef.current.rotation.y += delta * 2;
      groupRef.current.scale.setScalar(1 + Math.sin(timeRef.current * 3) * 0.1);
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <torusGeometry args={[2, 0.3, 16, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial
          color="#00ccff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight 
        position={[0, 0, 0]} 
        intensity={5} 
        distance={15} 
        color="#00ffff" 
      />

      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2 + timeRef.current * 2) * 2.5,
            0,
            Math.sin((i / 5) * Math.PI * 2 + timeRef.current * 2) * 2.5
          ]}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      ))}
    </group>
  );
}
