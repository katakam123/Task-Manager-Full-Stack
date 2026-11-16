import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✓</span> TaskFlow</div>
        <nav className="side-nav">
          <NavLink to="/dashboard">Overview</NavLink>
          <NavLink to="/tasks">My tasks</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">{(user?.username || "U").slice(0, 1).toUpperCase()}</div>
            <div><strong>{user?.username}</strong><small>{user?.email}</small></div>
          </div>
          <button className="button button-ghost logout-button" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <span>Personal workspace</span>
          <span className="topbar-date">{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
        </header>
        <div className="content"><Outlet /></div>
      </main>
    </div>
  );
}
