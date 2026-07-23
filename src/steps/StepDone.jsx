import Question from "../components/Question";
import { BRAND } from "../config";

/* Placeholder end screen — replaced by the results page in the next phase. */
const StepDone = () => (
  <Question
    title="Thanks — your estimate is on its way"
    subtitle="Results screen coming in the next build phase."
  >
    <div style={{ marginTop: 36 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" className="gl-pop">
        <circle cx="36" cy="36" r="36" fill={BRAND.mint} />
        <path
          d="M22 37.5l10 10L51 27"
          stroke={BRAND.headerBg}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </Question>
);

export default StepDone;
