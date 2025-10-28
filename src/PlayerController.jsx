import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Player } from './Player';

export function PlayerController({ onPositionChange, treasurePosition, treasureCollected, onTreasureCollect }) {
  const [position, setPosition] = useState([0, 0, 0]);
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const keysPressed = useRef({});
  const touchStart = useRef(null);
  const touchMove = useRef(null);
  const cameraOffset = useRef(new THREE.Vector3(0, 15, 20));
  const { camera } = useThree();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
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
  }, []);

  useFrame((state, delta) => {
    const keys = keysPressed.current;
    const moveForce = 15;
    const maxSpeed = 8;
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

    newX = Math.max(-45, Math.min(45, newX));
    newZ = Math.max(-45, Math.min(45, newZ));

    const newPosition = [newX, 0, newZ];
    setPosition(newPosition);
    
    if (onPositionChange) {
      onPositionChange(newPosition);
    }

    if (!treasureCollected && treasurePosition) {
      const dx = treasurePosition[0] - newX;
      const dz = treasurePosition[2] - newZ;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 2 && onTreasureCollect) {
        onTreasureCollect();
      }
    }

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
    <Player 
      position={position} 
      keysPressed={keysPressed.current}
      velocity={velocityRef.current}
    />
  );
}
