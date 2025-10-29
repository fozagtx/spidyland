import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { loadGLTF, cloneGLTFScene, applyMeshDefaults } from './utils/glbLoader';

export function LabubuPlayer({ position, velocity, lightRadius = 5, isDashing = false }) {
  const groupRef = useRef();
  const timeRef = useRef(0);
  const lastPositionRef = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const [loadError, setLoadError] = useState(false);
  const [modelScene, setModelScene] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setModelScene(null);
    setLoadError(false);

    loadGLTF('/creepy_labubu.glb')
      .then((gltf) => {
        if (!isMounted) {
          return;
        }

        try {
          const preparedScene = cloneGLTFScene(gltf);
          applyMeshDefaults(preparedScene);
          setModelScene(preparedScene);
          setLoadError(false);
        } catch (cloneError) {
          console.error('Failed to prepare Labubu GLB model:', cloneError);
          setModelScene(null);
          setLoadError(true);
        }
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load Labubu GLB model:', error);
        setModelScene(null);
        setLoadError(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (groupRef.current) {
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];

      const currentPos = new THREE.Vector3(position[0], 0, position[2]);
      const movement = currentPos.clone().sub(lastPositionRef.current);
      
      if (movement.length() > 0.01) {
        const angle = Math.atan2(movement.x, movement.z);
        const targetRotation = angle;
        const currentRotation = groupRef.current.rotation.y;
        const rotationDiff = targetRotation - currentRotation;
        
        let normalizedDiff = rotationDiff % (Math.PI * 2);
        if (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
        if (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
        
        groupRef.current.rotation.y += normalizedDiff * 0.15;
      }
      
      lastPositionRef.current.set(position[0], position[1], position[2]);

      const speed = velocity ? Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z) : 0;
      const bobAmount = speed > 0.01 ? 0.1 : 0.05;
      groupRef.current.position.y = Math.abs(Math.sin(timeRef.current * 8)) * bobAmount;

      if (isDashing) {
        groupRef.current.scale.setScalar(1.2 + Math.sin(timeRef.current * 20) * 0.1);
      } else {
        groupRef.current.scale.setScalar(1);
      }
    }
  });

  if (loadError || !modelScene) {
    return (
      <group ref={groupRef} position={position}>
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#ff66cc" 
            emissive="#ff66cc" 
            emissiveIntensity={0.5}
          />
        </mesh>
        <pointLight 
          position={[0, 1, 0]} 
          intensity={1.5} 
          distance={lightRadius} 
          color="#66ccff" 
          castShadow
        />
        {isDashing && (
          <pointLight 
            position={[0, 0.5, 0]} 
            intensity={2} 
            distance={3} 
            color="#ffff00" 
          />
        )}
      </group>
    );
  }

  return (
    <group ref={groupRef} position={position}>
      <primitive object={modelScene} scale={[0.8, 0.8, 0.8]} />
      
      <pointLight 
        position={[0, 1, 0]} 
        intensity={1.5} 
        distance={lightRadius} 
        color="#66ccff" 
        castShadow
      />
      
      {isDashing && (
        <pointLight 
          position={[0, 0.5, 0]} 
          intensity={2} 
          distance={3} 
          color="#ffff00" 
        />
      )}
    </group>
  );
}
