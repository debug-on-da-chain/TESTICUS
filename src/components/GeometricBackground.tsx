import { useEffect, useRef } from 'react';

export default function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      const gridSize = 60;
      const lineWidth = 0.5;

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = lineWidth;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const diagonalSpacing = 120;
      const diagonalOffset = (time * 30) % diagonalSpacing;

      for (let i = -canvas.height - diagonalOffset; i < canvas.width + canvas.height; i += diagonalSpacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvas.height, canvas.height);
        const opacity = 0.05 + Math.sin(time + i * 0.01) * 0.02;
        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
        ctx.stroke();
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < 3; i++) {
        const baseRadius = 200 + i * 150;
        const pulse = Math.sin(time + i * 0.5) * 10;
        const radius = baseRadius + pulse;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        const opacity = 0.08 - i * 0.02 + Math.sin(time + i) * 0.02;
        ctx.strokeStyle = `rgba(16, 185, 129, ${Math.max(0, opacity)})`;
        ctx.stroke();
      }

      const particles: Array<{ x: number; y: number; size: number }> = [];
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + time * 0.5;
        const distance = 300 + Math.sin(time * 2 + i) * 50;
        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          size: 2 + Math.sin(time * 3 + i) * 1,
        });
      }

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
