import * as THREE from 'three';

export class TextureGenerator {
  static createAlbedoMap(resolution = 2048) {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(
      resolution / 2, resolution / 2, 0,
      resolution / 2, resolution / 2, resolution / 2
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.4, '#f5f5f5');
    gradient.addColorStop(0.7, '#eeeeee');
    gradient.addColorStop(1, '#e8e8e8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, resolution, resolution);

    for (let i = 0; i < 800; i++) {
      const x = Math.random() * resolution;
      const y = Math.random() * resolution;
      const size = Math.random() * 4 + 1;
      const opacity = Math.random() * 0.4 + 0.1;
      
      ctx.fillStyle = `rgba(${240 + Math.random() * 15}, ${240 + Math.random() * 15}, ${245 + Math.random() * 10}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 300; i++) {
      const x = Math.random() * resolution;
      const y = Math.random() * resolution;
      const length = Math.random() * 30 + 10;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.strokeStyle = `rgba(235, 235, 240, ${Math.random() * 0.3 + 0.2})`;
      ctx.lineWidth = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }

  static createNormalMap(resolution = 2048) {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, resolution, resolution);

    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * resolution;
      const y = Math.random() * resolution;
      const radius = Math.random() * 8 + 2;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, '#9090ff');
      gradient.addColorStop(0.5, '#8080ff');
      gradient.addColorStop(1, '#7070ff');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 500; i++) {
      const x = Math.random() * resolution;
      const y = Math.random() * resolution;
      const length = Math.random() * 40 + 10;
      const angle = Math.random() * Math.PI * 2;
      const width = Math.random() * 4 + 1;
      
      const gradient = ctx.createLinearGradient(
        x, y,
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
      gradient.addColorStop(0, '#8585ff');
      gradient.addColorStop(0.5, '#9595ff');
      gradient.addColorStop(1, '#8585ff');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }

  static createRoughnessMap(resolution = 2048) {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, resolution, resolution);

    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * resolution;
      const y = Math.random() * resolution;
      const size = Math.random() * 6 + 1;
      const value = Math.random() * 100 + 50;
      
      ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }

  static createAOMap(resolution = 2048) {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, resolution, resolution);

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * resolution;
      const y = Math.random() * resolution;
      const radius = Math.random() * 60 + 20;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }

  static createDisplacementMap(resolution = 2048) {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, resolution, resolution);

    for (let i = 0; i < 800; i++) {
      const x = Math.random() * resolution;
      const y = Math.random() * resolution;
      const radius = Math.random() * 12 + 3;
      const value = Math.random() * 100 + 100;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgb(${value}, ${value}, ${value})`);
      gradient.addColorStop(1, '#808080');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }
}
