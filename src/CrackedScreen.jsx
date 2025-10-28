import React, { useEffect, useState } from 'react';

const CrackedScreen = ({ cracks, onAnimationComplete }) => {
  const generateCrackPath = (crack) => {
    const { x, y } = crack;
    const numBranches = 5 + Math.floor(Math.random() * 8);
    const paths = [];

    for (let i = 0; i < numBranches; i++) {
      const angle = (i / numBranches) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const length = 80 + Math.random() * 150;
      
      let currentX = x;
      let currentY = y;
      let pathData = `M ${currentX} ${currentY}`;
      
      const segments = 10 + Math.floor(Math.random() * 15);
      
      for (let j = 0; j < segments; j++) {
        const segmentLength = length / segments;
        const deviation = (Math.random() - 0.5) * 30;
        const currentAngle = angle + (Math.random() - 0.5) * 0.3;
        
        currentX += Math.cos(currentAngle) * segmentLength + (Math.random() - 0.5) * 10;
        currentY += Math.sin(currentAngle) * segmentLength + (Math.random() - 0.5) * 10;
        
        pathData += ` L ${currentX} ${currentY}`;
        
        if (j > 3 && Math.random() > 0.7) {
          const branchX = currentX + (Math.random() - 0.5) * 60;
          const branchY = currentY + (Math.random() - 0.5) * 60;
          paths.push({
            d: `M ${currentX} ${currentY} L ${branchX} ${branchY}`,
            width: 0.5 + Math.random() * 1.5,
            opacity: 0.3 + Math.random() * 0.4
          });
        }
      }
      
      paths.push({
        d: pathData,
        width: 1 + Math.random() * 2,
        opacity: 0.5 + Math.random() * 0.3
      });
    }
    
    return paths;
  };

  if (cracks.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <filter id="crack-glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="crack-impact">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="30%" stopColor="rgba(200,200,200,0.3)" />
            <stop offset="100%" stopColor="rgba(150,150,150,0)" />
          </radialGradient>
        </defs>
        
        {cracks.map((crack, crackIndex) => {
          const allPaths = generateCrackPath(crack);
          
          return (
            <g key={crackIndex}>
              <circle
                cx={crack.x}
                cy={crack.y}
                r="30"
                fill="url(#crack-impact)"
                opacity="0.5"
                style={{
                  animation: 'crackImpact 0.3s ease-out forwards'
                }}
              />
              
              {allPaths.map((path, pathIndex) => (
                <path
                  key={pathIndex}
                  d={path.d}
                  stroke="rgba(0, 0, 0, 0.6)"
                  strokeWidth={path.width}
                  fill="none"
                  opacity={path.opacity}
                  filter="url(#crack-glow)"
                  style={{
                    animation: `crackSpread 0.4s ease-out forwards`,
                    animationDelay: `${pathIndex * 0.02}s`,
                    strokeDasharray: '1000',
                    strokeDashoffset: '1000',
                  }}
                />
              ))}
              
              {allPaths.map((path, pathIndex) => (
                <path
                  key={`shadow-${pathIndex}`}
                  d={path.d}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth={path.width * 0.5}
                  fill="none"
                  opacity={path.opacity * 0.6}
                  style={{
                    animation: `crackSpread 0.4s ease-out forwards`,
                    animationDelay: `${pathIndex * 0.02}s`,
                    strokeDasharray: '1000',
                    strokeDashoffset: '1000',
                    transform: 'translate(1px, 1px)'
                  }}
                />
              ))}
            </g>
          );
        })}
      </svg>
      
      <style jsx>{`
        @keyframes crackSpread {
          to {
            strokeDashoffset: 0;
          }
        }
        
        @keyframes crackImpact {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default CrackedScreen;
