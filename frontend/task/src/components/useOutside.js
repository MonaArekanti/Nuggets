import { useEffect } from "react";

// Calls fn when the user clicks outside ref or presses Escape.
export default function useOutside(ref, fn, active = true) {
  useEffect(() => {
    if (!active) return;
    const click = (e) => { if (!ref.current?.contains(e.target)) fn(); };
    const key = (e) => { if (e.key === "Escape") fn(); };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, [ref, fn, active]);
}
