import { useRef } from "react";
import useOutside from "./useOutside";

export default function ConfirmDialog({ title, text, confirmLabel = "Confirm", busy, onConfirm, onCancel }) {
  const ref = useRef(null);
  useOutside(ref, onCancel);
  return (
    <div className="backdrop" style={{ zIndex: 60 }}>
      <div className="dialog small" role="alertdialog" aria-modal="true" aria-labelledby="cd-title" ref={ref}>
        <h2 id="cd-title">{title}</h2>
        <p className="sub">{text}</p>
        <div className="actions">
          <button className="ghost" onClick={onCancel}>Cancel</button>
          <button className="cta danger-btn" disabled={busy} onClick={onConfirm}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
