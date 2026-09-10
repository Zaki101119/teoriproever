import { Header, Footer } from "@/components/Chrome";
import { getCategories, totalScenarios, totalOptions } from "@/lib/questions";
import { BuyButton } from "@/components/BuyButton";
import { HeroArt } from "@/components/HeroArt";
import Link from "next/link";

export default function Home() {
  const categories = getCategories();
  const scenarios = totalScenarios();
  const options = totalOptions();

  return (
    <>
      <Header />

      <section className="container hero hero-grid">
        <div className="hero-copy">
        <h1>Pass the Danish theory test the first time.</h1>
        <p className="lead">
          Realistic teoriprøve scenarios in clear English, each with an instant
          explanation of why the answer is right. Study every category, take full
          mock exams, and know when you&apos;re ready.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href="/quiz" className="btn">
            Try a free test
          </Link>
          <Link href="/#pricing" className="btn secondary">
            See full access
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="num">{scenarios}</div>
            <div className="lbl">practice scenarios</div>
          </div>
          <div className="stat">
            <div className="num">{options}+</div>
            <div className="lbl">answer options</div>
          </div>
          <div className="stat">
            <div className="num">{categories.length}</div>
            <div className="lbl">topics covered</div>
          </div>
        </div>
        </div>
        <HeroArt />
      </section>

      <hr className="lane-rule" />

      <section className="container section" id="categories">
        <h2>Every topic on the test</h2>
        <p className="sub">
          Practice one area at a time, or mix them in a full mock exam.
        </p>
        <div className="cat-grid">
          {categories.map((c) => (
            <div className="cat-cell" key={c.category}>
              <div className="name">{c.category}</div>
              <div className="meta">
                {c.questions.length} scenarios ·{" "}
                {c.questions.reduce((n, q) => n + q.subquestions.length, 0)} options
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container section" id="pricing">
        <h2>One price. Seven days. Everything unlocked.</h2>
        <p className="sub">
          No subscription, no auto-renewal. Study hard for a week and take your test.
        </p>
        <div className="price-card">
          <div className="price-tag">
            <span className="amount">50</span>
            <span className="unit">DKK / 7 days</span>
          </div>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Less than one-tenth of a failed-test fee.
          </p>
          <ul>
            <li>All {scenarios} scenarios across {categories.length} topics</li>
            <li>Full mock exams in test format</li>
            <li>Instant explanation on every question</li>
            <li>Works on phone, tablet and desktop</li>
            <li>7 days of unlimited practice</li>
          </ul>
          <BuyButton />
        </div>
      </section>

      <Footer />
    </>
  );
}
