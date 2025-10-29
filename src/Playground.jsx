import React, { useMemo } from 'react';
import * as THREE from 'three';

export function Playground() {
  const platformGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const size = 50;
    const radius = 5;
    
    shape.moveTo(-size + radius, -size);
    shape.lineTo(size - radius, -size);
    shape.quadraticCurveTo(size, -size, size, -size + radius);
    shape.lineTo(size, size - radius);
    shape.quadraticCurveTo(size, size, size - radius, size);
    shape.lineTo(-size + radius, size);
    shape.quadraticCurveTo(-size, size, -size, size - radius);
    shape.lineTo(-size, -size + radius);
    shape.quadraticCurveTo(-size, -size, -size + radius, -size);
    
    const extrudeSettings = {
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.5,
      bevelSegments: 5
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const platformMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
    gradient.addColorStop(0, '#2a1a4a');
    gradient.addColorStop(0.5, '#1a1030');
    gradient.addColorStop(1, '#0a0515');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);
    
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 60 + 10;
      const opacity = Math.random() * 0.2;
      
      ctx.fillStyle = `rgba(120, 80, 180, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 100; i++) {
      ctx.strokeStyle = `rgba(150, 100, 200, ${Math.random() * 0.15})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
      ctx.lineTo(Math.random() * 1024, Math.random() * 1024);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
    ctx.lineWidth = 5;
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 30 + 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    
    return new THREE.MeshStandardMaterial({
      map: texture,
      color: '#2a1a4a',
      roughness: 0.7,
      metalness: 0.3,
      envMapIntensity: 0.5,
    });
  }, []);

  const obstacles = useMemo(() => {
    const items = [];
    for (let i = 0; i < 20; i++) {
      const type = Math.random();
      const x = (Math.random() - 0.5) * 45;
      const z = (Math.random() - 0.5) * 45;
      const height = Math.random() * 4 + 2;
      
      if (type < 0.3) {
        items.push({
          type: 'cylinder',
          position: [x, height / 2, z],
          args: [0.5 + Math.random(), 0.5 + Math.random(), height, 16],
          color: new THREE.Color().setHSL(0.1 + Math.random() * 0.1, 0.7, 0.3),
        });
      } else if (type < 0.6) {
        items.push({
          type: 'box',
          position: [x, height / 2, z],
          args: [1 + Math.random() * 2, height, 1 + Math.random() * 2],
          color: new THREE.Color().setHSL(0.1 + Math.random() * 0.1, 0.6, 0.35),
        });
      } else {
        items.push({
          type: 'cone',
          position: [x, height / 2, z],
          args: [0.8 + Math.random(), height, 8],
          color: new THREE.Color().setHSL(0.08 + Math.random() * 0.12, 0.65, 0.32),
        });
      }
    }
    return items;
  }, []);

  const platformLights = useMemo(() => {
    const lights = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 35;
      lights.push({
        position: [Math.cos(angle) * radius, 3, Math.sin(angle) * radius],
        color: i % 2 === 0 ? '#ff6600' : '#ff0066',
      });
    }
    return lights;
  }, []);

  return (
    <group position={[0, -3, 0]}>
      <mesh geometry={platformGeometry} material={platformMaterial} receiveShadow rotation-x={-Math.PI / 2}>
        <meshStandardMaterial 
          color="#2a1a4a"
          roughness={0.7}
          metalness={0.3}
          emissive="#1a0a2a"
          emissiveIntensity={0.2}
        />
      </mesh>

      <group>
        {obstacles.map((obs, i) => {
          let geometry;
          if (obs.type === 'cylinder') {
            geometry = <cylinderGeometry args={obs.args} />;
          } else if (obs.type === 'box') {
            geometry = <boxGeometry args={obs.args} />;
          } else {
            geometry = <coneGeometry args={obs.args} />;
          }
          
          return (
            <mesh key={i} position={obs.position} castShadow receiveShadow>
              {geometry}
              <meshStandardMaterial
                color={obs.color}
                roughness={0.6}
                metalness={0.4}
                emissive={obs.color}
                emissiveIntensity={0.15}
              />
            </mesh>
          );
        })}
      </group>

      {platformLights.map((light, i) => (
        <pointLight
          key={i}
          position={light.position}
          intensity={0.6}
          distance={15}
          color={light.color}
          castShadow
        />
      ))}

      <mesh position={[0, -1.5, 0]} receiveShadow>
        <cylinderGeometry args={[52, 55, 3, 32]} />
        <meshStandardMaterial
          color="#1a0a2a"
          roughness={0.8}
          metalness={0.2}
          emissive="#0a0515"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh position={[0, 0.1, 45]} castShadow>
        <boxGeometry args={[100, 8, 1]} />
        <meshStandardMaterial
          color="#3a2a5a"
          roughness={0.6}
          metalness={0.4}
          emissive="#1a0a2a"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 0.1, -45]} castShadow>
        <boxGeometry args={[100, 8, 1]} />
        <meshStandardMaterial
          color="#3a2a5a"
          roughness={0.6}
          metalness={0.4}
          emissive="#1a0a2a"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[45, 0.1, 0]} castShadow>
        <boxGeometry args={[1, 8, 100]} />
        <meshStandardMaterial
          color="#3a2a5a"
          roughness={0.6}
          metalness={0.4}
          emissive="#1a0a2a"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-45, 0.1, 0]} castShadow>
        <boxGeometry args={[1, 8, 100]} />
        <meshStandardMaterial
          color="#3a2a5a"
          roughness={0.6}
          metalness={0.4}
          emissive="#1a0a2a"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
