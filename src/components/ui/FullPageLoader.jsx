"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const blobs = [
  {
    className: "top-[-10%] left-[-5%] w-[500px] h-[500px]",
    gradient: "radial-gradient(circle, #3F72AF 0%, #DBE2EF 50%, transparent 70%)",
    blur: 80,
    animation: "blob-float-1 18s ease-in-out infinite",
    opacity: 0.25,
  },
  {
    className: "top-[30%] right-[-10%] w-[600px] h-[600px]",
    gradient: "radial-gradient(circle, #112D4E 0%, #3F72AF 40%, transparent 70%)",
    blur: 100,
    animation: "blob-float-2 22s ease-in-out infinite",
    opacity: 0.18,
  },
  {
    className: "bottom-[-5%] left-[10%] w-[450px] h-[450px]",
    gradient: "radial-gradient(circle, #DBE2EF 0%, #3F72AF 50%, transparent 75%)",
    blur: 70,
    animation: "blob-float-3 20s ease-in-out infinite",
    opacity: 0.22,
  },
  {
    className: "top-[10%] right-[20%] w-[350px] h-[350px]",
    gradient: "radial-gradient(circle, #3F72AF 0%, transparent 60%)",
    blur: 60,
    animation: "blob-float-4 16s ease-in-out infinite",
    opacity: 0.15,
  },
  {
    className: "bottom-[20%] right-[-5%] w-[400px] h-[400px]",
    gradient: "radial-gradient(circle, #112D4E 0%, #DBE2EF 60%, transparent 80%)",
    blur: 90,
    animation: "blob-float-1 24s ease-in-out infinite reverse",
    opacity: 0.12,
  },
];

export default function FullPageLoader({ message = "Preparing your experience..." }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-snow relative overflow-hidden flex items-center justify-center">
      {/* Animated blur blobs */}
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${blob.className}`}
          style={{
            background: blob.gradient,
            filter: `blur(${blob.blur}px)`,
            opacity: mounted ? blob.opacity : 0,
            animation: blob.animation,
            transition: `opacity 0.8s ease-out ${i * 0.15}s`,
          }}
        />
      ))}

      {/* Center content */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease-out 0.3s, transform 0.7s ease-out 0.3s",
        }}
      >
        {/* Logo */}
        <div
          className="mb-10"
          style={{
            animation: "logo-breathe 3s ease-in-out infinite",
          }}
        >
          <Image
            src="/storipoi.svg"
            alt="Storipoi"
            width={200}
            height={200}
            priority
          />
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-dark-navy/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-blue via-soft-blue to-primary-blue"
            style={{
              animation: "shimmer-bar 2s ease-in-out infinite",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

        {/* Message */}
        <p className="text-dark-navy/50 text-sm font-medium tracking-wide">
          {message}
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-25px, 25px) scale(0.95); }
        }
        @keyframes blob-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-35px, 40px) scale(0.93); }
          66% { transform: translate(30px, -20px) scale(1.06); }
        }
        @keyframes blob-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -40px) scale(1.1); }
        }
        @keyframes blob-float-4 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-20px, 30px) scale(1.05) rotate(5deg); }
          66% { transform: translate(25px, -15px) scale(0.97) rotate(-3deg); }
        }
        @keyframes logo-breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.85; }
        }
        @keyframes shimmer-bar {
          0% { background-position: -200% 0; width: 30%; }
          50% { width: 100%; }
          100% { background-position: 200% 0; width: 30%; }
        }
      `}</style>
    </div>
  );
}
