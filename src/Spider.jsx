import React, { useState, useEffect, useRef } from 'react';

const Spider = ({ initialX, initialY, initialRotation, size, speed, onClick, onDoubleClick }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [rotation, setRotation] = useState(initialRotation);
  const targetRef = useRef({ x: initialX, y: initialY });
  const animationRef = useRef(null);
  const legAnimationRef = useRef(0);
  const clickTimeoutRef = useRef(null);

  useEffect(() => {
    const pickNewTarget = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      targetRef.current = {
        x: Math.random() * (screenWidth - size),
        y: Math.random() * (screenHeight - size),
      };
    };

    pickNewTarget();

    const animate = () => {
      setPosition((currentPos) => {
        const dx = targetRef.current.x - currentPos.x;
        const dy = targetRef.current.y - currentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          pickNewTarget();
          return currentPos;
        }

        const targetRotation = (Math.atan2(dy, dx) * 180) / Math.PI;
        setRotation(targetRotation);

        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        return {
          x: currentPos.x + moveX,
          y: currentPos.y + moveY,
        };
      });

      legAnimationRef.current += 0.1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, speed]);

  const handleClick = (e) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      if (onDoubleClick) {
        onDoubleClick(e);
      }
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        if (onClick) {
          onClick(e);
        }
        clickTimeoutRef.current = null;
      }, 250);
    }
  };

  return (
    <div
      className="spider"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
      }}
      onClick={handleClick}
    >
      <div className="spider-body">
        <div className="spider-head"></div>
        <div className="spider-abdomen"></div>
        
        <div className="spider-legs legs-left">
          <div className="leg leg-1"></div>
          <div className="leg leg-2"></div>
          <div className="leg leg-3"></div>
          <div className="leg leg-4"></div>
        </div>
        
        <div className="spider-legs legs-right">
          <div className="leg leg-1"></div>
          <div className="leg leg-2"></div>
          <div className="leg leg-3"></div>
          <div className="leg leg-4"></div>
        </div>

        <div className="spider-eyes">
          <div className="eye eye-1"></div>
          <div className="eye eye-2"></div>
          <div className="eye eye-3"></div>
          <div className="eye eye-4"></div>
          <div className="eye eye-5"></div>
          <div className="eye eye-6"></div>
          <div className="eye eye-7"></div>
          <div className="eye eye-8"></div>
        </div>
      </div>
    </div>
  );
};

export default Spider;
