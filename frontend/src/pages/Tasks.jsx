import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { title: "", description: "", category: "", priority: "medium", due_date: "", status: "pending" };

function localDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

function displayDate(value) {
  if (!value) return "No due date";
  return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadTasks = useCallback(async () => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => { if (value) params[key] = value; });
    const response = await api.get("/tasks/", { params });
    setTasks(response.data.results || response.data);
  }, [filters]);

  const loadCategories = useCallback(async () => {
    const response = await api.get("/categories/");
    setCategories(response.data.results || response.data);
  }, []);

  useEffect(() => {
    loadCategories().catch(() => setError("Could not load categories."));
  }, [loadCategories]);

  useEffect(() => {
    loadTasks().catch((err) => setError(err.response?.data?.detail || "Could not load tasks."));
  }, [loadTasks]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    const payload = {
      ...form,
      category: form.category || null,
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
    };
    try {
      if (editingId) await api.patch(`/tasks/${editingId}/`, payload);
      else await api.post("/tasks/", payload);
      resetForm();
      await loadTasks();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : "Could not save task.");
    } finally {
      setBusy(false);
    }
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setForm({
      title: task.title || "",
      description: task.description || "",
      category: task.category || "",
      priority: task.priority || "medium",
      due_date: localDateTime(task.due_date),
      status: task.status || "pending",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task? This action cannot be undone.")) return;
    try {
      await api.delete(`/tasks/${id}/`);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not delete task.");
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await api.patch(`/tasks/${task.id}/`, { status });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update task status.");
    }
  };

  return (
    <div>
      <div className="page-heading"><div><span className="eyebrow">STAY ON TRACK</span><h1>My tasks</h1><p className="muted">Plan, prioritize and complete your work.</p></div></div>
      {error && <div className="alert alert-error">{error}<button className="alert-close" onClick={() => setError("")}>×</button></div>}
      <section className="panel form-panel">
        <div className="panel-heading"><div><h2>{editingId ? "Edit task" : "Create a task"}</h2><p className="muted">{editingId ? "Update the details below." : "Add a new item to your task list."}</p></div></div>
        <form onSubmit={submit} className="task-form">
          <label className="field-wide">Task title<input name="title" value={form.title} onChange={change} placeholder="What needs to get done?" required maxLength={255} /></label>
          <label className="field-wide">Description<textarea name="description" value={form.description} onChange={change} placeholder="Add more details (optional)" rows="2" /></label>
          <label>Category<select name="category" value={form.category} onChange={change}><option value="">No category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label>Priority<select name="priority" value={form.priority} onChange={change}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          <label>Due date<input type="datetime-local" name="due_date" value={form.due_date} onChange={change} /></label>
          <label>Status<select name="status" value={form.status} onChange={change}><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></label>
          <div className="form-actions field-wide"><button className="button button-primary" disabled={busy}>{busy ? "Saving..." : editingId ? "Save changes" : "Add task"}</button>{editingId && <button type="button" className="button button-secondary" onClick={resetForm}>Cancel</button>}</div>
        </form>
      </section>

      <section className="panel list-panel">
        <div className="panel-heading"><div><h2>Your task list</h2><p className="muted">{tasks.length} task(s) shown</p></div></div>
        <div className="filter-bar">
          <input aria-label="Search tasks" placeholder="Search tasks..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select aria-label="Filter by status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select>
          <select aria-label="Filter by priority" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}><option value="">All priorities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
          <button className="button button-secondary" onClick={() => setFilters({ status: "", priority: "", search: "" })}>Clear</button>
        </div>
        {tasks.length === 0 ? <div className="empty-state"><div className="empty-icon">✓</div><h3>No tasks found</h3><p>Create a task above or change your filters.</p></div> :
          <div className="task-list">{tasks.map((task) => (
            <article className={`task-item ${task.status === "completed" ? "task-done" : ""}`} key={task.id}>
              <button className={`task-check ${task.status === "completed" ? "checked" : ""}`} title="Mark completed" onClick={() => updateStatus(task, task.status === "completed" ? "pending" : "completed")}>{task.status === "completed" ? "✓" : ""}</button>
              <div className="task-main">
                <div className="task-title-line"><h3>{task.title}</h3><span className={`priority-pill priority-${task.priority}`}>{task.priority}</span></div>
                {task.description && <p className="task-description">{task.description}</p>}
                <div className="task-meta"><span>{task.category_name || "Uncategorized"}</span><span>{displayDate(task.due_date)}</span><span className={`status-text status-${task.status}`}>{task.status.replace("_", " ")}</span></div>
              </div>
              <div className="task-actions"><button onClick={() => editTask(task)}>Edit</button><button className="danger-text" onClick={() => deleteTask(task.id)}>Delete</button></div>
            </article>
          ))}</div>}
      </section>
    </div>
  );
}
