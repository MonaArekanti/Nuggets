import { useCallback, useEffect, useState } from "react";
import { api, clearSession, getToken, getUser } from "../api";
import Icon from "../components/Icon";
import ProfileMenu from "../components/ProfileMenu";
import ProjectCard from "../components/ProjectCard";
import ProjectEditor from "../components/ProjectEditor";
import ConfirmDialog from "../components/ConfirmDialog";

export default function HomePage({ onNavigate = () => {} }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [editor, setEditor] = useState(null); // { project: obj | null }
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const user = getUser();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const notify = useCallback((text, type = "ok") => setToast({ text, type, id: Date.now() }), []);
  const logout = useCallback(() => { clearSession(); onNavigate("signin"); }, [onNavigate]);
  const fail = useCallback((e) => (e.status === 401 ? logout() : notify(e.message, "error")), [logout, notify]);

  useEffect(() => {
    if (!getToken()) return logout();
    api("/projects").then(setProjects)
      .catch((e) => (e.status === 401 ? logout() : setLoadErr(e.message)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { localStorage.setItem("theme", theme); }, [theme]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const onSaved = (p, msg, type) => {
    setProjects((x) => (x.some((a) => a._id === p._id) ? x.map((a) => (a._id === p._id ? p : a)) : [...x, p]));
    notify(msg, type);
  };

  const pin = async (p) => {
    try {
      const u = await api(`/projects/${p._id}`, { method: "PATCH", body: { pinned: !p.pinned } });
      setProjects((x) => x.map((a) => (a._id === u._id ? u : a)));
      notify(u.pinned ? "Project pinned." : "Project unpinned.");
    } catch (e) { fail(e); }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api(`/projects/${toDelete._id}`, { method: "DELETE" });
      setProjects((x) => x.filter((a) => a._id !== toDelete._id));
      notify("Project deleted.");
      setToDelete(null);
    } catch (e) { fail(e); } finally { setDeleting(false); }
  };

  // Pinned first; original (server) order kept inside each group.
  const ordered = [...projects.filter((p) => p.pinned), ...projects.filter((p) => !p.pinned)];

  return (
    <div className="home" data-theme={theme}>
      <div className="home-wrap">
        <header className="home-head">
          <ProfileMenu user={user} theme={theme} onTheme={setTheme} onLogout={logout} />
          <h1>Your Projects</h1>
          <button className="btn-new" aria-label="New Project" onClick={() => setEditor({ project: null })}>
            <Icon n="plus" size={18} /><span>New Project</span>
          </button>
        </header>

        {loading ? (
          <p className="muted">Loading your projects…</p>
        ) : loadErr ? (
          <div className="empty"><p>{loadErr}</p></div>
        ) : ordered.length === 0 ? (
          <div className="empty">
            <h2>No projects yet</h2>
            <p className="muted">Create your first project and start adding tasks.</p>
            <button className="btn-new" onClick={() => setEditor({ project: null })}>
              <Icon n="plus" size={18} />Create your first project
            </button>
          </div>
        ) : (
          <div className="grid">
            {ordered.map((p) => (
              <ProjectCard key={p._id} project={p} onOpen={(proj) => setEditor({ project: proj })}
                onPin={pin} onDelete={setToDelete} />
            ))}
          </div>
        )}
      </div>

      {editor && (
        <ProjectEditor key={editor.project?._id || "new"} project={editor.project}
          onClose={() => setEditor(null)} onSaved={onSaved} onError={fail} />
      )}
      {toDelete && (
        <ConfirmDialog title="Delete project?" confirmLabel="Delete" busy={deleting}
          text={`"${toDelete.name}" and all of its tasks will be permanently deleted.`}
          onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      )}
      {toast && <div className={"toast " + toast.type} role="status">{toast.text}</div>}
    </div>
  );
}
