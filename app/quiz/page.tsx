"use client";

import { Header, Footer } from "@/components/Chrome";
import { useEffect, useMemo, useState } from "react";
import bank from "@/data/questions.json";
import Link from "next/link";

interface SubQuestion { text: string; answer: boolean; explanation?: string; }
interface Scenario { id: string; scenario: string; image?: string; imageAlt?: string; subquestions: SubQuestion[]; }
interface Category { category: string; questions: Scenario[]; }
interface Bank { categories: Category[]; }

const typedBank = bank as unknown as Bank;

const FREE_LIMIT = 5; // scenarios available without paying
const EXAM_SIZE = 25;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/verify-access")
      .then((r) => r.json())
      .then((d) => setHasAccess(!!d.hasAccess))
      .catch(() => setHasAccess(false));
  }, []);

  const allScenarios = useMemo(
    () => typedBank.categories.flatMap((c) => c.questions),
    []
  );

  const exam = useMemo(() => {
    const pool = shuffle(allScenarios);
    return hasAccess ? pool.slice(0, EXAM_SIZE) : pool.slice(0, FREE_LIMIT);
  }, [allScenarios, hasAccess]);

  if (hasAccess === null) {
    return (
      <>
        <Header />
        <div className="container gate">Loading…</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Exam scenarios={exam} isFree={!hasAccess} />
      <Footer />
    </>
  );
}

function Exam({ scenarios, isFree }: { scenarios: Scenario[]; isFree: boolean }) {
  const [idx, setIdx] = useState(0);
  // answers[scenarioIdx][subIdx] = boolean chosen
  const [answers, setAnswers] = useState<Record<number, Record<number, boolean>>>({});
  const [finished, setFinished] = useState(false);

  const current = scenarios[idx];
  const progress = ((idx + 1) / scenarios.length) * 100;

  function choose(subIdx: number, value: boolean) {
    setAnswers((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), [subIdx]: value },
    }));
  }

  function score() {
    let correct = 0;
    let total = 0;
    scenarios.forEach((s, si) => {
      s.subquestions.forEach((sq, qi) => {
        total++;
        if (answers[si]?.[qi] === sq.answer) correct++;
      });
    });
    return { correct, total };
  }

  if (finished) {
    const { correct, total } = score();
    const pct = Math.round((correct / total) * 100);
    // Danish test: max 5 wrong of 25 → 80% pass threshold
    const passed = pct >= 80;
    return (
      <div className="container quiz-wrap">
        <div className="result-card">
          <div className={`result-score ${passed ? "result-pass" : "result-fail"}`}>
            {pct}%
          </div>
          <p style={{ fontSize: 18, margin: "8px 0 4px" }}>
            {correct} of {total} answers correct
          </p>
          <p style={{ color: "var(--muted)" }}>
            {passed
              ? "That's a pass. Keep practicing to stay sharp."
              : "Not a pass yet — review the explanations and try again."}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => window.location.reload()}>
              New test
            </button>
            {isFree && (
              <Link href="/#pricing" className="btn secondary">
                Unlock all topics
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const answeredCurrent =
    current.subquestions.every((_, qi) => answers[idx]?.[qi] !== undefined);

  return (
    <div className="container quiz-wrap">
      {isFree && (
        <div
          style={{
            background: "rgba(242,183,5,0.1)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 24,
            fontSize: 14,
            color: "var(--muted)",
          }}
        >
          Free preview — {scenarios.length} scenarios.{" "}
          <Link href="/#pricing" style={{ color: "var(--lane)", fontWeight: 700 }}>
            Get 7-day access for 50 DKK
          </Link>{" "}
          for the full exam.
        </div>
      )}

      <div className="progress">
        <div className="bar" style={{ width: `${progress}%` }} />
      </div>

      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 12 }}>
        Scenario {idx + 1} of {scenarios.length}
      </p>

      <div className="scenario-card">
        {current.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.image}
            alt={current.imageAlt || "Traffic situation"}
            className="scenario-image"
          />
        )}
        <p className="scenario-text">{current.scenario}</p>

        {current.subquestions.map((sq, qi) => {
          const chosen = answers[idx]?.[qi];
          const showResult = chosen !== undefined;
          return (
            <div className="subq" key={qi}>
              <div className="q">{sq.text}</div>
              <div className="tf-row">
                {[true, false].map((val) => {
                  const isChosen = chosen === val;
                  let cls = "tf-btn";
                  if (showResult) {
                    if (val === sq.answer) cls += " correct";
                    else if (isChosen) cls += " wrong";
                  } else if (isChosen) {
                    cls += " chosen";
                  }
                  return (
                    <button
                      key={String(val)}
                      className={cls}
                      onClick={() => !showResult && choose(qi, val)}
                      disabled={showResult}
                    >
                      {val ? "True" : "False"}
                    </button>
                  );
                })}
              </div>
              {showResult && sq.explanation && (
                <div className="explanation">{sq.explanation}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="quiz-nav">
        <button
          className="btn secondary"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
        >
          Previous
        </button>
        {idx < scenarios.length - 1 ? (
          <button
            className="btn"
            onClick={() => setIdx((i) => i + 1)}
            disabled={!answeredCurrent}
          >
            Next scenario
          </button>
        ) : (
          <button
            className="btn"
            onClick={() => setFinished(true)}
            disabled={!answeredCurrent}
          >
            See result
          </button>
        )}
      </div>
    </div>
  );
}
