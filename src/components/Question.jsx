import { BRAND } from "../config";

/* Shared step layout: headline + optional subtitle + content. */
const Question = ({ title, subtitle, children }) => (
  <div className="gl-step">
    <h1
      style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 700,
        color: BRAND.ink,
        fontSize: "clamp(26px, 4vw, 40px)",
        margin: "0 0 10px",
        lineHeight: 1.15,
      }}
    >
      {title}
    </h1>
    {subtitle && (
      <p style={{ color: BRAND.soft, fontSize: 17, margin: "0 0 8px" }}>{subtitle}</p>
    )}
    {children}
  </div>
);

export default Question;
