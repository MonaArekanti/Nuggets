import { useRef, useState } from "react";
import Icon from "./Icon";
import useOutside from "./useOutside";

function SettingsDialog({ user, theme, onTheme, onClose }) {
  const ref = useRef(null);
  useOutside(ref, onClose);
  return (
    <div className="backdrop">
      <div className="dialog small" role="dialog" aria-modal="true" aria-labelledby="set-title" ref={ref}>
        <h2 id="set-title">Settings</h2>
        <p className="sub">{user?.name || "Your account"}{user?.email ? ` · ${user.email}` : ""}</p>
        <span className="lbl">Theme</span>
        <div className="seg">
          {["dark", "light"].map((t) => (
            <button key={t} className={theme === t ? "on" : ""} onClick={() => onTheme(t)}>
              {t === "dark" ? "Dark" : "Light"}
            </button>
          ))}
        </div>
        <div className="actions"><button className="ghost" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}

export default function ProfileMenu({ user, theme, onTheme, onLogout }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false), open);

  return (
    <>
      <div className="menu-wrap" ref={ref}>
        <button className="avatar" aria-label="Profile menu" aria-haspopup="menu"
          aria-expanded={open} onClick={() => setOpen(!open)}>
          {(user?.name || user?.email || "?")[0].toUpperCase()}
        </button>
        {open && (
          <div className="dropdown left" role="menu">
            <div className="info">
              <strong>{user?.name || "Your account"}</strong>
              {user?.email && <small>{user.email}</small>}
            </div>
            <button role="menuitem" onClick={() => { setOpen(false); setSettings(true); }}>
              <Icon n="settings" size={16} />Settings
            </button>
            <button role="menuitem" onClick={() => onTheme(theme === "dark" ? "light" : "dark")}>
              <Icon n={theme === "dark" ? "sun" : "moon"} size={16} />
              {theme === "dark" ? "Light theme" : "Dark theme"}
            </button>
            <button role="menuitem" className="danger" onClick={onLogout}>
              <Icon n="logout" size={16} />Log out
            </button>
          </div>
        )}
      </div>
      {settings && <SettingsDialog user={user} theme={theme} onTheme={onTheme} onClose={() => setSettings(false)} />}
    </>
  );
}
