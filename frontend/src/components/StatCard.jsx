export default function StatCard({ label, value, hint, tone = "indigo" }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value ?? 0}</strong>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  );
}
