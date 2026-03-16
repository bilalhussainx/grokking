"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Plus, ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AnimatedBlobs from "@/components/ui/AnimatedBlobs";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/create", label: "New Course", icon: Plus },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-[var(--background)]">
        <AnimatedBlobs intensity="low" />

        {/* Top Bar */}
        <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 bg-[var(--background)]/60 backdrop-blur-2xl border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-xs shadow-md shadow-blue-500/20">
                S
              </div>
              <span className="text-lg font-bold tracking-tight">Samsara.ai</span>
            </Link>

            <span className="text-white/20">/</span>

            <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Editor</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    active
                      ? "bg-blue-500/15 text-blue-400"
                      : "text-[var(--muted-foreground)] hover:bg-white/[0.06] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-[var(--muted-foreground)] hover:bg-white/[0.06] hover:text-[var(--foreground)] transition-colors ml-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to App
            </Link>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
