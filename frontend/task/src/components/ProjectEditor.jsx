// import { useEffect, useState } from "react";
// import { api } from "../api";
// import Field from "./Field";
// import Icon from "./Icon";
// import ConfirmDialog from "./ConfirmDialog";

// const uid = () => "tmp" + Math.random().toString(36).slice(2);

// // One editor, two views (modal / full page). State lives here, so expanding never loses work.
// // project === null  -> new project: tasks stay local until "Create project".
// // project !== null  -> existing project: task changes are saved to the API immediately.
// export default function ProjectEditor({ project, onClose, onSaved, onError }) {
//   const [expanded, setExpanded] = useState(false);
//   const [name, setName] = useState(project?.name || "");
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(!!project);
//   const [newTask, setNewTask] = useState("");
//   const [editing, setEditing] = useState(null);
//   const [err, setErr] = useState({});
//   const [busy, setBusy] = useState(false);
//   const [discard, setDiscard] = useState(false);

//   useEffect(() => {
//     if (!project) return;
//     api(`/tasks/project/${project._id}`).then(setTasks).catch(onError).finally(() => setLoading(false));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [project?._id]);

//   const dirty = project ? name.trim() !== project.name : !!(name.trim() || tasks.length);
//   const requestClose = () => (dirty ? setDiscard(true) : onClose());

//   useEffect(() => {
//     if (discard) return;
//     const key = (e) => {
//       if (e.key !== "Escape") return;
//       if (expanded) setExpanded(false);
//       else requestClose();
//     };
//     document.addEventListener("keydown", key);
//     return () => document.removeEventListener("keydown", key);
//   });

//   const done = (t) => t.status === "completed";
//   const sorted = [...tasks.filter((t) => !done(t)), ...tasks.filter(done)];

//   const addTask = async () => {
//     const text = newTask.trim();
//     if (!text) return setErr({ task: "Enter a task name." });
//     setErr({});
//     if (!project) {
//       setTasks((x) => [...x, { _id: uid(), name: text, status: "pending" }]);
//       return setNewTask("");
//     }
//     try {
//       const t = await api("/tasks", { method: "POST", body: { name: text, projectID: project._id } });
//       setTasks((x) => [...x, t]);
//       setNewTask("");
//     } catch (e) { onError(e); }
//   };

//   const update = async (t, patch) => {
//     if (!project) return setTasks((x) => x.map((a) => (a._id === t._id ? { ...a, ...patch } : a)));
//     try {
//       const u = await api(`/tasks/${t._id}`, { method: "PATCH", body: patch });
//       setTasks((x) => x.map((a) => (a._id === t._id ? u : a)));
//     } catch (e) { onError(e); }
//   };

//   const remove = async (t) => {
//     if (!project) return setTasks((x) => x.filter((a) => a._id !== t._id));
//     try {
//       await api(`/tasks/${t._id}`, { method: "DELETE" });
//       setTasks((x) => x.filter((a) => a._id !== t._id));
//     } catch (e) { onError(e); }
//   };

//   const toggle = (t) => update(t, { status: done(t) ? "pending" : "completed" });

//   const commitEdit = (t) => {
//     const text = editing?.text.trim();
//     setEditing(null);
//     if (text && text !== t.name) update(t, { name: text });
//   };

//   const save = async () => {
//     if (!name.trim()) return setErr({ name: "Give your project a name." });
//     setBusy(true);
//     setErr({});
//     try {
//       if (!project) {
//         const p = await api("/projects", { method: "POST", body: { name: name.trim() } });
//         let failed = 0;
//         for (const t of tasks) {
//           try { await api("/tasks", { method: "POST", body: { name: t.name, status: t.status, projectID: p._id } }); }
//           catch { failed++; }
//         }
//         onSaved(p, failed ? `Project created, but ${failed} task(s) failed to save.` : "Project created.", failed ? "error" : "ok");
//       } else if (name.trim() !== project.name) {
//         const p = await api(`/projects/${project._id}`, { method: "PATCH", body: { name: name.trim() } });
//         onSaved(p, "Project updated.");
//       }
//       onClose();
//     } catch (e) {
//       if (e.status === 401) onError(e);
//       else setErr({ form: e.message });
//     } finally { setBusy(false); }
//   };

//   return (
//     <div className={"backdrop" + (expanded ? " full" : "")}
//       onMouseDown={(e) => e.target === e.currentTarget && !expanded && requestClose()}>
//       <section className={"dialog editor" + (expanded ? " full" : "")} role="dialog" aria-modal="true" aria-labelledby="ed-title">
//         <header className="ed-head">
//           <button className="icon-btn" aria-label={expanded ? "Back to window view" : "Close"}
//             onClick={expanded ? () => setExpanded(false) : requestClose}>
//             <Icon n="back" />
//           </button>
//           <h2 id="ed-title">{project ? "Project Details" : "New Project"}</h2>
//           <button className="icon-btn push" aria-label={expanded ? "Exit full page" : "Expand to full page"}
//             onClick={() => setExpanded(!expanded)}>
//             <Icon n={expanded ? "shrink" : "expand"} />
//           </button>
//         </header>

