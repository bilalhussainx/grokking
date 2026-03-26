// src/components/billing/PaddleCheckout.tsx
// Client component that initializes Paddle.js and opens the overlay checkout.
// Env (client-side): NEXT_PUBLIC_PADDLE_CLIENT_TOKEN, NEXT_PUBLIC_PADDLE_ENVIRONMENT
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useAuth } from "@/contexts/AuthContext";
import { Crown, Loader2 } from "lucide-react";

const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
const PADDLE_ENV = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox") as
  | "sandbox"
  | "production";

interface PaddleCheckoutProps {
  priceId: string;
  plan?: string;
  label?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PaddleCheckout({
  priceId,
  plan = "pro",
  label = "Upgrade to Pro",
  className,
  onSuccess,
  onError,
}: PaddleCheckoutProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const paddleRef = useRef<Paddle | null>(null);

  // Initialize Paddle.js on mount
  useEffect(() => {
    if (!PADDLE_CLIENT_TOKEN) return;

    initializePaddle({
      token: PADDLE_CLIENT_TOKEN,
      environment: PADDLE_ENV,
      eventCallback: (event) => {
        if (event.name === "checkout.completed") {
          onSuccess?.();
        }
        if (event.name === "checkout.error") {
          onError?.("Checkout failed. Please try again.");
        }
      },
    }).then((instance) => {
      if (instance) paddleRef.current = instance;
    });
  }, [onSuccess, onError]);

  const openCheckout = useCallback(async () => {
    if (!priceId) {
      onError?.("Price ID not configured.");
      return;
    }

    setLoading(true);

    try {
      const paddle = paddleRef.current;
      if (!paddle) {
        onError?.("Paddle not initialized. Check NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.");
        setLoading(false);
        return;
      }

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { userId: user?.id || "", plan },
        customer: user?.email ? { email: user.email } : undefined,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  }, [priceId, plan, user, onError]);

  return (
    <button
      onClick={openCheckout}
      disabled={loading || !PADDLE_CLIENT_TOKEN}
      className={
        className ||
        "w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm hover:from-violet-400 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Crown className="w-4 h-4" />
      )}
      {label}
    </button>
  );
}
