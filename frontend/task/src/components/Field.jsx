import { useState } from "react";

export default function Field({ label, type = "text", autoComplete, value, onChange, error, password = false }) {
  const [show, setShow] = useState(false);

  return (
    <label className="field">
      <span>{label}</span>
      <div className={"box" + (error ? " bad" : "")}>
        <input
          type={password ? (show ? "text" : "password") : type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
        />
        {password && (
          <button type="button" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <small className="err">{error}</small>}
    </label>
  );
}