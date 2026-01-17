"use client";

import { useEffect, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: ["#06b6d4", "#22d3ee", "#8b5cf6", "#a78bfa"],
      },
      links: {
        color: "#06b6d4",
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "bounce",
        },
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
        value: 80,
      },
      opacity: {
        value: { min: 0.1, max: 0.4 },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 -z-10"
      options={options}
    />
  );
}

export function GridBackground() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <div
        className="absolute inset-0 animate-grid opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/80 via-transparent to-transparent" />
    </div>
  );
}

export function GlobeVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const drawGlobe = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, "rgba(6, 182, 212, 0.3)");
      gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.15)");
      gradient.addColorStop(1, "rgba(3, 7, 18, 0.8)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
      ctx.lineWidth = 1;

      for (let i = -80; i <= 80; i += 20) {
        const latRadius = Math.cos((i * Math.PI) / 180) * radius;
        const y = centerY + Math.sin((i * Math.PI) / 180) * radius;
        ctx.beginPath();
        ctx.ellipse(centerX, y, latRadius, latRadius * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 + rotation) * (Math.PI / 180);
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          radius * Math.abs(Math.cos(angle)),
          radius,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      const cities = [
        { lat: 40.7, lng: -74 },
        { lat: 51.5, lng: 0 },
        { lat: 35.7, lng: 139.7 },
        { lat: -33.9, lng: 151.2 },
        { lat: 28.6, lng: 77.2 },
      ];

      cities.forEach((city) => {
        const phi = ((90 - city.lat) * Math.PI) / 180;
        const theta = ((city.lng + rotation) * Math.PI) / 180;

        const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
        const y = centerY - radius * Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        if (z > -0.2) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 10);
          glow.addColorStop(0, "rgba(34, 211, 238, 0.8)");
          glow.addColorStop(1, "rgba(34, 211, 238, 0)");

          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#22d3ee";
          ctx.fill();
        }
      });

      rotation += 0.1;
      animationId = requestAnimationFrame(drawGlobe);
    };

    drawGlobe();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-60 pointer-events-none"
    />
  );
}
