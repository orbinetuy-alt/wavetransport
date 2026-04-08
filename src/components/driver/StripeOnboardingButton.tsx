"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function StripeOnboardingButton() {
  const [loading, setLoading] = useState(false);

  async function handleOnboarding() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/onboard", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleOnboarding}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-60"
      style={{
        backgroundColor: "var(--color-brand-500)",
        color: "white",
      }}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <ArrowRight size={16} />
      )}
      {loading ? "Redirigiendo..." : "Completar verificación"}
    </button>
  );
}
