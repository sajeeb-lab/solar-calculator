import Question from "../components/Question";
import { BRAND, STATES } from "../config";

/* Step 1 — pick a state. Auto-advances on click. */
const StepState = ({ onSelect }) => (
  <Question
    title="Instantly check your solar estimate & rebate"
    subtitle="Free energy savings report included"
  >
    <div
      style={{
        maxWidth: 520,
        margin: "44px auto 0",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {STATES.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="gl-statebtn"
          style={{
            width: "100%",
            padding: "18px 20px",
            fontSize: 17,
            fontWeight: 500,
            color: BRAND.ink,
            background: "#fff",
            border: `1.5px solid ${BRAND.line}`,
            borderRadius: 14,
            cursor: "pointer",
            transition: "all .15s ease",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          {s}
        </button>
      ))}
    </div>
  </Question>
);

export default StepState;
