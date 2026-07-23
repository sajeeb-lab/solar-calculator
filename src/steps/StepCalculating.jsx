import { useEffect, useState } from "react";
import Question from "../components/Question";
import PrimaryButton from "../components/PrimaryButton";
import { BRAND, GOOGLE_MAPS_API_KEY } from "../config";

const ITEMS = ["Processing property data", "Checking on local pricing", "Preparing insights"];

/* Step 5 — the "scan" screen.
   A dark overlay sweeps left → right revealing the satellite image,
   then the three checklist items complete one by one. Once all three
   are checked, a "Next" button appears — the user advances manually
   rather than the screen auto-navigating.

   The satellite image is requested at zoom 21 (single-property framing,
   like "that's MY roof") with scale=2 for a sharp retina image. If zoom 21
   imagery isn't available for the area and the request errors, it falls
   back to zoom 20 automatically. */
const StepCalculating = ({ address, onDone }) => {
  const [checks, setChecks] = useState([false, false, false]);
  const [zoom, setZoom] = useState(21);
  const allDone = checks.every(Boolean);

  useEffect(() => {
    const t = [
      setTimeout(() => setChecks([true, false, false]), 1800),
      setTimeout(() => setChecks([true, true, false]), 3100),
      setTimeout(() => setChecks([true, true, true]), 4400),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const hasCoords = address?.lat != null && GOOGLE_MAPS_API_KEY;
  const satUrl = hasCoords
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${address.lat},${address.lng}&zoom=${zoom}&size=640x640&scale=2&maptype=satellite&key=${GOOGLE_MAPS_API_KEY}`
    : null;

  return (
    <Question title="Calculating your rebate and battery estimate...">
      <p
        style={{
          letterSpacing: "0.14em",
          color: BRAND.soft,
          fontSize: 13.5,
          textTransform: "uppercase",
          margin: "18px 0 40px",
        }}
      >
        {address ? `${address.main}, ${address.secondary}` : ""}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 48,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* satellite panel with reveal animation */}
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            background: BRAND.headerBg,
            boxShadow: "0 18px 50px rgba(8,28,33,.25)",
          }}
        >
          {satUrl ? (
            <img
              src={satUrl}
              alt="Satellite view of your property"
              onError={() => {
                if (zoom > 20) setZoom(20); // area lacks zoom-21 imagery
              }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%" }} aria-label="Property scan preview">
              <rect width="300" height="300" fill="#7A8B6F" />
              <rect x="0" y="0" width="300" height="60" fill="#8C9B80" />
              <rect x="20" y="70" width="120" height="170" rx="6" fill="#5E6B70" />
              <polygon points="20,70 80,40 140,70" fill="#4A565B" />
              <rect x="170" y="90" width="110" height="140" rx="6" fill="#8A8F94" />
              <rect x="180" y="100" width="40" height="55" fill="#1F3A44" />
              <rect x="228" y="100" width="40" height="55" fill="#1F3A44" />
              <line x1="200" y1="100" x2="200" y2="155" stroke="#9AE6B4" strokeWidth="1.4" />
              <line x1="248" y1="100" x2="248" y2="155" stroke="#9AE6B4" strokeWidth="1.4" />
              <rect x="0" y="255" width="300" height="45" fill="#6B6F73" />
              <line x1="0" y1="277" x2="300" y2="277" stroke="#fff" strokeWidth="2" strokeDasharray="14 12" />
              <circle cx="60" cy="270" r="3" fill="#D6D9DB" />
            </svg>
          )}
          <div className="gl-reveal" />
          <div className="gl-scanline" />
        </div>

        {/* checklist */}
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 22 }}>
          {ITEMS.map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                justifyContent: "space-between",
                minWidth: 280,
              }}
            >
              <span style={{ fontSize: 16.5, color: BRAND.ink }}>{label}</span>
              {checks[i] ? (
                <svg width="22" height="22" viewBox="0 0 22 22" className="gl-pop">
                  <circle cx="11" cy="11" r="11" fill={BRAND.mint} />
                  <path
                    d="M6 11.5l3.2 3.2L16 8"
                    stroke={BRAND.headerBg}
                    strokeWidth="2.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className="gl-spin" />
              )}
            </div>
          ))}
        </div>
      </div>

      {allDone && (
        <div className="gl-pop" style={{ marginTop: 44 }}>
          <PrimaryButton onClick={onDone}>Next</PrimaryButton>
        </div>
      )}
    </Question>
  );
};

export default StepCalculating;
