"use client";

import { Header, Footer } from "@/components/Chrome";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function SuccessInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }
    fetch("/api/verify-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((d) => setStatus(d.hasAccess ? "ok" : "error"))
      .catch(() => setStatus("error"));
  }, [params]);

  return (
    <div className="container gate">
      {status === "checking" && <p>Confirming your payment…</p>}
      {status === "ok" && (
        <>
          <div className="result-score result-pass">You&apos;re in.</div>
          <p style={{ color: "var(--muted)", maxWidth: "40ch" }}>
            Full access is active for 7 days. Study every topic and take as many
            mock exams as you like.
          </p>
          <button className="btn" onClick={() => router.push("/quiz")}>
            Start practicing
          </button>
        </>
      )}
      {status === "error" && (
        <>
          <div className="result-score result-fail">Something went wrong</div>
          <p style={{ color: "var(--muted)", maxWidth: "40ch" }}>
            We couldn&apos;t confirm your payment. If you were charged, contact
            support and we&apos;ll sort it out.
          </p>
          <button className="btn secondary" onClick={() => router.push("/")}>
            Back to home
          </button>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container gate">Loading…</div>}>
        <SuccessInner />
      </Suspense>
      <Footer />
    </>
  );
}
