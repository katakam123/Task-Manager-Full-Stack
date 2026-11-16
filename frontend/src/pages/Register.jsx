import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function getErrorMessage(data) {
  if (!data) return "Registration failed. Please try again.";
  if (typeof data === "string") return data;
  return Object.entries(data).map(([field, value]) => {
    const message = Array.isArray(value) ? value.join(" ") : String(value);
    return `${field.replaceAll("_", " ")}: ${message}`;
  }).join(" · ");
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm_password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await register(form);
      navigate("/login", { replace: true, state: { message: "Account created successfully. Please sign in." } });
    } catch (err) {
      setError(getErrorMessage(err.response?.data));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration">
        <div className="auth-brand"><span className="brand-mark">✓</span> TaskFlow</div>
        <div className="auth-promo">
          <span className="eyebrow">A CLEARER WAY TO WORK</span>
          <h1>Your goals,<br />within reach.</h1>
          <p>Create your personal workspace and bring all your tasks together in one simple place.</p>
          <div className="promo-checks"><span>✓ Simple task planning</span><span>✓ Your own categories</span><span>✓ Progress at a glance</span></div>
        </div>
      </div>
      <div className="auth-panel">
        <form className="auth-form" onSubmit={submit}>
          <div className="mobile-brand"><span className="brand-mark">✓</span> TaskFlow</div>
          <span className="eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="muted">A few details and your workspace is ready.</p>
          {error && <div className="alert alert-error">{error}</div>}
          <label>Username<input name="username" value={form.username} onChange={change} placeholder="Choose a username" autoComplete="username" required /></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={change} placeholder="Create a password" autoComplete="new-password" required /></label>
          <label>Confirm password<input name="confirm_password" type="password" value={form.confirm_password} onChange={change} placeholder="Enter password again" autoComplete="new-password" required /></label>
          <button className="button button-primary button-full" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button>
          <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
