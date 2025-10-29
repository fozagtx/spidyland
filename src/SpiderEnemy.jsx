import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { soundManager } from './SoundManager';

export function SpiderEnemy({ 
  position, 
  playerPosition, 
  onAttack, 
  isTrapped = false,
  onLayWeb,
  patrolPoints = []
}) {
  const groupRef = useRef();
  const currentPosRef = useRef(position);
  const timeRef = useRef(0);
  const lastSoundRef = useRef(0);
  const lastWebLayRef = useRef(0);
  const [currentPatrolIndex, setCurrentPatrolIndex] = useState(0);
  const [mode, setMode] = useState('patrol');

  const { scene: modelScene } = useGLTF('/spider.glb');

  useEffect(() => {
    if (modelScene) {
      modelScene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [modelScene]);

  useFrame((state, delta) => {
    if (isTrapped) {
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 5;
      }
      return;
    }

    timeRef.current += delta;

    if (playerPosition && groupRef.current) {
      const dx = playerPosition[0] - currentPosRef.current[0];
      const dz = playerPosition[2] - currentPosRef.current[2];
      const distanceToPlayer = Math.sqrt(dx * dx + dz * dz);

      if (distanceToPlayer < 10) {
        setMode('chase');
      } else {
        setMode('patrol');
      }

      let targetX, targetZ;

      if (mode === 'chase') {
        targetX = playerPosition[0];
        targetZ = playerPosition[2];
      } else {
        if (patrolPoints.length > 0) {
          const targetPatrol = patrolPoints[currentPatrolIndex];
          targetX = targetPatrol[0];
          targetZ = targetPatrol[2];

          const distToPatrol = Math.sqrt(
            Math.pow(targetX - currentPosRef.current[0], 2) +
            Math.pow(targetZ - currentPosRef.current[2], 2)
          );

          if (distToPatrol < 1) {
            setCurrentPatrolIndex((currentPatrolIndex + 1) % patrolPoints.length);
          }
        } else {
          targetX = currentPosRef.current[0];
          targetZ = currentPosRef.current[2];
        }
      }

      const moveX = targetX - currentPosRef.current[0];
      const moveZ = targetZ - currentPosRef.current[2];
      const distance = Math.sqrt(moveX * moveX + moveZ * moveZ);

      if (distance > 0.5) {
        const speed = mode === 'chase' ? 0.04 : 0.02;
        const normX = (moveX / distance) * speed;
        const normZ = (moveZ / distance) * speed;
        currentPosRef.current[0] += normX;
        currentPosRef.current[2] += normZ;

        groupRef.current.position.x = currentPosRef.current[0];
        groupRef.current.position.z = currentPosRef.current[2];

        const targetRotation = Math.atan2(moveX, moveZ);
        groupRef.current.rotation.y = targetRotation;

        if (timeRef.current - lastSoundRef.current > 0.5) {
          soundManager.playSpiderScuttle();
          lastSoundRef.current = timeRef.current;
        }

        if (distanceToPlayer < 2 && onAttack) {
          onAttack();
        }

        if (mode === 'chase' && timeRef.current - lastWebLayRef.current > 5 && onLayWeb) {
          onLayWeb([currentPosRef.current[0], 0, currentPosRef.current[2]]);
          lastWebLayRef.current = timeRef.current;
        }
      }
    }

    if (modelScene && groupRef.current) {
      groupRef.current.position.y = Math.sin(timeRef.current * 3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={currentPosRef.current}>
      <primitive object={modelScene.clone()} scale={[1.2, 1.2, 1.2]} />
      <pointLight 
        position={[0, 0.5, 0]} 
        intensity={mode === 'chase' ? 1.5 : 0.5} 
        distance={5} 
        color={mode === 'chase' ? "#ff0000" : "#ff6600"} 
      />
    </group>
  );
}
