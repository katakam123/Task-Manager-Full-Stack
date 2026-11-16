import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.username.trim(), form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to log in. Check your username and password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration">
        <div className="auth-brand"><span className="brand-mark">✓</span> TaskFlow</div>
        <div className="auth-promo">
          <span className="eyebrow">PLAN · FOCUS · FINISH</span>
          <h1>Make room for<br />your best work.</h1>
          <p>Organize your day, keep priorities clear, and make progress one task at a time.</p>
          <div className="promo-checks"><span>✓ Stay organized</span><span>✓ Track your progress</span><span>✓ Reach your goals</span></div>
        </div>
      </div>
      <div className="auth-panel">
        <form className="auth-form" onSubmit={submit}>
          <div className="mobile-brand"><span className="brand-mark">✓</span> TaskFlow</div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="muted">Enter your details to continue to your workspace.</p>
          {error && <div className="alert alert-error">{error}</div>}
          <label>Username<input name="username" value={form.username} onChange={change} placeholder="Your username" autoComplete="username" required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={change} placeholder="Your password" autoComplete="current-password" required /></label>
          <button className="button button-primary button-full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
          <p className="auth-switch">New to TaskFlow? <Link to="/register">Create an account</Link></p>
        </form>
      </div>
    </div>
  );
}
