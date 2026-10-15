export default function AuthAside({ headline }) {
  return (
    <aside className="aside">
      <span className="brand">Nuggets</span>
      <h2>{headline}</h2>
      <div className="nug" />
      <div className="nug" />
    </aside>
  );
}