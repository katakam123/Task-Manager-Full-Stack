import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F46E5");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await api.get("/categories/");
    setCategories(response.data.results || response.data);
  }, []);

  useEffect(() => {
    load().catch(() => setError("Could not load categories."));
  }, [load]);

  const reset = () => { setName(""); setColor("#4F46E5"); setEditingId(null); };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = { name: name.trim(), color };
      if (editingId) await api.patch(`/categories/${editingId}/`, payload);
      else await api.post("/categories/", payload);
      reset();
      await load();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : "Could not save category.");
    } finally {
      setBusy(false);
    }
  };

  const edit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setColor(category.color || "#4F46E5");
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category? Existing tasks will remain, without a category.")) return;
    try {
      await api.delete(`/categories/${id}/`);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not delete category.");
    }
  };

  return (
    <div>
      <div className="page-heading"><div><span className="eyebrow">KEEP THINGS ORGANIZED</span><h1>Categories</h1><p className="muted">Create labels to group related tasks.</p></div></div>
      {error && <div className="alert alert-error">{error}<button className="alert-close" onClick={() => setError("")}>×</button></div>}
      <section className="panel form-panel">
        <div className="panel-heading"><div><h2>{editingId ? "Edit category" : "Add a category"}</h2><p className="muted">Choose a name and a color for your category.</p></div></div>
        <form className="category-form" onSubmit={submit}>
          <label>Category name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Work, Personal, Study" required maxLength={100} /></label>
          <label className="color-field">Color<input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
          <div className="form-actions"><button className="button button-primary" disabled={busy}>{busy ? "Saving..." : editingId ? "Save changes" : "Add category"}</button>{editingId && <button type="button" className="button button-secondary" onClick={reset}>Cancel</button>}</div>
        </form>
      </section>
      <section className="category-grid">
        {categories.length === 0 ? <div className="panel empty-state"><h3>No categories yet</h3><p>Create your first category above.</p></div> : categories.map((category) => (
          <article className="panel category-card" key={category.id}>
            <div className="category-swatch" style={{ backgroundColor: category.color }} />
            <div className="category-info"><h3>{category.name}</h3><small>{category.color}</small></div>
            <div className="category-actions"><button onClick={() => edit(category)}>Edit</button><button className="danger-text" onClick={() => remove(category.id)}>Delete</button></div>
          </article>
        ))}
      </section>
    </div>
  );
}
