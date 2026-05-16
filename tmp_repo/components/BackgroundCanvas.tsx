import React, { useEffect, useRef } from 'react';

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Entities
    let stars: Star[] = [];
    let nebulas: Nebula[] = [];
    let meteors: Meteor[] = [];
    let animationFrameId: number;

    const config = { 
      starCount: width < 768 ? 60 : 150, 
      nebulaCount: 5,
      meteorChance: 0.02, // Increased for visibility
      connectionDistance: 100 
    };

    // --- CLASSES ---

    class Nebula {
        x: number = 0;
        y: number = 0;
        radius: number = 0;
        color: string = '';
        vx: number = 0;
        vy: number = 0;

        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Large radius for "galaxy" feel
            this.radius = Math.random() * (width < 768 ? 300 : 600) + 200;
            
            // Deep space colors
            const colors = [
                'rgba(76, 29, 149, 0.15)', // Deep Violet
                'rgba(15, 23, 42, 0.8)',   // Dark Slate (Base)
                'rgba(30, 58, 138, 0.2)',  // Dark Blue
                'rgba(88, 28, 135, 0.15)', // Purple
                'rgba(6, 182, 212, 0.05)'  // Faint Cyan
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Very slow drift
            this.vx = (Math.random() - 0.5) * 0.15;
            this.vy = (Math.random() - 0.5) * 0.15;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around screen
            const pad = this.radius;
            if (this.x < -pad) this.x = width + pad;
            if (this.x > width + pad) this.x = -pad;
            if (this.y < -pad) this.y = height + pad;
            if (this.y > height + pad) this.y = -pad;
        }

        draw(ctx: CanvasRenderingContext2D) {
            // Draw a large radial gradient
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Star {
      x: number = 0;
      y: number = 0;
      z: number = 0; // Depth
      size: number = 0;
      opacity: number = 0;
      vx: number = 0;
      vy: number = 0;

      constructor() { this.reset(true); }
      
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * width;
        
        // Size depends on depth (closer = bigger)
        this.size = (1 - this.z / width) * 1.5 + 0.5;
        this.opacity = (1 - this.z / width) * 0.8 + 0.2;
        
        // Parallax movement
        const speed = 0.05;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Meteor {
      x: number = 0;
      y: number = 0;
      length: number = 0;
      speed: number = 0;
      angle: number = 0;
      active: boolean = true;
      opacity: number = 1;

      constructor() { this.reset(); }
      
      reset() {
        // Random start side
        const side = Math.floor(Math.random() * 4);
        const padding = 100;
        
        if (side === 0) { // Top
            this.x = Math.random() * width;
            this.y = -padding;
        } else if (side === 1) { // Right
            this.x = width + padding;
            this.y = Math.random() * height;
        } else if (side === 2) { // Bottom
            this.x = Math.random() * width;
            this.y = height + padding;
        } else { // Left
            this.x = -padding;
            this.y = Math.random() * height;
        }

        // Target a random point within the screen to ensure it crosses
        const targetX = Math.random() * width;
        const targetY = Math.random() * height;
        
        this.angle = Math.atan2(targetY - this.y, targetX - this.x);
        
        this.length = Math.random() * 150 + 50;
        this.speed = Math.random() * 15 + 8; // Fast
        this.active = true;
        this.opacity = 0.8 + Math.random() * 0.2;
      }
      
      update() {
        if (!this.active) return;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Fade out
        this.opacity -= 0.01;
        
        // Bounds check with buffer
        if (this.x < -300 || this.x > width + 300 || this.y < -300 || this.y > height + 300 || this.opacity <= 0) {
            this.active = false;
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        if (!this.active) return;
        
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;
        
        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`); // Head is white hot
        gradient.addColorStop(0.2, `rgba(0, 242, 255, ${this.opacity * 0.8})`); // Cyan mid
        gradient.addColorStop(1, `rgba(0, 242, 255, 0)`); // Tail fade
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    }

    // --- INIT ---

    const initEntities = () => {
      nebulas = [];
      for(let i=0; i<config.nebulaCount; i++) nebulas.push(new Nebula());

      stars = [];
      for (let i = 0; i < config.starCount; i++) stars.push(new Star());
    };

    const animate = () => {
      if (!ctx) return;
      
      // Clear with very slight transparency for trail effect (optional, but pure clear is cleaner for this style)
      ctx.clearRect(0, 0, width, height);
      
      // 1. Draw Nebulas (Background Layer)
      // Composite operation to blend them nicely
      ctx.globalCompositeOperation = 'screen';
      nebulas.forEach(n => {
        n.update();
        n.draw(ctx);
      });
      ctx.globalCompositeOperation = 'source-over'; // Reset

      // 2. Draw Stars & Connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 0.5;
      
      stars.forEach((star, i) => {
        star.update();
        star.draw(ctx);
        
        // Connect nearby stars
        for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = dx*dx + dy*dy; // squared distance
            if (dist < config.connectionDistance * config.connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.stroke();
            }
        }
      });

      // 3. Draw Meteors
      if (Math.random() < config.meteorChance) meteors.push(new Meteor());
      
      meteors.forEach((m, i) => {
        m.update();
        m.draw(ctx);
        if (!m.active) meteors.splice(i, 1);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      config.starCount = width < 768 ? 60 : 150;
      initEntities();
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    initEntities();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ background: 'black', zIndex: -1 }} 
    />
  );
};

export default BackgroundCanvas;