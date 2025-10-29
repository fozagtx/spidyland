import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LabubuPlayer } from './LabubuPlayer';
import { soundManager } from './SoundManager';

export function LabubuPlayerController({ 
  onPositionChange, 
  onOrbCollect,
  onTotemActivate,
  orbs = [],
  totems = [],
  webTraps = [],
  speedMultiplier = 1,
  lightRadius = 5
}) {
  const [position, setPosition] = useState([0, 0, 0]);
  const [isDashing, setIsDashing] = useState(false);
  const [dashCooldown, setDashCooldown] = useState(0);
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const keysPressed = useRef({});
  const touchStart = useRef(null);
  const touchMove = useRef(null);
  const cameraOffset = useRef(new THREE.Vector3(0, 15, 20));
  const slowEffectRef = useRef(1);
  const { camera } = useThree();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      
      if (e.key === ' ' && dashCooldown === 0 && !isDashing) {
        activateDash();
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e) => {
      if (!touchStart.current) return;
      const touch = e.touches[0];
      touchMove.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      touchStart.current = null;
      touchMove.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dashCooldown, isDashing]);

  const activateDash = () => {
    setIsDashing(true);
    setDashCooldown(3);
    soundManager.playTreasureCollect();
    
    const dashDirection = new THREE.Vector3(velocityRef.current.x, 0, velocityRef.current.z);
    if (dashDirection.length() > 0) {
      dashDirection.normalize().multiplyScalar(20);
      velocityRef.current.add(dashDirection);
    }
    
    setTimeout(() => setIsDashing(false), 300);
  };

  useFrame((state, delta) => {
    if (dashCooldown > 0) {
      setDashCooldown(Math.max(0, dashCooldown - delta));
    }

    const keys = keysPressed.current;
    const moveForce = 15 * speedMultiplier * slowEffectRef.current;
    const maxSpeed = isDashing ? 20 : (8 * speedMultiplier * slowEffectRef.current);
    const friction = 0.85;
    
    const acceleration = new THREE.Vector3(0, 0, 0);

    if (keys['w'] || keys['arrowup']) {
      acceleration.z -= moveForce;
    }
    if (keys['s'] || keys['arrowdown']) {
      acceleration.z += moveForce;
    }
    if (keys['a'] || keys['arrowleft']) {
      acceleration.x -= moveForce;
    }
    if (keys['d'] || keys['arrowright']) {
      acceleration.x += moveForce;
    }

    if (touchStart.current && touchMove.current) {
      const deltaX = touchMove.current.x - touchStart.current.x;
      const deltaY = touchMove.current.y - touchStart.current.y;
      acceleration.x += deltaX * 0.5;
      acceleration.z += deltaY * 0.5;
    }

    velocityRef.current.x += acceleration.x * delta;
    velocityRef.current.z += acceleration.z * delta;

    const currentSpeed = Math.sqrt(
      velocityRef.current.x * velocityRef.current.x +
      velocityRef.current.z * velocityRef.current.z
    );

    if (currentSpeed > maxSpeed) {
      velocityRef.current.x = (velocityRef.current.x / currentSpeed) * maxSpeed;
      velocityRef.current.z = (velocityRef.current.z / currentSpeed) * maxSpeed;
    }

    velocityRef.current.multiplyScalar(friction);

    let newX = position[0] + velocityRef.current.x * delta;
    let newZ = position[2] + velocityRef.current.z * delta;

    const arenaRadius = 25;
    const distFromCenter = Math.sqrt(newX * newX + newZ * newZ);
    if (distFromCenter > arenaRadius) {
      const angle = Math.atan2(newZ, newX);
      newX = Math.cos(angle) * arenaRadius;
      newZ = Math.sin(angle) * arenaRadius;
      velocityRef.current.multiplyScalar(0.5);
    }

    const newPosition = [newX, 0, newZ];
    setPosition(newPosition);
    
    if (onPositionChange) {
      onPositionChange(newPosition);
    }

    slowEffectRef.current = 1;
    webTraps.forEach(trap => {
      if (!trap.collected) {
        const dx = trap.position[0] - newX;
        const dz = trap.position[2] - newZ;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < 2) {
          slowEffectRef.current = 0.5;
        }
      }
    });

    orbs.forEach((orb, index) => {
      if (!orb.collected) {
        const dx = orb.position[0] - newX;
        const dz = orb.position[2] - newZ;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < 1.5 && onOrbCollect) {
          onOrbCollect(index);
        }
      }
    });

    totems.forEach((totem, index) => {
      if (!totem.activated) {
        const dx = totem.position[0] - newX;
        const dz = totem.position[2] - newZ;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < 2 && keys['e'] && onTotemActivate) {
          onTotemActivate(index);
        }
      }
    });

    const targetCameraPos = new THREE.Vector3(
      newX + cameraOffset.current.x,
      cameraOffset.current.y,
      newZ + cameraOffset.current.z
    );
    
    camera.position.lerp(targetCameraPos, 0.1);
    
    const lookAtTarget = new THREE.Vector3(newX, 0, newZ);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(camera.position);
    currentLookAt.lerp(lookAtTarget, 0.1);
    camera.lookAt(currentLookAt);
  });

  return (
    <LabubuPlayer 
      position={position} 
      velocity={velocityRef.current}
      lightRadius={lightRadius}
      isDashing={isDashing}
    />
  );
}
