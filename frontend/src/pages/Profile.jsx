import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", first_name: "", last_name: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setForm({
      username: user.username || "",
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
    });
  }, [user]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setBusy(true);
    try {
      const response = await api.patch("/accounts/profile/", form);
      updateUser(response.data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : "Could not update profile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="page-heading"><div><span className="eyebrow">YOUR ACCOUNT</span><h1>Profile</h1><p className="muted">Manage your personal information.</p></div></div>
      <section className="panel profile-panel">
        <div className="profile-heading"><div className="profile-avatar">{(user?.username || "U").slice(0, 1).toUpperCase()}</div><div><h2>{user?.username}</h2><p className="muted">TaskFlow account</p></div></div>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form className="profile-form" onSubmit={submit}>
          <label>Username<input value={form.username} disabled /></label>
          <label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>First name<input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></label>
          <label>Last name<input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></label>
          <button className="button button-primary" disabled={busy}>{busy ? "Saving..." : "Save profile"}</button>
        </form>
        {user?.date_joined && <p className="muted joined-date">Member since {new Date(user.date_joined).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>}
      </section>
    </div>
  );
}
