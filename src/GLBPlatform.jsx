import React, { useEffect, useState } from 'react';
import { loadGLTF, cloneGLTFScene, applyMeshDefaults } from './utils/glbLoader';

export function GLBPlatform({ position = [0, -2, 0], modelPath = '/spider.glb' }) {
  const [modelScene, setModelScene] = useState(null);
  const [loadError, setLoadError] = useState(false);

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
          const scene = cloneGLTFScene(gltf);
          applyMeshDefaults(scene, { castShadow: false, receiveShadow: true });
          setModelScene(scene);
          setLoadError(false);
        } catch (cloneError) {
          console.warn('Failed to prepare platform model:', cloneError);
          setModelScene(null);
          setLoadError(true);
        }
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        console.warn('Failed to load platform model:', error);
        setModelScene(null);
        setLoadError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [modelPath]);

  if (loadError || !modelScene) {
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
