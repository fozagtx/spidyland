import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { soundManager } from './SoundManager';
import { RealisticSpider } from './RealisticSpider';
import { loadGLTF, cloneGLTFScene, applyMeshDefaults } from './utils/glbLoader';

function GLBSpiderModel({ position, playerPosition, speed, modelPath }) {
  const groupRef = useRef();
  const currentPosRef = useRef(position);
  const timeRef = useRef(0);
  const lastSoundRef = useRef(0);
  const [loadError, setLoadError] = useState(false);
  const [modelScene, setModelScene] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setModelScene(null);
    setLoadError(false);

    loadGLTF(modelPath)
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
          console.error('Failed to prepare spider GLB model:', cloneError);
          setModelScene(null);
          setLoadError(true);
        }
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load spider GLB model:', error);
        setModelScene(null);
        setLoadError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [modelPath]);

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (playerPosition && groupRef.current) {
      const dx = playerPosition[0] - currentPosRef.current[0];
      const dz = playerPosition[2] - currentPosRef.current[2];
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > 1) {
        const moveX = (dx / distance) * speed;
        const moveZ = (dz / distance) * speed;
        currentPosRef.current[0] += moveX;
        currentPosRef.current[2] += moveZ;

        groupRef.current.position.x = currentPosRef.current[0];
        groupRef.current.position.z = currentPosRef.current[2];

        const targetRotation = Math.atan2(dx, dz);
        groupRef.current.rotation.y = targetRotation;

        if (timeRef.current - lastSoundRef.current > 0.4) {
          soundManager.playSpiderScuttle();
          lastSoundRef.current = timeRef.current;
        }

        if (distance < 3) {
          soundManager.playChase();
        }
      }
    }

    if (modelScene && groupRef.current) {
      groupRef.current.position.y = Math.sin(timeRef.current * 2) * 0.05;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 1.2) * 0.03;
    }
  });

  if (loadError || !modelScene) {
    return (
      <RealisticSpider 
        position={position}
        playerPosition={playerPosition}
        speed={speed}
      />
    );
  }

  return (
    <group ref={groupRef} position={currentPosRef.current}>
      <primitive object={modelScene} scale={[0.5, 0.5, 0.5]} />
      <pointLight position={[0, 0.5, 0]} intensity={0.5} distance={3} color="#ff6600" />
    </group>
  );
}

export function GLBSpider({ position, playerPosition, speed = 0.02, modelPath = '/spider.glb' }) {
  return (
    <GLBSpiderModel
      position={position}
      playerPosition={playerPosition}
      speed={speed}
      modelPath={modelPath}
    />
  );
}