//         <div className="ed-body">
//           <Field label="Project name" value={name} onChange={(e) => setName(e.target.value)} error={err.name} />

//           <form className="add-row" onSubmit={(e) => { e.preventDefault(); addTask(); }}>
//             <div className={"box" + (err.task ? " bad" : "")}>
//               <input placeholder="Add a task" aria-label="New task" value={newTask}
//                 onChange={(e) => setNewTask(e.target.value)} />
//             </div>
//             <button className="ghost with-icon"><Icon n="plus" size={18} />Add task</button>
//           </form>
//           {err.task && <small className="err">{err.task}</small>}

//           {loading ? (
//             <p className="muted">Loading tasks…</p>
//           ) : sorted.length === 0 ? (
//             <p className="muted">Tasks will appear here as you add them.</p>
//           ) : (
//             <ul className="tasks">
//               {sorted.map((t) => (
//                 <li key={t._id} className={done(t) ? "done" : ""}>
//                   <input type="checkbox" checked={done(t)} onChange={() => toggle(t)}
//                     aria-label={`Mark "${t.name}" as ${done(t) ? "not completed" : "completed"}`} />
//                   {editing?.id === t._id ? (
//                     <input className="edit-in" autoFocus value={editing.text} aria-label="Edit task"
//                       onChange={(e) => setEditing({ ...editing, text: e.target.value })}
//                       onBlur={() => commitEdit(t)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") commitEdit(t);
//                         if (e.key === "Escape") { e.stopPropagation(); setEditing(null); }
//                       }} />
//                   ) : <span>{t.name}</span>}
//                   <button className="icon-btn" aria-label={`Edit "${t.name}"`}
//                     onClick={() => setEditing({ id: t._id, text: t.name })}><Icon n="edit" size={16} /></button>
//                   <button className="icon-btn" aria-label={`Delete "${t.name}"`}
//                     onClick={() => remove(t)}><Icon n="trash" size={16} /></button>
//                 </li>
//               ))}
//             </ul>
//           )}

//           {err.form && <small className="err">{err.form}</small>}
//           <div className="actions">
//             <button className="ghost" onClick={requestClose}>{project ? "Close" : "Cancel"}</button>
//             <button className="cta" disabled={busy} onClick={save}>
//               {busy ? "Saving…" : project ? "Save changes" : "Create project"}
//             </button>
//           </div>
//         </div>
//       </section>

//       {discard && (
//         <ConfirmDialog title="Discard changes?" text="Your unsaved changes will be lost."
//           confirmLabel="Discard" onConfirm={onClose} onCancel={() => setDiscard(false)} />
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { api } from "../api";
import Field from "./Field";
import Icon from "./Icon";
import ConfirmDialog from "./ConfirmDialog";

const uid = () => "tmp" + Math.random().toString(36).slice(2);

