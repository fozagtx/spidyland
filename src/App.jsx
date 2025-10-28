import React, { useState, useEffect, useRef } from 'react';
import Spider from './Spider';
import SpiderWeb from './SpiderWeb';
import ToastContainer from './Toast';

const App = () => {
  const [spiders, setSpiders] = useState([]);
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(0);
  const toastIdRef = useRef(0);

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

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

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

  const handleWebClick = () => {
    showToast('Happy Halloween! 🎃👻🕷️', 'success', 4000);
  };

  return (
    <div className="app">
      <SpiderWeb onClick={handleWebClick} size={300} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
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
