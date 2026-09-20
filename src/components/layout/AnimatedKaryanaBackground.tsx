'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  vRot: number;
  type: number; // 0 to 8 for different karyana icons
  opacity: number;
  color: string;
}

export function AnimatedKaryanaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates & repulsion radius
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
      targetRadius: 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleMouseDown = () => {
      mouse.radius = 220; // Push further on click
      setTimeout(() => {
        mouse.radius = 140;
      }, 350);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Warm elegant colors matching Bordeaux & Rose theme
    const colors = [
      'rgba(128, 15, 47, 0.10)',   // Deep rose/bordeaux
      'rgba(164, 19, 60, 0.09)',   // Burgundy
      'rgba(201, 24, 74, 0.08)',   // Rose
      'rgba(180, 83, 9, 0.09)',    // Warm amber (grains)
      'rgba(161, 98, 7, 0.08)',    // Mustard/ghee gold
    ];

    // Determine particle count based on screen size
    const particleCount = Math.min(Math.max(Math.floor((width * height) / 35000), 24), 48);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 12 + 20, // 20 to 32px
        angle: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.008,
        type: Math.floor(Math.random() * 8),
        opacity: Math.random() * 0.04 + 0.08, // Subtle opacity
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Helper functions to draw crisp karyana store icons
    function drawIcon(c: CanvasRenderingContext2D, type: number, s: number) {
      c.lineWidth = 1.6;
      c.lineCap = 'round';
      c.lineJoin = 'round';

      switch (type) {
        // 0. Shopping Bag
        case 0: {
          const w = s * 0.7;
          const h = s * 0.8;
          c.strokeRect(-w / 2, -h / 2 + 4, w, h - 4);
          c.beginPath();
          c.arc(0, -h / 2 + 4, w * 0.35, Math.PI, 0, false);
          c.stroke();
          break;
        }

        // 1. Wheat / Grain Ear (Atta / Staples)
        case 1: {
          c.beginPath();
          c.moveTo(0, s * 0.45);
          c.lineTo(0, -s * 0.45);
          for (let y = -s * 0.3; y <= s * 0.2; y += s * 0.12) {
            c.moveTo(0, y);
            c.lineTo(s * 0.25, y - s * 0.1);
            c.moveTo(0, y);
            c.lineTo(-s * 0.25, y - s * 0.1);
          }
          c.stroke();
          break;
        }

        // 2. Jar (Pure Desi Ghee / Honey / Pickles)
        case 2: {
          const w = s * 0.6;
          const h = s * 0.75;
          // Lid
          c.strokeRect(-w * 0.4, -h / 2, w * 0.8, h * 0.15);
          // Jar body
          c.strokeRect(-w / 2, -h / 2 + h * 0.15, w, h * 0.85);
          // Label line
          c.beginPath();
          c.moveTo(-w * 0.35, 0);
          c.lineTo(w * 0.35, 0);
          c.stroke();
          break;
        }

        // 3. Apple / Fresh Fruit
        case 3: {
          const r = s * 0.32;
          c.beginPath();
          c.arc(-r * 0.4, 0, r, 0, Math.PI * 2);
          c.arc(r * 0.4, 0, r, 0, Math.PI * 2);
          c.stroke();
          // Stem
          c.beginPath();
          c.moveTo(0, -r);
          c.quadraticCurveTo(s * 0.15, -s * 0.4, s * 0.1, -s * 0.45);
          c.stroke();
          break;
        }

        // 4. Wrapped Candy / Confectionery Sweet
        case 4: {
          const r = s * 0.25;
          c.beginPath();
          c.arc(0, 0, r, 0, Math.PI * 2);
          c.stroke();
          // Left wrapper tail
          c.beginPath();
          c.moveTo(-r, 0);
          c.lineTo(-s * 0.45, -s * 0.15);
          c.lineTo(-s * 0.45, s * 0.15);
          c.closePath();
          c.stroke();
          // Right wrapper tail
          c.beginPath();
          c.moveTo(r, 0);
          c.lineTo(s * 0.45, -s * 0.15);
          c.lineTo(s * 0.45, s * 0.15);
          c.closePath();
          c.stroke();
          break;
        }

        // 5. Spice / Herbal Leaf
        case 5: {
          c.beginPath();
          c.moveTo(0, -s * 0.4);
          c.quadraticCurveTo(s * 0.35, 0, 0, s * 0.4);
          c.quadraticCurveTo(-s * 0.35, 0, 0, -s * 0.4);
          c.moveTo(0, -s * 0.35);
          c.lineTo(0, s * 0.35);
          c.stroke();
          break;
        }

        // 6. Milk / Oil Bottle
        case 6: {
          const w = s * 0.5;
          const h = s * 0.8;
          // Neck
          c.strokeRect(-w * 0.25, -h / 2, w * 0.5, h * 0.25);
          // Bottle body
          c.strokeRect(-w / 2, -h / 2 + h * 0.25, w, h * 0.75);
          break;
        }

        // 7. Tea / Coffee Cup
        case 7: {
          const w = s * 0.6;
          const h = s * 0.5;
          // Cup body
          c.strokeRect(-w / 2, -h / 2, w, h);
          // Handle
          c.beginPath();
          c.arc(w / 2 + 3, -h / 4, h * 0.3, -Math.PI / 2, Math.PI / 2);
          c.stroke();
          // Saucer
          c.beginPath();
          c.moveTo(-w * 0.7, h / 2 + 2);
          c.lineTo(w * 0.7, h / 2 + 2);
          c.stroke();
          break;
        }
      }
    }

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function render() {
      if (!ctx) return;
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Move particle
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.vRot;

        // 2. Mouse interaction (gentle repulsion)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 2.2;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          p.x += fx;
          p.y += fy;
        }

        // 3. Screen border wrapping with padding
        const pad = p.size * 2;
        if (p.x < -pad) p.x = width + pad;
        if (p.x > width + pad) p.x = -pad;
        if (p.y < -pad) p.y = height + pad;
        if (p.y > height + pad) p.y = -pad;

        // 4. Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.strokeStyle = p.color;
        drawIcon(ctx, p.type, p.size);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Warm, radiant gradient background instead of plain white */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffdfa] via-[#fff5f5] to-[#fef6ee] transition-colors duration-500" />
      {/* Subtle radial accent for depth */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-radial from-rose-200/20 via-pink-100/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vh] bg-radial from-amber-100/20 via-rose-100/10 to-transparent blur-3xl pointer-events-none" />

      {/* Interactive animated icons canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
