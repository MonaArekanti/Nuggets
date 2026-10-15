import { useEffect, useState } from "react";

const QUOTES = [
  "Small tasks, done daily, add up to big wins.",
  "Clear the next step, not the whole mountain.",
  "A finished task is a nugget worth keeping.",
];

export default function WelcomePage({ onNavigate = () => {} }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % QUOTES.length), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="welcome">
      <div className="nug" /><div className="nug" /><div className="nug" /><div className="nug" />
      <section>
        <h1>Nuggets</h1>
        <div className="quote" aria-live="polite">
          <p key={i}>{QUOTES[i]}</p>
          <div className="dots">
            {QUOTES.map((_, n) => <i key={n} className={n === i ? "on" : ""} />)}
          </div>
        </div>
      </section>
      <button className="go" onClick={() => onNavigate("signin")}>
        <span aria-hidden>→</span>Get started
      </button>
    </main>
  );
}