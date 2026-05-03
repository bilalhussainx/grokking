"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { label: "Counselor", href: "/?coach=open" },
  { label: "Essays", href: "/cc/essays" },
  { label: "Schools", href: "/schools" },
  { label: "Pricing", href: "/pricing" },
  { label: "Stories", href: "/stories" },
];

export default function MobileLandingMenu({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Menu"
          aria-modal="true"
          className="fixed inset-0 z-50 mobile-safe-top mobile-safe-bottom flex flex-col"
          style={{ background: "#05080d" }}
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-[16px] tracking-tight font-semibold">
              <span style={{ color: "#f2ede3" }}>Kairos</span>
              <em
                style={{
                  color: "#d4a84b",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                .ai
              </em>
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              style={{ width: 40, height: 40 }}
              className="flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-6">
            {MENU_ITEMS.map((it) => (
              <Link
                key={it.label}
                href={it.href}
                onClick={onClose}
                className="text-[28px] text-white/90 hover:text-white transition-colors"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                }}
              >
                {it.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-6 flex gap-3">
            <Link
              href="/login"
              className="flex-1 text-center py-3 rounded-xl text-[14px] font-semibold text-white/80 border border-white/15"
              onClick={onClose}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center py-3 rounded-xl text-[14px] font-semibold text-black"
              style={{ background: "#d4af37" }}
              onClick={onClose}
            >
              Get started
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
