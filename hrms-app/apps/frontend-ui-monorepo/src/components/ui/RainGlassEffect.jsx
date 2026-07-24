// apps/frontend-ui-monorepo/src/components/ui/RainGlassEffect.jsx
import React, { useEffect, useRef } from "react";
import { useColorMode } from "@chakra-ui/react";
import { designTokens } from "@/theme/designTokens";

const RainGlassEffect = () => {
  const canvasRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!designTokens.enableRainEffect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const maxDroplets = 45;
    const droplets = [];

    class Droplet {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -15;
        this.r = Math.random() * 1.5 + 0.7;          // Small droplets
        this.vy = Math.random() * 0.18 + 0.05;        // Cinematic slow speed
        this.vx = Math.random() * 0.02 - 0.01;        // Slight drift
        this.alpha = Math.random() * 0.30 + 0.20;     // Subtle opacity
        this.isStatic = Math.random() > 0.80;         // 20% static droplets
      }

      update() {
        if (this.isStatic) return;

        this.y += this.vy;
        this.x += this.vx;

        if (this.y > height + 15 || this.x < -15 || this.x > width + 15) {
          this.reset();
        }
      }

      draw() {
        // Soft drop base shadow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle =
          colorMode === "light"
            ? `rgba(0, 0, 0, ${this.alpha * 0.06})`
            : `rgba(255, 255, 255, ${this.alpha * 0.03})`;
        ctx.fill();

        // Water specular highlight point
        ctx.beginPath();
        ctx.arc(
          this.x - this.r * 0.3,
          this.y - this.r * 0.3,
          this.r * 0.18,
          0,
          Math.PI * 2
        );
        ctx.fillStyle =
          colorMode === "light"
            ? `rgba(255, 255, 255, ${this.alpha * 0.40})`
            : `rgba(255, 255, 255, ${this.alpha * 0.50})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < maxDroplets; i++) {
      droplets.push(new Droplet());
    }

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      droplets.forEach((drop) => {
        drop.update();
        drop.draw();
      });

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorMode]);

  if (!designTokens.enableRainEffect) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default RainGlassEffect;
