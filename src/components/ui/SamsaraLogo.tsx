"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface KairosLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  animate?: boolean;
  className?: string;
}

const sizes = {
  xs: { img: 28, text: "text-lg", ring: 32 },
  sm: { img: 40, text: "text-xl", ring: 48 },
  md: { img: 64, text: "text-2xl", ring: 72 },
  lg: { img: 96, text: "text-3xl", ring: 108 },
  xl: { img: 128, text: "text-4xl", ring: 140 },
};

export default function KairosLogo({
  size = "md",
  showText = true,
  animate = true,
  className = "",
}: KairosLogoProps) {
  const s = sizes[size];

  const logoImage = (
    <div className="relative" style={{ width: s.img, height: s.img }}>
      {/* Animated glow ring — navy + gold matching the Kairos logo */}
      {animate && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #1e3a5f, #c8a23d, #1e3a5f, #c8a23d, #1e3a5f)",
            filter: "blur(6px)",
            margin: -3,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      )}
      {/* Logo image */}
      <Image
        src="/kairos-logo.jpg"
        alt="Kairos.ai"
        width={s.img}
        height={s.img}
        className="relative rounded-full object-cover ring-1 ring-white/10 bg-white"
        priority
      />
      {/* Subtle pulse overlay */}
      {animate && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1e3a5f]/20 to-[#c8a23d]/20"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );

  if (!showText) {
    return <div className={className}>{logoImage}</div>;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoImage}
      <motion.div
        className="flex flex-col"
        initial={animate ? { opacity: 0, x: -8 } : undefined}
        animate={animate ? { opacity: 1, x: 0 } : undefined}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span
          className={`${s.text} font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent`}
        >
          Kairos
          <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            .ai
          </span>
        </span>
      </motion.div>
    </div>
  );
}

/** Compact animated logo for nav bars */
export function KairosLogoIcon({
  size = 28,
  animate = true,
}: {
  size?: number;
  animate?: boolean;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {animate && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -2,
            background:
              "conic-gradient(from 0deg, #1e3a5f, #c8a23d, #1e3a5f, #c8a23d, #1e3a5f)",
            filter: "blur(4px)",
            opacity: 0.6,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      )}
      <Image
        src="/kairos-logo.jpg"
        alt="Kairos.ai"
        width={size}
        height={size}
        className="relative rounded-full object-cover ring-1 ring-white/10 bg-white"
        priority
      />
    </div>
  );
}
