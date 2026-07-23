import { useState } from "react";
import Question from "../components/Question";
import PrimaryButton from "../components/PrimaryButton";
import { BRAND } from "../config";

/* Step 6 — lead capture.
   Every field is required. Email and phone must be valid to proceed:
   - email: standard name@domain.tld shape
   - phone: Australian format (the +61 prefix is shown), accepts
     9 digits (412 345 678) or 10 digits starting with 0 (0412 345 678)
   Errors appear under a field once it's been visited, and clicking the
   submit button with anything invalid reveals all remaining errors. */

const validators = {
  first: (v) => (v.trim() ? "" : "First name is required"),
  last: (v) => (v.trim() ? "" : "Last name is required"),
  email: (v) => {
    if (!v.trim()) return "Email is required";
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? ""
      : "Enter a valid email address";
  },
  phone: (v) => {
    if (!v.trim()) return "Phone number is required";
    const digits = v.replace(/\D/g, "");
    const ok =
      (digits.length === 9 && digits[0] !== "0") ||
      (digits.length === 10 && digits[0] === "0");
    return ok ? "" : "Enter a valid Australian phone number";
  },
  consent: (v) => (v ? "" : "Please tick the consent box to continue"),
};

const field = (hasError, extra = {}) => ({
  width: "100%",
  padding: "16px 18px",
  fontSize: 16,
  fontFamily: "'Manrope', sans-serif",
  color: BRAND.ink,
  border: `1.5px solid ${hasError ? "#D9534F" : BRAND.line}`,
  borderRadius: 12,
  outline: "none",
  background: "#fff",
  ...extra,
});

const ErrorText = ({ children }) =>
  children ? (
    <div style={{ color: "#D9534F", fontSize: 13, marginTop: 6, fontFamily: "'Manrope', sans-serif" }}>
      {children}
    </div>
  ) : null;

const StepLead = ({ onSubmit }) => {
  const [f, setF] = useState({ first: "", last: "", email: "", phone: "", consent: false });
  const [touched, setTouched] = useState({});

  const set = (k) => (e) =>
    setF({ ...f, [k]: k === "consent" ? e.target.checked : e.target.value });
  const touch = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const errors = Object.fromEntries(
    Object.keys(validators).map((k) => [k, validators[k](f[k])])
  );
  const isValid = Object.values(errors).every((e) => !e);
  const show = (k) => (touched[k] ? errors[k] : "");

  const handleSubmit = () => {
    if (!isValid) {
      /* reveal every remaining error */
      setTouched({ first: true, last: true, email: true, phone: true, consent: true });
      return;
    }
    onSubmit({ ...f, email: f.email.trim(), phone: f.phone.trim() });
  };

  return (
    <Question title="Your estimate and rebate will display on the next screen.">
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
          <div>
            <input
              placeholder="First name *"
              value={f.first}
              onChange={set("first")}
              onBlur={touch("first")}
              style={field(show("first"))}
            />
            <ErrorText>{show("first")}</ErrorText>
          </div>
          <div>
            <input
              placeholder="Last name *"
              value={f.last}
              onChange={set("last")}
              onBlur={touch("last")}
              style={field(show("last"))}
            />
            <ErrorText>{show("last")}</ErrorText>
          </div>
        </div>

        <div>
          <input
            placeholder="Email *"
            type="email"
            value={f.email}
            onChange={set("email")}
            onBlur={touch("email")}
            style={field(show("email"))}
          />
          <ErrorText>{show("email")}</ErrorText>
        </div>

        <div>
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
              placeholder="Phone number *"
              type="tel"
              value={f.phone}
              onChange={set("phone")}
              onBlur={touch("phone")}
              style={field(show("phone"), { paddingLeft: 86 })}
            />
          </div>
          <ErrorText>{show("phone")}</ErrorText>
        </div>

        <div>
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
              onChange={(e) => {
                set("consent")(e);
                setTouched((t) => ({ ...t, consent: true }));
              }}
              style={{ marginTop: 3, accentColor: BRAND.teal }}
            />
            <span>I agree to be contacted about my solar estimate and accept the privacy policy. *</span>
          </label>
          <ErrorText>{show("consent")}</ErrorText>
        </div>
      </div>

      <div style={{ marginTop: 44 }}>
        <PrimaryButton onClick={handleSubmit}>GET MY QUOTE NOW</PrimaryButton>
      </div>
    </Question>
  );
};

export default StepLead;
