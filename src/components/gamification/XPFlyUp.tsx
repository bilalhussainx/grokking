"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface XPFlyUpProps {
  trigger: number;
  amount: number;
}

interface FlyUpItem {
  id: number;
  amount: number;
}

export default function XPFlyUp({ trigger, amount }: XPFlyUpProps) {
  const [items, setItems] = useState<FlyUpItem[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const id = Date.now();
    setItems((prev) => [...prev, { id, amount }]);

    const timer = setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 1500);

    return () => clearTimeout(timer);
  }, [trigger, amount]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -60, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-2xl font-bold"
            style={{
              color: "#FFD700",
              textShadow: "0 0 12px rgba(255, 215, 0, 0.6), 0 0 24px rgba(255, 215, 0, 0.3)",
            }}
          >
            +{item.amount} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
