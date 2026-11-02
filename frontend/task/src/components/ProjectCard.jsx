import { useRef, useState } from "react";
import Icon from "./Icon";
import useOutside from "./useOutside";

export default function ProjectCard({ project, onOpen, onPin, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false), open);

  return (
    <article
      className="pcard"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => e.key === "Enter" && e.target === e.currentTarget && onOpen(project)}
    >
      {project.pinned && <span className="pinned" title="Pinned"><Icon n="pin" size={15} /></span>}
      <div className="menu-wrap" ref={ref} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn" aria-label="Project options" aria-haspopup="menu"
          aria-expanded={open} onClick={() => setOpen(!open)}>
          <Icon n="dots" />
        </button>
        {open && (
          <div className="dropdown" role="menu">
            <button role="menuitem" onClick={() => { setOpen(false); onPin(project); }}>
              <Icon n="pin" size={16} />{project.pinned ? "Unpin" : "Pin"}
            </button>
            <button role="menuitem" className="danger" onClick={() => { setOpen(false); onDelete(project); }}>
              <Icon n="trash" size={16} />Delete
            </button>
          </div>
        )}
      </div>
      <h3>{project.name}</h3>
    </article>
  );
}
