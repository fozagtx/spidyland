import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
const gltfCache = new Map();
const loadingPromises = new Map();

export function loadGLTF(url) {
  if (!url) {
    return Promise.reject(new Error('A valid URL is required to load a GLTF model.'));
  }

  if (gltfCache.has(url)) {
    return Promise.resolve(gltfCache.get(url));
  }

  if (!loadingPromises.has(url)) {
    const promise = new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          gltfCache.set(url, gltf);
          loadingPromises.delete(url);
          resolve(gltf);
        },
        undefined,
        (error) => {
          loadingPromises.delete(url);
          reject(error);
        }
      );
    });

    loadingPromises.set(url, promise);
  }

  return loadingPromises.get(url);
}

export function cloneGLTFScene(gltf) {
  const sourceScene = gltf?.scene ?? gltf;

  if (!sourceScene) {
    throw new Error('Cannot clone GLTF scene – the provided GLTF does not contain a scene.');
  }

  return clone(sourceScene);
}

export function applyMeshDefaults(
  scene,
  { castShadow = true, receiveShadow = true, materialNeedsUpdate = true } = {}
) {
  if (!scene) {
    return;
  }

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;

      if (materialNeedsUpdate && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            if (material) {
              material.needsUpdate = true;
            }
          });
        } else {
          child.material.needsUpdate = true;
        }
      }
    }
  });
}
