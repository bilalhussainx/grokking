'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SignupPromptProps {
  show: boolean;
  onDismiss: () => void;
  title?: string;
  message?: string;
}

export default function SignupPrompt({ show, onDismiss, title, message }: SignupPromptProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#141414] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button onClick={onDismiss} className="absolute top-4 right-4 text-white/30 hover:text-white/60">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-3">
              {title || "Enjoyed that? There's more."}
            </h2>
            <p className="text-white/50 mb-8">
              {message || "Create a free account to save your progress, track your learning, and get unlimited sessions."}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#C4A030] transition text-center"
              >
                Create Free Account
              </Link>
              <button
                onClick={onDismiss}
                className="px-6 py-3 border border-white/10 text-white/50 rounded-lg hover:text-white hover:bg-white/5 transition"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