// One editor, two views (modal / full page). State lives here, so expanding never loses work.
// project === null  -> new project: tasks stay local until "Create project".
// project !== null  -> existing project: task changes are saved to the API immediately.
export default function ProjectEditor({ project, onClose, onSaved, onError }) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState(project?.name || "");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(!!project);
  const [newTask, setNewTask] = useState("");
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [discard, setDiscard] = useState(false);

  useEffect(() => {
    if (!project) return;
    api(`/tasks/project/${project._id}`).then(setTasks).catch(onError).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?._id]);

  const dirty = project ? name.trim() !== project.name : !!(name.trim() || tasks.length);
  const requestClose = () => (dirty ? setDiscard(true) : onClose());

  useEffect(() => {
    if (discard) return;
    const key = (e) => {
      if (e.key !== "Escape") return;
      if (expanded) setExpanded(false);
      else requestClose();
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  });

  const done = (t) => t.status === "completed";
  const sorted = [...tasks.filter((t) => !done(t)), ...tasks.filter(done)];

  const addTask = async () => {
    const text = newTask.trim();
    if (!text) return setErr({ task: "Enter a task name." });
    setErr({});
    if (!project) {
      setTasks((x) => [...x, { _id: uid(), name: text, status: "pending" }]);
      return setNewTask("");
    }
    try {
      const t = await api("/tasks", { method: "POST", body: { name: text, projectID: project._id } });
      setTasks((x) => [...x, t]);
      setNewTask("");
    } catch (e) { onError(e); }
  };

  const update = async (t, patch) => {
    if (!project) return setTasks((x) => x.map((a) => (a._id === t._id ? { ...a, ...patch } : a)));
    try {
      const u = await api(`/tasks/${t._id}`, { method: "PATCH", body: patch });
      setTasks((x) => x.map((a) => (a._id === t._id ? u : a)));
    } catch (e) { onError(e); }
  };

  const remove = async (t) => {
    if (!project) return setTasks((x) => x.filter((a) => a._id !== t._id));
    try {
      await api(`/tasks/${t._id}`, { method: "DELETE" });
      setTasks((x) => x.filter((a) => a._id !== t._id));
    } catch (e) { onError(e); }
  };

  const toggle = (t) => update(t, { status: done(t) ? "pending" : "completed" });

  const commitEdit = (t) => {
    const text = editing?.text.trim();
    setEditing(null);
    if (text && text !== t.name) update(t, { name: text });
  };

  const save = async () => {
    if (!name.trim()) return setErr({ name: "Give your project a name." });
    setBusy(true);
    setErr({});
    try {
      if (!project) {
        const p = await api("/projects", { method: "POST", body: { name: name.trim() } });
        let failed = 0;
        for (const t of tasks) {
          try { await api("/tasks", { method: "POST", body: { name: t.name, status: t.status, projectID: p._id } }); }
          catch { failed++; }
        }
        onSaved(p, failed ? `Project created, but ${failed} task(s) failed to save.` : "Project created.", failed ? "error" : "ok");
      } else if (name.trim() !== project.name) {
        const p = await api(`/projects/${project._id}`, { method: "PATCH", body: { name: name.trim() } });
        onSaved(p, "Project updated.");
      }
      onClose();
    } catch (e) {
      if (e.status === 401) onError(e);
      else setErr({ form: e.message });
    } finally { setBusy(false); }
  };

  return (
    <div className={"backdrop" + (expanded ? " full" : "")}
      onMouseDown={(e) => e.target === e.currentTarget && !expanded && requestClose()}>
      <section className={"dialog editor" + (expanded ? " full" : "")} role="dialog" aria-modal="true" aria-labelledby="ed-title">
        <header className="ed-head">
          {expanded && (
            <button className="icon-btn" aria-label="Back to window view" onClick={() => setExpanded(false)}>
              <Icon n="back" />
            </button>
          )}
          <h2 id="ed-title">{project ? "Project Details" : "New Project"}</h2>
          <button className="icon-btn push" aria-label={expanded ? "Exit full page" : "Expand to full page"}
            onClick={() => setExpanded(!expanded)}>
            <Icon n={expanded ? "shrink" : "expand"} />
          </button>
        </header>

        <div className="ed-body">
          <Field label="Project name" value={name} onChange={(e) => setName(e.target.value)} error={err.name} />

          <form className="add-row" onSubmit={(e) => { e.preventDefault(); addTask(); }}>
            <div className={"box" + (err.task ? " bad" : "")}>
              <input placeholder="Add a task" aria-label="New task" value={newTask}
                onChange={(e) => setNewTask(e.target.value)} />
              <button className="send" aria-label="Add task"><Icon n="arrowUp" size={18} /></button>
            </div>
          </form>
          {err.task && <small className="err">{err.task}</small>}

          {loading ? (
            <p className="muted">Loading tasks…</p>
          ) : sorted.length === 0 ? (
            <p className="muted">Tasks will appear here as you add them.</p>
          ) : (
            <ul className="tasks">
              {sorted.map((t) => (
                <li key={t._id} className={done(t) ? "done" : ""}>
                  <input type="checkbox" checked={done(t)} onChange={() => toggle(t)}
                    aria-label={`Mark "${t.name}" as ${done(t) ? "not completed" : "completed"}`} />
                  {editing?.id === t._id ? (
                    <input className="edit-in" autoFocus value={editing.text} aria-label="Edit task"
                      onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                      onBlur={() => commitEdit(t)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit(t);
                        if (e.key === "Escape") { e.stopPropagation(); setEditing(null); }
                      }} />
                  ) : <span>{t.name}</span>}
                  <button className="icon-btn" aria-label={`Edit "${t.name}"`}
                    onClick={() => setEditing({ id: t._id, text: t.name })}><Icon n="edit" size={16} /></button>
                  <button className="icon-btn" aria-label={`Delete "${t.name}"`}
                    onClick={() => remove(t)}><Icon n="trash" size={16} /></button>
                </li>
              ))}
            </ul>
          )}

          {err.form && <small className="err">{err.form}</small>}
          <div className="actions">
            <button className="ghost" onClick={requestClose}>{project ? "Close" : "Cancel"}</button>
            <button className="cta" disabled={busy} onClick={save}>
              {busy ? "Saving…" : project ? "Save changes" : "Create project"}
            </button>
          </div>
        </div>
      </section>

      {discard && (
        <ConfirmDialog title="Discard changes?" text="Your unsaved changes will be lost."
          confirmLabel="Discard" onConfirm={onClose} onCancel={() => setDiscard(false)} />
      )}
    </div>
  );
}