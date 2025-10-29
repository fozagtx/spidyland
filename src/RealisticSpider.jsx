import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from './SoundManager';

export function RealisticSpider({ position, playerPosition, speed = 0.02 }) {
  const groupRef = useRef();
  const legsRef = useRef([]);
  const bodyRef = useRef();
  const abdomenRef = useRef();
  const timeRef = useRef(0);
  const currentPosRef = useRef(position);
  const lastSoundRef = useRef(0);

  const bodyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.1, 0.05, 0.05),
      roughness: 0.2,
      metalness: 0.4,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      emissive: new THREE.Color(1.0, 0.3, 0.0),
      emissiveIntensity: 0.2,
      envMapIntensity: 1.5,
    });
  }, []);

  const stripeMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(1.0, 0.4, 0.0),
      roughness: 0.3,
      metalness: 0.3,
      clearcoat: 0.8,
      emissive: new THREE.Color(1.0, 0.4, 0.0),
      emissiveIntensity: 0.4,
    });
  }, []);

  const legMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.15, 0.08, 0.05),
      roughness: 0.3,
      metalness: 0.3,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.2,
    });
  }, []);

  const toothMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.9, 0.9, 0.85),
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.9,
      transmission: 0.1,
      thickness: 0.5,
    });
  }, []);

  const createLegSegment = (length, radius) => {
    const geometry = new THREE.CylinderGeometry(radius, radius * 0.6, length, 16, 4);
    geometry.translate(0, length / 2, 0);
    return geometry;
  };

  const createLeg = (index, side) => {
    const legGroup = new THREE.Group();
    const angle = (index / 4) * Math.PI * 0.6 + Math.PI * 0.2;
    const sideMultiplier = side === 'left' ? -1 : 1;

    const segment1 = new THREE.Mesh(createLegSegment(0.7, 0.12), legMaterial);
    segment1.castShadow = true;
    segment1.receiveShadow = true;
    legGroup.add(segment1);

    const joint1 = new THREE.Group();
    joint1.position.set(0, 0.7, 0);
    segment1.add(joint1);

    const segment2 = new THREE.Mesh(createLegSegment(0.9, 0.10), legMaterial);
    segment2.castShadow = true;
    segment2.receiveShadow = true;
    joint1.add(segment2);

    const joint2 = new THREE.Group();
    joint2.position.set(0, 0.9, 0);
    segment2.add(joint2);

    const segment3 = new THREE.Mesh(createLegSegment(1.1, 0.08), legMaterial);
    segment3.castShadow = true;
    segment3.receiveShadow = true;
    joint2.add(segment3);

    const joint3 = new THREE.Group();
    joint3.position.set(0, 1.1, 0);
    segment3.add(joint3);

    const segment4 = new THREE.Mesh(createLegSegment(0.6, 0.05), legMaterial);
    segment4.castShadow = true;
    segment4.receiveShadow = true;
    joint3.add(segment4);

    legGroup.position.set(
      Math.cos(angle) * 0.55 * sideMultiplier,
      -0.1,
      Math.sin(angle) * 0.55
    );
    
    legGroup.rotation.set(
      -Math.PI * 0.2,
      angle * sideMultiplier,
      sideMultiplier * Math.PI * 0.15
    );

    return { group: legGroup, joints: [segment1, joint1, joint2, joint3] };
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
      bodyRef.current.rotation.x = Math.sin(timeRef.current * 1.2) * 0.04;
      bodyRef.current.rotation.z = Math.cos(timeRef.current * 0.8) * 0.04;
    }

    if (abdomenRef.current) {
      abdomenRef.current.rotation.x = Math.sin(timeRef.current * 1.5) * 0.05;
      abdomenRef.current.position.z = -0.9 + Math.sin(timeRef.current * 0.9) * 0.08;
    }

    legs.forEach((leg, index) => {
      const { joints } = leg;
      const phase = (index / 8) * Math.PI * 2;
      const wave = timeRef.current * 2.8;
      
      if (joints[0]) {
        joints[0].rotation.z = Math.sin(wave + phase) * 0.25;
      }
      if (joints[1]) {
        joints[1].rotation.z = Math.sin(wave + phase + 0.5) * 0.3;
      }
      if (joints[2]) {
        joints[2].rotation.z = Math.sin(wave + phase + 1.0) * 0.35;
      }
      if (joints[3]) {
        joints[3].rotation.z = Math.sin(wave + phase + 1.5) * 0.25;
      }
    });
  });

  return (
    <group ref={groupRef} position={currentPosRef.current} scale={1.2}>
      {legs.map((leg, index) => (
        <primitive key={index} object={leg.group} />
      ))}

      <mesh ref={bodyRef} castShadow receiveShadow>
        <sphereGeometry args={[0.45, 64, 64]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      <mesh ref={abdomenRef} position={[0, 0, -0.9]} castShadow receiveShadow>
        <sphereGeometry args={[0.65, 64, 64]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      <mesh position={[0, 0.05, -0.6]} rotation={[0, 0, Math.PI * 0.15]} castShadow>
        <torusGeometry args={[0.5, 0.08, 16, 32]} />
        <primitive object={stripeMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 0.05, -1.0]} rotation={[0, 0, Math.PI * 0.1]} castShadow>
        <torusGeometry args={[0.5, 0.08, 16, 32]} />
        <primitive object={stripeMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 0.05, -1.3]} rotation={[0, 0, -Math.PI * 0.1]} castShadow>
        <torusGeometry args={[0.4, 0.07, 16, 32]} />
        <primitive object={stripeMaterial} attach="material" />
      </mesh>

      <group position={[0, 0.1, 0.35]}>
        <mesh position={[0.22, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.8, 0.1, 0.0)}
            metalness={1.0}
            roughness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            envMapIntensity={2.5}
            emissive={new THREE.Color(1.0, 0.2, 0.0)}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0.22, 0.1, 0]} scale={[0.6, 0.6, 0.6]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(1.0, 0.3, 0.0)}
            metalness={0.0}
            roughness={0.0}
            transmission={0.95}
            thickness={1.5}
            ior={1.6}
            clearcoat={1.0}
            emissive={new THREE.Color(1.0, 0.4, 0.0)}
            emissiveIntensity={1.2}
          />
        </mesh>

        <mesh position={[-0.22, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0.8, 0.1, 0.0)}
            metalness={1.0}
            roughness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            envMapIntensity={2.5}
            emissive={new THREE.Color(1.0, 0.2, 0.0)}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[-0.22, 0.1, 0]} scale={[0.6, 0.6, 0.6]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshPhysicalMaterial
            color={new THREE.Color(1.0, 0.3, 0.0)}
            metalness={0.0}
            roughness={0.0}
            transmission={0.95}
            thickness={1.5}
            ior={1.6}
            clearcoat={1.0}
            emissive={new THREE.Color(1.0, 0.4, 0.0)}
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>

      <group position={[0, -0.18, 0.5]} rotation={[Math.PI * 0.2, 0, 0]}>
        <mesh position={[0.12, -0.05, 0.1]} rotation={[Math.PI * 0.1, 0, -Math.PI * 0.15]} castShadow>
          <coneGeometry args={[0.03, 0.25, 12]} />
          <primitive object={toothMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.12, -0.05, 0.1]} rotation={[Math.PI * 0.1, 0, Math.PI * 0.15]} castShadow>
          <coneGeometry args={[0.03, 0.25, 12]} />
          <primitive object={toothMaterial} attach="material" />
        </mesh>
        <mesh position={[0.08, -0.08, 0.08]} rotation={[Math.PI * 0.15, 0, -Math.PI * 0.1]} castShadow>
          <coneGeometry args={[0.025, 0.2, 12]} />
          <primitive object={toothMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.08, -0.08, 0.08]} rotation={[Math.PI * 0.15, 0, Math.PI * 0.1]} castShadow>
          <coneGeometry args={[0.025, 0.2, 12]} />
          <primitive object={toothMaterial} attach="material" />
        </mesh>
      </group>

      <pointLight position={[0, 0.3, 0]} intensity={0.8} distance={4} color="#ff4400" />
      <pointLight position={[0.22, 0.2, 0.35]} intensity={0.4} distance={2} color="#ff6600" />
      <pointLight position={[-0.22, 0.2, 0.35]} intensity={0.4} distance={2} color="#ff6600" />
    </group>
  );
}
