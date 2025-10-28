import React, { useEffect, useRef } from 'react';

const SpiderWeb = ({ onClick, size = 300 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { 
      alpha: true, 
      antialias: true,
      premultipliedAlpha: false 
    });

    if (!gl) {
      console.warn('WebGL not supported, falling back to 2D canvas');
      return fallbackTo2D(canvas);
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute float a_alpha;
      uniform mat4 u_matrix;
      uniform float u_time;
      varying float v_alpha;
      
      void main() {
        vec2 pos = a_position;
        float wave = sin(u_time + length(pos) * 3.0) * 0.01;
        pos += normalize(pos) * wave;
        gl_Position = u_matrix * vec4(pos, 0.0, 1.0);
        v_alpha = a_alpha;
        gl_PointSize = 3.0;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      varying float v_alpha;
      uniform float u_time;
      
      void main() {
        float shimmer = 0.7 + 0.3 * sin(u_time * 2.0);
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = v_alpha * shimmer * (1.0 - smoothstep(0.3, 0.5, dist));
        gl_FragColor = vec4(0.9, 0.95, 1.0, alpha * 0.8);
      }
    `;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const alphaLocation = gl.getAttribLocation(program, 'a_alpha');
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    const positions = [];
    const alphas = [];
    const indices = [];
    let indexOffset = 0;

    const centerX = 0;
    const centerY = 0;
    
    const numSpokes = 16;
    const numRings = 8;

    for (let ring = 0; ring <= numRings; ring++) {
      const radius = (ring / numRings) * 0.9;
      const alpha = ring === 0 ? 1.0 : 0.4 + (1 - ring / numRings) * 0.6;
      
      for (let spoke = 0; spoke < numSpokes; spoke++) {
        const angle = (spoke / numSpokes) * Math.PI * 2;
        const jitter = ring > 0 ? (Math.random() - 0.5) * 0.03 : 0;
        const x = centerX + Math.cos(angle) * radius + jitter;
        const y = centerY + Math.sin(angle) * radius + jitter;
        
        positions.push(x, y);
        alphas.push(alpha);
      }
    }

    for (let ring = 0; ring < numRings; ring++) {
      for (let spoke = 0; spoke < numSpokes; spoke++) {
        const nextSpoke = (spoke + 1) % numSpokes;
        const current = ring * numSpokes + spoke;
        const next = ring * numSpokes + nextSpoke;
        const currentNext = (ring + 1) * numSpokes + spoke;
        const nextNext = (ring + 1) * numSpokes + nextSpoke;
        
        indices.push(current, currentNext);
        indices.push(current, next);
        
        if (ring === numRings - 1) {
          indices.push(current, currentNext);
        }
      }
    }

    for (let spoke = 0; spoke < numSpokes; spoke++) {
      for (let ring = 0; ring < numRings; ring++) {
        const current = ring * numSpokes + spoke;
        const next = (ring + 1) * numSpokes + spoke;
        indices.push(current, next);
      }
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const alphaBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alphas), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const render = () => {
      timeRef.current += 0.016;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
      gl.enableVertexAttribArray(alphaLocation);
      gl.vertexAttribPointer(alphaLocation, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      const matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];

      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      gl.uniform1f(timeLocation, timeRef.current);

      gl.lineWidth(1.5);
      gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);

      gl.drawArrays(gl.POINTS, 0, positions.length / 2);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(alphaBuffer);
      gl.deleteBuffer(indexBuffer);
    };
  }, [size]);

  const fallbackTo2D = (canvas) => {
    const ctx = canvas.getContext('2d');
    
    const render = () => {
      timeRef.current += 0.016;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;
      
      const shimmer = 0.7 + 0.3 * Math.sin(timeRef.current * 2);
      
      ctx.strokeStyle = `rgba(230, 240, 255, ${0.8 * shimmer})`;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      
      const numSpokes = 16;
      for (let i = 0; i < numSpokes; i++) {
        const angle = (i / numSpokes) * Math.PI * 2;
        const wave = Math.sin(timeRef.current + i) * 3;
        const endX = centerX + Math.cos(angle) * maxRadius + wave;
        const endY = centerY + Math.sin(angle) * maxRadius + wave;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      
      const numRings = 8;
      for (let ring = 1; ring <= numRings; ring++) {
        const radius = (ring / numRings) * maxRadius;
        const alpha = 0.4 + (1 - ring / numRings) * 0.6;
        
        ctx.strokeStyle = `rgba(230, 240, 255, ${alpha * shimmer})`;
        ctx.beginPath();
        
        for (let i = 0; i <= numSpokes; i++) {
          const angle = (i / numSpokes) * Math.PI * 2;
          const wave = Math.sin(timeRef.current + radius * 0.1) * 2;
          const x = centerX + Math.cos(angle) * radius + wave;
          const y = centerY + Math.sin(angle) * radius + wave;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * shimmer})`;
      for (let ring = 0; ring <= numRings; ring++) {
        const radius = (ring / numRings) * maxRadius;
        for (let i = 0; i < numSpokes; i++) {
          const angle = (i / numSpokes) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="spider-web"
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        cursor: 'pointer',
        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    />
  );
};

export default SpiderWeb;
