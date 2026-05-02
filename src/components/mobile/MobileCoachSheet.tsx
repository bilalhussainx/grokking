// src/components/mobile/MobileCoachSheet.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import CoachChat from "@/components/cc/coach/CoachChat";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileCoachSheet({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            data-testid="mobile-coach-sheet-scrim"
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Coach Kairos"
            aria-modal="true"
            className="fixed left-0 right-0 bottom-0 z-50 flex flex-col mobile-safe-bottom"
            style={{
              height: "78vh",
              background: "#0a0e16",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderTop: "1px solid rgba(212,175,55,.25)",
              boxShadow: "0 -12px 40px rgba(0,0,0,.6)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.65, 0, 0.35, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1 shrink-0">
              <span
                data-testid="mobile-coach-sheet-handle"
                aria-hidden
                className="rounded-full"
                style={{ width: 36, height: 4, background: "#d4af37", opacity: 0.6 }}
              />
            </div>
            {/* Chat body */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <CoachChat />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
