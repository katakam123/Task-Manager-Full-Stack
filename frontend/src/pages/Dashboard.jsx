import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/")
      .then((response) => setStats(response.data))
      .catch((err) => setError(err.response?.data?.detail || "Could not load dashboard statistics."));
  }, []);

  return (
    <div>
      <div className="page-heading">
        <div><span className="eyebrow">YOUR WORKSPACE</span><h1>Overview</h1><p className="muted">A quick look at what you're working on.</p></div>
        <Link className="button button-primary" to="/tasks">+ Add a task</Link>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {!stats && !error ? <div className="panel loading-panel">Loading your dashboard...</div> : stats && <>
        <div className="stats-grid">
          <StatCard label="All tasks" value={stats.total_tasks} hint="Tasks in your workspace" />
          <StatCard label="To do" value={stats.pending_tasks} hint="Waiting to get started" tone="blue" />
          <StatCard label="In progress" value={stats.in_progress_tasks} hint="Currently underway" tone="amber" />
          <StatCard label="Completed" value={stats.completed_tasks} hint="Tasks you've finished" tone="green" />
        </div>
        <div className="dashboard-grid">
          <section className="panel progress-panel">
            <div className="panel-heading"><div><h2>Completion progress</h2><p className="muted">Your overall task completion</p></div><strong className="progress-number">{stats.completion_percentage ?? 0}%</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, Number(stats.completion_percentage) || 0)}%` }} /></div>
            <div className="progress-foot"><span>{stats.completed_tasks} completed</span><span>{stats.total_tasks} total tasks</span></div>
          </section>
          <section className="panel">
            <div className="panel-heading"><div><h2>Needs attention</h2><p className="muted">Tasks to keep an eye on</p></div></div>
            <div className="attention-row"><span className="attention-dot overdue" />Overdue tasks<strong>{stats.overdue_tasks}</strong></div>
            <div className="attention-row"><span className="attention-dot today" />Due today<strong>{stats.due_today_tasks}</strong></div>
          </section>
          <section className="panel priority-panel">
            <div className="panel-heading"><div><h2>Priority breakdown</h2><p className="muted">Tasks by priority</p></div></div>
            <div className="priority-row"><span className="priority-pill priority-high">High</span><strong>{stats.priority_summary?.high ?? 0}</strong></div>
            <div className="priority-row"><span className="priority-pill priority-medium">Medium</span><strong>{stats.priority_summary?.medium ?? 0}</strong></div>
            <div className="priority-row"><span className="priority-pill priority-low">Low</span><strong>{stats.priority_summary?.low ?? 0}</strong></div>
          </section>
          <section className="panel quick-panel">
            <div className="panel-heading"><div><h2>Quick actions</h2><p className="muted">Keep your workspace moving</p></div></div>
            <Link to="/tasks" className="quick-link"><span>＋</span><div><strong>Manage tasks</strong><small>Create, update and organize tasks</small></div><b>→</b></Link>
            <Link to="/categories" className="quick-link"><span>◈</span><div><strong>Manage categories</strong><small>Group tasks your way</small></div><b>→</b></Link>
          </section>
        </div>
      </>}
    </div>
  );
}
