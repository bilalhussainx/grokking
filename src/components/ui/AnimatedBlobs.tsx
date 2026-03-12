"use client";

import { motion } from "framer-motion";

interface BlobConfig {
  color: string;
  size: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  duration: number;
  path: { x: number[]; y: number[] };
}

interface AnimatedBlobsProps {
  intensity?: "high" | "medium" | "low";
}

const blobPresets: Record<string, BlobConfig[]> = {
  high: [
    {
      color: "radial-gradient(circle, #3b82f6 0%, #3b82f6 40%, transparent 70%)",
      size: "min(600px, 50vw)",
      position: { top: "-10%", left: "-5%" },
      duration: 28,
      path: { x: [0, 80, 160, 80, 0], y: [0, -60, 0, 60, 0] },
    },
    {
      color: "radial-gradient(circle, #8b5cf6 0%, #7c3aed 40%, transparent 70%)",
      size: "min(550px, 45vw)",
      position: { top: "20%", right: "-10%" },
      duration: 32,
      path: { x: [0, -70, -140, -70, 0], y: [0, 90, 0, -90, 0] },
    },
    {
      color: "radial-gradient(circle, #ec4899 0%, #db2777 40%, transparent 70%)",
      size: "min(400px, 35vw)",
      position: { bottom: "5%", left: "20%" },
      duration: 26,
      path: { x: [0, 60, 120, 60, 0], y: [0, -80, 0, 80, 0] },
    },
    {
      color: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(139,92,246,0.3) 50%, transparent 70%)",
      size: "min(350px, 30vw)",
      position: { top: "50%", left: "40%" },
      duration: 24,
      path: { x: [0, 40, 0, -40, 0], y: [0, -50, 0, 50, 0] },
    },
  ],
  medium: [
    {
      color: "radial-gradient(circle, #3b82f6 0%, #3b82f6 30%, transparent 70%)",
      size: "min(450px, 40vw)",
      position: { top: "0%", left: "-5%" },
      duration: 30,
      path: { x: [0, 50, 100, 50, 0], y: [0, -40, 0, 40, 0] },
    },
    {
      color: "radial-gradient(circle, #8b5cf6 0%, #7c3aed 30%, transparent 70%)",
      size: "min(400px, 35vw)",
      position: { bottom: "0%", right: "-5%" },
      duration: 34,
      path: { x: [0, -50, -100, -50, 0], y: [0, 60, 0, -60, 0] },
    },
  ],
  low: [
    {
      color: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
      size: "min(350px, 30vw)",
      position: { top: "-5%", right: "10%" },
      duration: 36,
      path: { x: [0, 30, 0, -30, 0], y: [0, -30, 0, 30, 0] },
    },
  ],
};

export default function AnimatedBlobs({ intensity = "high" }: AnimatedBlobsProps) {
  const blobs = blobPresets[intensity];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            background: blob.color,
            filter: "blur(150px)",
            opacity: intensity === "high" ? 0.35 : intensity === "medium" ? 0.25 : 0.15,
            ...blob.position,
          }}
          animate={{
            x: blob.path.x,
            y: blob.path.y,
            scale: [1, 1.15, 1.3, 1.15, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
