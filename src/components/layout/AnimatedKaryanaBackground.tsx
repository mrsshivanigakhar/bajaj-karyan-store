'use client';

import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  speed: number;
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

    // Mouse tracking & smooth interpolation
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isMoving: false,
    };

    let moveTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        mouse.isMoving = false;
      }, 1500);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isMoving = true;
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
          mouse.isMoving = false;
        }, 1500);
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isMoving = false;
    };

    // Expanding shockwave ripples on click
    const ripples: Ripple[] = [];
    const handleMouseDown = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.7,
        strength: 22,
        speed: 7,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);

    // Handle high-DPI resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Dynamic scroll-based opacity fading to keep reading-heavy sections calm and readable
    const handleScroll = () => {
      if (!canvas) return;
      const scrollY = window.scrollY || 0;
      // Vibrant at top (hero/featured), gently fades to 0.16 at 900px+
      let scrollOpacity = 1;
      if (scrollY <= 350) {
        scrollOpacity = 1;
      } else if (scrollY >= 900) {
        scrollOpacity = 0.16;
      } else {
        scrollOpacity = 1 - ((scrollY - 350) / 550) * 0.84;
      }
      canvas.style.opacity = scrollOpacity.toFixed(2);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Grid configuration
    const spacing = 32; // Distance between dots
    const baseRadius = 1.5; // Idle dot radius
    const mouseInfluenceRadius = 240; // Influence zone of cursor

    let time = 0;

    function render() {
      if (!ctx) return;
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.025;

      // Smooth mouse position easing
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Update click ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const ripple = ripples[r];
        ripple.radius += ripple.speed;
        ripple.strength *= 0.985;
        if (ripple.radius >= ripple.maxRadius || ripple.strength < 0.2) {
          ripples.splice(r, 1);
        }
      }

      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      for (let i = -1; i < cols; i++) {
        const originX = i * spacing;

        for (let j = -1; j < rows; j++) {
          const originY = j * spacing;

          // 1. Ambient gentle idle wave
          const ambientWave =
            Math.sin(i * 0.18 + time * 0.8) * Math.cos(j * 0.18 + time * 0.7) * 2.5;

          let posX = originX;
          let posY = originY + ambientWave;
          let dotRadius = baseRadius;
          let alpha = 0.11;
          let isAccent = false;

          // 2. Interactive mouse wave
          const dx = originX - mouse.x;
          const dy = originY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseInfluenceRadius && dist > 0) {
            const normDist = dist / mouseInfluenceRadius; // 0 (center) to 1 (edge)
            const falloff = (1 - normDist);

            // Sine wave propagating away from mouse
            const wavePhase = dist * 0.055 - time * 2.2;
            const waveAmp = Math.sin(wavePhase) * falloff * 12;

            // Displace radially
            const nx = dx / dist;
            const ny = dy / dist;
            posX += nx * waveAmp;
            posY += ny * waveAmp;

            // Scale dot with wave crest
            dotRadius = baseRadius + Math.max(0, Math.sin(wavePhase)) * falloff * 2.0;
            alpha = 0.11 + falloff * 0.26;

            if (falloff > 0.4) {
              isAccent = true;
            }
          }

          // 3. Click shockwave ripples
          for (let r = 0; r < ripples.length; r++) {
            const ripple = ripples[r];
            const rdx = originX - ripple.x;
            const rdy = originY - ripple.y;
            const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
            const distDiff = Math.abs(rDist - ripple.radius);

            if (distDiff < 80) {
              const rFalloff = (1 - distDiff / 80) * (ripple.strength / 22);
              const rWave = Math.sin((distDiff / 80) * Math.PI) * rFalloff * 14;
              if (rDist > 0) {
                posX += (rdx / rDist) * rWave;
                posY += (rdy / rDist) * rWave;
              }
              dotRadius += rFalloff * 1.8;
              alpha = Math.min(0.6, alpha + rFalloff * 0.35);
              isAccent = true;
            }
          }

          // 4. Draw dot with theme-matching colors
          ctx.beginPath();
          ctx.arc(posX, posY, Math.max(0.5, dotRadius), 0, Math.PI * 2);

          if (isAccent) {
            // Radiant rose/bordeaux accent near wave crest
            ctx.fillStyle = `rgba(164, 19, 60, ${alpha.toFixed(2)})`;
          } else {
            // Subtle warm bordeaux/amber dot in rest state
            ctx.fillStyle = `rgba(128, 15, 47, ${alpha.toFixed(2)})`;
          }

          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(moveTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Warm, radiant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffdfa] via-[#fff5f5] to-[#fef6ee] transition-colors duration-500" />
      {/* Subtle radial ambient glows */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-radial from-rose-200/25 via-pink-100/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vh] bg-radial from-amber-100/25 via-rose-100/10 to-transparent blur-3xl pointer-events-none" />

      {/* Interactive wave dotted grid canvas with smooth opacity fade */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full transition-opacity duration-300" />
    </div>
  );
}
