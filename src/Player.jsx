import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from './SoundManager';

export function Player({ position, onPositionChange, targetPosition, keysPressed, velocity }) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const timeRef = useRef(0);
  const lastFootstepRef = useRef(0);
  const lastPositionRef = useRef(new THREE.Vector3(position[0], position[1], position[2]));

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (groupRef.current) {
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];

      // Calculate movement direction for rotation
      const currentPos = new THREE.Vector3(position[0], 0, position[2]);
      const movement = currentPos.clone().sub(lastPositionRef.current);
      
      if (movement.length() > 0.01) {
        const angle = Math.atan2(movement.x, movement.z);
        // Smoothly interpolate rotation
        const targetRotation = angle;
        const currentRotation = groupRef.current.rotation.y;
        const rotationDiff = targetRotation - currentRotation;
        
        // Normalize rotation difference to [-PI, PI]
        let normalizedDiff = rotationDiff % (Math.PI * 2);
        if (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
        if (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
        
        groupRef.current.rotation.y += normalizedDiff * 0.15;
      }
      
      lastPositionRef.current.set(position[0], position[1], position[2]);

      // Check if player is actually moving based on velocity
      const isMoving = velocity && (Math.abs(velocity.x) > 0.01 || Math.abs(velocity.z) > 0.01);

      if (isMoving && timeRef.current - lastFootstepRef.current > 0.3) {
        soundManager.playFootstep();
        lastFootstepRef.current = timeRef.current;
      }
    }

    if (bodyRef.current) {
      const speed = velocity ? Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z) : 0;
      const bobSpeed = 8 + speed * 5;
      const bobAmount = 0.05 + speed * 0.05;
      
      bodyRef.current.rotation.x = Math.sin(timeRef.current * bobSpeed) * bobAmount;
      bodyRef.current.position.y = Math.abs(Math.sin(timeRef.current * bobSpeed)) * (0.1 + speed * 0.1);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={bodyRef} castShadow receiveShadow>
        <capsuleGeometry args={[0.3, 0.8, 16, 32]} />
        <meshStandardMaterial
          color="#3498db"
          roughness={0.3}
          metalness={0.6}
          emissive="#2980b9"
          emissiveIntensity={0.6}
        />
      </mesh>

      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#f39c12"
          roughness={0.4}
          metalness={0.3}
          emissive="#e67e22"
          emissiveIntensity={0.45}
        />
      </mesh>

      <mesh position={[0.15, 0.85, 0.25]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-0.15, 0.85, 0.25]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.2} metalness={0.8} />
      </mesh>

      <mesh position={[0, 0.9, 0.3]} castShadow>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.5} metalness={0.2} />
      </mesh>

      <group position={[0, -0.6, 0]}>
        <mesh position={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.6, 16]} />
          <meshStandardMaterial color="#34495e" roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[-0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.6, 16]} />
          <meshStandardMaterial color="#34495e" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>

      <pointLight position={[0, 1, 0]} intensity={2.5} distance={8} color="#3498db" />
    </group>
  );
}
