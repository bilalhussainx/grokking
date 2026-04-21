"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntakePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?coach=open");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
    </div>
  );
}
