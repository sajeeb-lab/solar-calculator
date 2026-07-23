import { BRAND } from "../config";

const PrimaryButton = ({ children, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? "#E4EFE8" : BRAND.mint,
      color: disabled ? "#9AABAF" : BRAND.headerBg,
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: "0.06em",
      border: "none",
      borderRadius: 999,
      padding: "14px 40px",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "transform .15s ease, box-shadow .15s ease, background .2s",
      boxShadow: disabled ? "none" : "0 6px 18px rgba(154,230,180,.45)",
    }}
    onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(.97)")}
    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    {children}
  </button>
);

export default PrimaryButton;
