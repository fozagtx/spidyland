import React, { useState, useEffect, useRef } from 'react';
import Spider from './Spider';

const App = () => {
  const [spiders, setSpiders] = useState([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    const initialSpiders = [];
    for (let i = 0; i < 8; i++) {
      initialSpiders.push({
        id: nextIdRef.current++,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        size: 40 + Math.random() * 30,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
    setSpiders(initialSpiders);
  }, []);

  const handleSpiderClick = () => {
    setSpiders((prev) => {
      if (prev.length >= 50) return prev;
      
      const newSpiders = [...prev];
      for (let i = 0; i < 3; i++) {
        newSpiders.push({
          id: nextIdRef.current++,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          rotation: Math.random() * 360,
          size: 40 + Math.random() * 30,
          speed: 0.5 + Math.random() * 1.5,
        });
      }
      return newSpiders;
    });
  };

  return (
    <div className="app">
      {spiders.map((spider) => (
        <Spider
          key={spider.id}
          initialX={spider.x}
          initialY={spider.y}
          initialRotation={spider.rotation}
          size={spider.size}
          speed={spider.speed}
          onClick={handleSpiderClick}
        />
      ))}
    </div>
  );
};

export default App;
