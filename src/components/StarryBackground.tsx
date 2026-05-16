import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; radius: number; vx: number; vy: number; opacity: number; life: number; maxLife: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000); // adjust density
      for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
      }
    };

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.1,
        vx: (Math.random() - 0.5) * 0.2, // very slow movement
        vy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random(),
        life: 0,
        maxLife: Math.random() * 200 + 100, // lifetime for blinking effect
      };
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add a subtle radial gradient light in the center like the hero image
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.6
      );
      gradient.addColorStop(0, 'rgba(0, 229, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Twinkle effect
        const currentOpacity = Math.sin((p.life / p.maxLife) * Math.PI) * p.opacity;

        if (p.life > p.maxLife) {
            particles[idx] = createParticle();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`;
        ctx.fill();
        
        // Slight glow for larger particles
        if (p.radius > 1) {
            ctx.shadowBlur = p.radius * 3;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        } else {
            ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resize);
    resize();
    drawParticles();
    setIsLoaded(true);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 2 }}
    />
  );
}
