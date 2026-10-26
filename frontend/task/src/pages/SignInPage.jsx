
import { useState } from "react";
import AuthAside from "../components/AuthAside";
import Field from "../components/Field";

export default function SignInPage({ onNavigate = () => {} }) {
  const [f, setF] = useState({
    email: "",
    password: "",
  });

  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    setF({ ...f, [key]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!f.password) {
      errors.password = "Enter your password.";
    }

    setErrs(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(f),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Invalid email or password."
        );
      }

      // Navigate to Home only after successful login.
      setF({
        email: "",
        password: "",
      });

      setErrs({});
      onNavigate("home");
    } catch (error) {
      setErrs({
        general:
          error.message === "Failed to fetch"
            ? "Cannot connect to the server. Please try again."
            : error.message,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="shell">
      <AuthAside headline="Your tasks are waiting." />

      <main className="main">
        <form
          className="panel"
          onSubmit={submit}
          noValidate
        >
          <button
            type="button"
            className="back"
            onClick={() => onNavigate("welcome")}
          >
            ← Back
          </button>

          <span className="brand">Nuggets</span>

          <h1>Welcome back</h1>
          <p className="sub">
            Sign in to pick up where you left off.
          </p>

          <Field
            label="Email"
            type="email"
            autoComplete="email"
            value={f.email}
            onChange={set("email")}
            error={errs.email}
          />

          <Field
            label="Password"
            password
            autoComplete="current-password"
            value={f.password}
            onChange={set("password")}
            error={errs.password}
          />

          {errs.general && (
            <p className="error" role="alert">
              {errs.general}
            </p>
          )}

          <button className="cta" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>

          <p className="swap">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("signup")}
            >
              Sign up
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}
