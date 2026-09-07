"use client";

import { useState } from "react";

export function BuyButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Could not start checkout. Try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="btn" onClick={handleBuy} disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
        {loading ? "Redirecting to payment…" : "Get 7-day access — 50 DKK"}
      </button>
      {error && (
        <p style={{ color: "var(--stop)", fontSize: 14, marginTop: 12 }}>{error}</p>
      )}
    </div>
  );
}
