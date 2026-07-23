import { useEffect, useState } from "react";
import { BRAND } from "../config";

/* Reusable slider synced with a number input.
   - Small stacked ▲/▼ arrows inside the box (styled like the native ones),
     but ALWAYS incrementing/decrementing by exactly 1 while preserving
     decimals: 7.3 → ▲ → 8.3, ▼ → 6.3.
   - Typing is free: the value is only clamped when you leave the field,
     so entering "127" works normally (no mangling per keystroke). */

const Arrow = ({ dir, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={dir > 0 ? "Increase" : "Decrease"}
    tabIndex={-1}
    style={{
      border: "none",
      background: "transparent",
      cursor: disabled ? "default" : "pointer",
      padding: "1px 4px",
      lineHeight: 0,
      color: disabled ? "#C9D4D2" : BRAND.soft,
      display: "block",
    }}
  >
    <svg width="10" height="7" viewBox="0 0 10 7">
      <path
        d={dir > 0 ? "M1 6l4-4 4 4" : "M1 1l4 4 4-4"}
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const SliderInput = ({ min, max, step = 1, value, onChange, prefix, suffix }) => {
  const [text, setText] = useState(String(value));
  const pct = ((value - min) / (max - min)) * 100;
  const clamp = (n) => Math.min(max, Math.max(min, n));

  /* keep the text box in sync when the value changes from outside
     (slider drag or arrow clicks) */
  useEffect(() => {
    if (parseFloat(text) !== value) setText(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* arrows always move by exactly 1, preserving decimals */
  const nudge = (dir) => onChange(clamp(Math.round((value + dir) * 100) / 100));

  const handleType = (e) => {
    const t = e.target.value;
    if (!/^\d*\.?\d*$/.test(t)) return; // digits and one dot only
    const n = parseFloat(t);
    /* Block anything ABOVE the max immediately — extra digits can only make
       it bigger, so the keystroke is simply rejected (typing "31" on a 3–30
       range stops at "3"). Values BELOW the min are allowed while typing,
       because they may still grow into a valid number ("1" → "12"); they get
       clamped up to the min on blur if left short. */
    if (!isNaN(n) && n > max) return;
    setText(t);
    if (!isNaN(n) && n >= min) onChange(n); // live-sync slider while in range
  };

  const handleBlur = () => {
    const n = parseFloat(text);
    const finalValue = isNaN(n) ? value : clamp(n);
    onChange(finalValue);
    setText(String(finalValue));
  };

  return (
    <div style={{ maxWidth: 520, margin: "48px auto 0" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          border: `1.5px solid ${BRAND.line}`,
          borderRadius: 12,
          padding: "10px 16px",
          marginBottom: 34,
          background: "#fff",
          boxShadow: "0 2px 10px rgba(8,28,33,.05)",
        }}
      >
        {prefix && <span style={{ color: BRAND.soft, fontSize: 18 }}>{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={text}
          onChange={handleType}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") { e.preventDefault(); nudge(1); }
            if (e.key === "ArrowDown") { e.preventDefault(); nudge(-1); }
            if (e.key === "Enter") e.target.blur();
          }}
          style={{
            width: 84,
            border: "none",
            outline: "none",
            fontSize: 22,
            fontWeight: 600,
            color: BRAND.ink,
            fontFamily: "'Sora', sans-serif",
            textAlign: "center",
            background: "transparent",
          }}
        />
        <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Arrow dir={1} onClick={() => nudge(1)} disabled={value >= max} />
          <Arrow dir={-1} onClick={() => nudge(-1)} disabled={value <= min} />
        </span>
        {suffix && (
          <span style={{ color: BRAND.soft, fontSize: 16, fontWeight: 600 }}>{suffix}</span>
        )}
      </div>

      <div style={{ position: "relative", padding: "0 4px" }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="gl-range"
          style={{
            background: `linear-gradient(to right, ${BRAND.teal} 0%, ${BRAND.mint} ${pct}%, ${BRAND.line} ${pct}%)`,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
          color: BRAND.soft,
          fontSize: 14,
        }}
      >
        <span>
          {prefix}
          {min.toLocaleString()}
          {suffix ? ` ${suffix}` : ""}
        </span>
        <span>
          {prefix}
          {max.toLocaleString()}
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
    </div>
  );
};

export default SliderInput;
