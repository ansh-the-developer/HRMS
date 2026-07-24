// apps/frontend-ui-monorepo/src/components/ui/SakuraGlassEffect.jsx
import React, { useEffect, useRef } from "react";
import { useColorMode } from "@chakra-ui/react";
import { designTokens } from "@/theme/designTokens";

const SakuraGlassEffect = () => {
  const canvasRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!designTokens.enableSakuraEffect) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

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

    const maxPetals = 45;
    const petals = [];

    class SakuraPetal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 4 + 2.5;
        this.vy = Math.random() * 0.45 + 0.20;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.012 + 0.006;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.015;
        this.opacity = Math.random() * 0.40 + 0.25;
      }

      update() {
        this.y += this.vy;
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * 0.5;
        this.rotation += this.rotSpeed;

        if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(
          this.size * 0.8,
          -this.size * 0.8,
          this.size * 0.9,
          this.size * 0.5,
          0,
          this.size
        );
        ctx.bezierCurveTo(
          -this.size * 0.9,
          this.size * 0.5,
          -this.size * 0.8,
          -this.size * 0.8,
          0,
          -this.size
        );
        ctx.closePath();

        const petalColor =
          colorMode === "light"
            ? `rgba(244, 114, 182, ${this.opacity * 0.70})`
            : `rgba(252, 231, 243, ${this.opacity * 0.55})`;

        ctx.fillStyle = petalColor;
        ctx.shadowColor =
          colorMode === "light" ? "rgba(244, 114, 182, 0.25)" : "rgba(255, 255, 255, 0.2)";
        ctx.shadowBlur = 4;
        ctx.fill();

        ctx.restore();
      }
    }

    for (let i = 0; i < maxPetals; i++) {
      petals.push(new SakuraPetal());
    }

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Japanese Mt. Fuji & Pagoda Silhouette Atmospheric Layer
      ctx.save();
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      if (colorMode === "light") {
        skyGradient.addColorStop(0, "rgba(224, 231, 255, 0.40)");
        skyGradient.addColorStop(0.5, "rgba(251, 207, 232, 0.35)");
        skyGradient.addColorStop(1, "rgba(221, 228, 240, 0.50)");
      } else {
        skyGradient.addColorStop(0, "rgba(24, 20, 50, 0.50)");
        skyGradient.addColorStop(0.5, "rgba(45, 25, 60, 0.45)");
        skyGradient.addColorStop(1, "rgba(9, 13, 27, 0.60)");
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Mt. Fuji silhouette in distance
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height);
      ctx.lineTo(width * 0.55, height * 0.55);
      ctx.lineTo(width * 0.8, height);
      ctx.closePath();
      ctx.fillStyle =
        colorMode === "light"
          ? "rgba(147, 197, 253, 0.15)"
          : "rgba(99, 102, 241, 0.08)";
      ctx.filter = "blur(12px)";
      ctx.fill();
      ctx.filter = "none";
      ctx.restore();

      // Render Sakura Petals
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorMode]);

  if (!designTokens.enableSakuraEffect) return null;

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

export default SakuraGlassEffect;
