import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator';
import { soundManager } from './SoundManager';

export function ChasingSpider({ position, playerPosition, speed = 0.02 }) {
  const groupRef = useRef();
  const legsRef = useRef([]);
  const bodyRef = useRef();
  const abdomenRef = useRef();
  const timeRef = useRef(0);
  const currentPosRef = useRef(position);
  const lastSoundRef = useRef(0);

  const textures = useMemo(() => {
    return {
      albedo: TextureGenerator.createAlbedoMap(2048),
      normal: TextureGenerator.createNormalMap(2048),
      roughness: TextureGenerator.createRoughnessMap(2048),
      ao: TextureGenerator.createAOMap(2048),
      displacement: TextureGenerator.createDisplacementMap(2048),
    };
  }, []);

  const bodyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: textures.albedo,
      normalMap: textures.normal,
      normalScale: new THREE.Vector2(2.0, 2.0),
      roughnessMap: textures.roughness,
      roughness: 0.3,
      metalness: 0.3,
      aoMap: textures.ao,
      aoMapIntensity: 2.0,
      displacementMap: textures.displacement,
      displacementScale: 0.08,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
      transmission: 0.05,
      thickness: 0.5,
      ior: 1.5,
      sheen: 0.7,
      sheenRoughness: 0.7,
      sheenColor: new THREE.Color(0.9, 0.1, 0.1),
      envMapIntensity: 1.5,
    });
  }, [textures]);

  const legMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: textures.albedo,
      normalMap: textures.normal,
      normalScale: new THREE.Vector2(1.5, 1.5),
      roughnessMap: textures.roughness,
      roughness: 0.4,
      metalness: 0.2,
      aoMap: textures.ao,
      aoMapIntensity: 1.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      transmission: 0.1,
      thickness: 0.3,
      ior: 1.5,
      sheen: 0.4,
      sheenRoughness: 0.8,
      sheenColor: new THREE.Color(0.7, 0.1, 0.1),
      envMapIntensity: 1.2,
    });
  }, [textures]);

  const hairsMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.2, 0.2, 0.25),
      roughness: 0.6,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      clearcoat: 0.2,
      transmission: 0.05,
    });
  }, []);

  const createLegSegment = (length, radius) => {
    const geometry = new THREE.CylinderGeometry(radius, radius * 0.6, length, 24, 12);
    geometry.translate(0, length / 2, 0);
    
    const uvs = geometry.attributes.uv.array;
    for (let i = 0; i < uvs.length; i += 2) {
      uvs[i] *= 2;
      uvs[i + 1] *= 3;
    }
    geometry.attributes.uv.needsUpdate = true;
    
    return geometry;
  };

  const createLeg = (index, side) => {
    const legGroup = new THREE.Group();
    const angle = (index / 4) * Math.PI * 0.5 + Math.PI * 0.25;
    const sideMultiplier = side === 'left' ? -1 : 1;

    const segment1 = new THREE.Mesh(createLegSegment(0.6, 0.1), legMaterial);
    segment1.castShadow = true;
    segment1.receiveShadow = true;
    legGroup.add(segment1);

    const joint1 = new THREE.Group();
    joint1.position.set(0, 0.6, 0);
    segment1.add(joint1);

    const segment2 = new THREE.Mesh(createLegSegment(0.8, 0.08), legMaterial);
    segment2.castShadow = true;
    segment2.receiveShadow = true;
    joint1.add(segment2);

    const joint2 = new THREE.Group();
    joint2.position.set(0, 0.8, 0);
    segment2.add(joint2);

    const segment3 = new THREE.Mesh(createLegSegment(1.0, 0.06), legMaterial);
    segment3.castShadow = true;
    segment3.receiveShadow = true;
    joint2.add(segment3);

    const joint3 = new THREE.Group();
    joint3.position.set(0, 1.0, 0);
    segment3.add(joint3);

    const segment4 = new THREE.Mesh(createLegSegment(0.5, 0.04), legMaterial);
    segment4.castShadow = true;
    segment4.receiveShadow = true;
    joint3.add(segment4);

    legGroup.position.set(
      Math.cos(angle) * 0.5 * sideMultiplier,
      -0.1,
      Math.sin(angle) * 0.5
    );
    
    legGroup.rotation.set(
      -Math.PI * 0.2,
      angle * sideMultiplier,
      sideMultiplier * Math.PI * 0.15
    );

    return { group: legGroup, joints: [segment1, joint1, joint2, joint3] };
  };

  const createHairs = (count = 1200) => {
    const hairsGroup = new THREE.Group();
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      
      const radius = 0.4 + Math.random() * 0.08;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      const hairLength = 0.12 + Math.random() * 0.15;
      const hairGeometry = new THREE.CylinderGeometry(0.006, 0.002, hairLength, 4);
      hairGeometry.translate(0, hairLength / 2, 0);
      
      const hair = new THREE.Mesh(hairGeometry, hairsMaterial);
      hair.position.set(x, y, z);
      hair.lookAt(x * 2, y * 2, z * 2);
      hair.castShadow = true;
      
      hairsGroup.add(hair);
    }
    
    return hairsGroup;
  };

  const legs = useMemo(() => {
    const allLegs = [];
    for (let i = 0; i < 4; i++) {
      allLegs.push(createLeg(i, 'left'));
      allLegs.push(createLeg(i, 'right'));
    }
    return allLegs;
  }, [legMaterial]);

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

    if (bodyRef.current) {
      bodyRef.current.rotation.x = Math.sin(timeRef.current * 1.2) * 0.03;
      bodyRef.current.rotation.z = Math.cos(timeRef.current * 0.8) * 0.03;
    }

    if (abdomenRef.current) {
      abdomenRef.current.rotation.x = Math.sin(timeRef.current * 1.5) * 0.04;
      abdomenRef.current.position.z = -0.8 + Math.sin(timeRef.current * 0.9) * 0.06;
    }

    legs.forEach((leg, index) => {
      const { joints } = leg;
      const phase = (index / 8) * Math.PI * 2;
      const wave = timeRef.current * 2.5;
      
      if (joints[0]) {
        joints[0].rotation.z = Math.sin(wave + phase) * 0.2;
      }
      if (joints[1]) {
        joints[1].rotation.z = Math.sin(wave + phase + 0.5) * 0.25;
      }
      if (joints[2]) {
        joints[2].rotation.z = Math.sin(wave + phase + 1.0) * 0.3;
      }
      if (joints[3]) {
        joints[3].rotation.z = Math.sin(wave + phase + 1.5) * 0.2;
      }
    });
  });

  const bodyGeometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.4, 64, 64);
    const uvs = geom.attributes.uv.array;
    for (let i = 0; i < uvs.length; i += 2) {
      uvs[i] *= 2;
      uvs[i + 1] *= 2;
    }
    geom.attributes.uv.needsUpdate = true;
    return geom;
  }, []);

  const abdomenGeometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.6, 64, 64);
    geom.scale(1, 0.85, 1.5);
    const uvs = geom.attributes.uv.array;
    for (let i = 0; i < uvs.length; i += 2) {
      uvs[i] *= 2;
      uvs[i + 1] *= 2;
    }
    geom.attributes.uv.needsUpdate = true;
    return geom;
  }, []);

  const hairs = useMemo(() => createHairs(1200), [hairsMaterial]);

  return (
    <group ref={groupRef} position={currentPosRef.current}>
      {legs.map((leg, index) => (
        <primitive key={index} object={leg.group} />
      ))}

      <mesh ref={bodyRef} geometry={bodyGeometry} material={bodyMaterial} castShadow receiveShadow>
        <primitive object={hairs} />
      </mesh>

      <mesh ref={abdomenRef} position={[0, 0, -0.8]} geometry={abdomenGeometry} material={bodyMaterial} castShadow receiveShadow>
        <primitive object={createHairs(900)} />
      </mesh>

      <group position={[0, 0.08, 0.35]}>
        <mesh position={[0.2, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.075, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.05, 0.05, 0.1)}
            metalness={1.0}
            roughness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            envMapIntensity={2.5}
            emissive={new THREE.Color(0.8, 0.1, 0.1)}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.2, 0.08, 0]} scale={[0.7, 0.7, 0.7]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.8, 0.1, 0.1)}
            metalness={0.0}
            roughness={0.0}
            transmission={0.95}
            thickness={1.2}
            ior={1.6}
            clearcoat={1.0}
            emissive={new THREE.Color(0.9, 0.1, 0.1)}
            emissiveIntensity={1.0}
          />
        </mesh>

        <mesh position={[-0.2, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.075, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.05, 0.05, 0.1)}
            metalness={1.0}
            roughness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            envMapIntensity={2.5}
            emissive={new THREE.Color(0.8, 0.1, 0.1)}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.2, 0.08, 0]} scale={[0.7, 0.7, 0.7]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.8, 0.1, 0.1)}
            metalness={0.0}
            roughness={0.0}
            transmission={0.95}
            thickness={1.2}
            ior={1.6}
            clearcoat={1.0}
            emissive={new THREE.Color(0.9, 0.1, 0.1)}
            emissiveIntensity={1.0}
          />
        </mesh>

        <mesh position={[0.12, 0.05, 0.05]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.05, 0.05, 0.1)}
            metalness={0.9}
            roughness={0.1}
            emissive={new THREE.Color(0.6, 0.1, 0.1)}
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[-0.12, 0.05, 0.05]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.05, 0.05, 0.1)}
            metalness={0.9}
            roughness={0.1}
            emissive={new THREE.Color(0.6, 0.1, 0.1)}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      <group position={[0, -0.12, 0.45]} rotation={[Math.PI * 0.15, 0, 0]}>
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, -Math.PI * 0.12]} castShadow>
          <cylinderGeometry args={[0.025, 0.008, 0.2, 12]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.15, 0.15, 0.18)}
            metalness={0.4}
            roughness={0.3}
            clearcoat={0.6}
            envMapIntensity={1.2}
          />
        </mesh>
        <mesh position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI * 0.12]} castShadow>
          <cylinderGeometry args={[0.025, 0.008, 0.2, 12]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.15, 0.15, 0.18)}
            metalness={0.4}
            roughness={0.3}
            clearcoat={0.6}
            envMapIntensity={1.2}
          />
        </mesh>
      </group>

      <pointLight position={[0, 0.2, 0]} intensity={0.5} distance={3} color="#ff2020" />
    </group>
  );
}
