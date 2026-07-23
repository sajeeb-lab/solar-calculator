import { useState } from "react";
import Question from "../components/Question";
import PrimaryButton from "../components/PrimaryButton";
import { BRAND } from "../config";

const field = (extra = {}) => ({
  width: "100%",
  padding: "16px 18px",
  fontSize: 16,
  fontFamily: "'Manrope', sans-serif",
  color: BRAND.ink,
  border: `1.5px solid ${BRAND.line}`,
  borderRadius: 12,
  outline: "none",
  background: "#fff",
  ...extra,
});

/* Step 6 — lead capture. Submit is disabled until every field is valid. */
const StepLead = ({ onSubmit }) => {
  const [f, setF] = useState({ first: "", last: "", email: "", phone: "", consent: false });
  const set = (k) => (e) =>
    setF({ ...f, [k]: k === "consent" ? e.target.checked : e.target.value });

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  const phoneOk = f.phone.replace(/\D/g, "").length >= 8;
  const valid = f.first.trim() && f.last.trim() && emailOk && phoneOk && f.consent;

  return (
    <Question title="Your estimate & rebate will display on the next screen">
      <div
        style={{
          maxWidth: 560,
          margin: "44px auto 0",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          textAlign: "left",
        }}
      >
        <div className="gl-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <input placeholder="First name" value={f.first} onChange={set("first")} style={field()} />
          <input placeholder="Last name" value={f.last} onChange={set("last")} style={field()} />
        </div>
        <input placeholder="Email" type="email" value={f.email} onChange={set("email")} style={field()} />
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 18,
              top: "50%",
              transform: "translateY(-50%)",
              color: BRAND.soft,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span role="img" aria-label="Australia">🇦🇺</span> +61
          </span>
          <input
            placeholder="Phone number"
            type="tel"
            value={f.phone}
            onChange={set("phone")}
            style={field({ paddingLeft: 86 })}
          />
        </div>
        <label
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            color: BRAND.soft,
            fontSize: 13.5,
            lineHeight: 1.5,
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          <input
            type="checkbox"
            checked={f.consent}
            onChange={set("consent")}
            style={{ marginTop: 3, accentColor: BRAND.teal }}
          />
          <span>I agree to be contacted about my solar estimate and accept the privacy policy.</span>
        </label>
      </div>
      <div style={{ marginTop: 44 }}>
        <PrimaryButton disabled={!valid} onClick={() => onSubmit(f)}>
          GET MY QUOTE NOW
        </PrimaryButton>
      </div>
    </Question>
  );
};

export default StepLead;
