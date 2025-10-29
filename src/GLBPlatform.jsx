import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

export function GLBPlatform({ position = [0, -2, 0], modelPath = '/spider.glb' }) {
  let modelScene = null;
  
  try {
    const gltf = useGLTF(modelPath, true);
    modelScene = gltf.scene;
  } catch (error) {
    console.warn('Failed to load platform model:', error);
  }

  useEffect(() => {
    if (modelScene) {
      modelScene.traverse((child) => {
        if (child.isMesh) {
          if (child.name.toLowerCase().includes('platform') || 
              child.name.toLowerCase().includes('ground') ||
              child.name.toLowerCase().includes('floor')) {
            child.castShadow = false;
            child.receiveShadow = true;
          }
          
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [modelScene]);

  if (!modelScene) {
    return null;
  }

  const platformObjects = [];
  modelScene.traverse((child) => {
    if (child.isMesh && (
      child.name.toLowerCase().includes('platform') || 
      child.name.toLowerCase().includes('ground') ||
      child.name.toLowerCase().includes('floor')
    )) {
      platformObjects.push(child);
    }
  });

  if (platformObjects.length === 0) {
    return null;
  }

  return (
    <group position={position}>
      {platformObjects.map((obj, index) => (
        <primitive key={index} object={obj.clone()} />
      ))}
    </group>
  );
}
