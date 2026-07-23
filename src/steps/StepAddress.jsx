import { useCallback, useRef, useState } from "react";
import Question from "../components/Question";
import PrimaryButton from "../components/PrimaryButton";
import { BRAND } from "../config";
import { DEMO_ADDRESSES } from "../data/demoAddresses";

/* Step 2 — address with Google Places autocomplete (AU-restricted).
   Falls back to demo suggestions when no API key is configured. */
const StepAddress = ({ apiReady, onNext }) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const svcRef = useRef(null);

  const search = useCallback(
    (q) => {
      if (q.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      if (apiReady && window.google?.maps?.places) {
        if (!svcRef.current) {
          svcRef.current = new window.google.maps.places.AutocompleteService();
        }
        svcRef.current.getPlacePredictions(
          { input: q, componentRestrictions: { country: "au" } },
          (preds) =>
            setSuggestions(
              (preds || []).map((p) => ({
                main: p.structured_formatting.main_text,
                secondary: p.structured_formatting.secondary_text,
                placeId: p.place_id,
              }))
            )
        );
      } else {
        const ql = q.toLowerCase();
        setSuggestions(
          DEMO_ADDRESSES.filter(
            (a) =>
              a.main.toLowerCase().includes(ql) ||
              a.secondary.toLowerCase().includes(ql) ||
              ql.length >= 3
          ).slice(0, 4)
        );
      }
    },
    [apiReady]
  );

  const pick = (s) => {
    setText(`${s.main}, ${s.secondary}`);
    setSuggestions([]);
    if (s.placeId && apiReady) {
      new window.google.maps.Geocoder().geocode({ placeId: s.placeId }, (res) => {
        const loc = res?.[0]?.geometry?.location;
        setSelected({ ...s, lat: loc?.lat(), lng: loc?.lng() });
      });
    } else {
      setSelected(s);
    }
  };

  return (
    <Question
      title="What's your address?"
      subtitle="We'll run a real-time scan of your property..."
    >
      <div style={{ maxWidth: 560, margin: "44px auto 0", position: "relative", textAlign: "left" }}>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSelected(null);
            search(e.target.value);
          }}
          placeholder="Start typing your address..."
          style={{
            width: "100%",
            padding: "18px 22px",
            fontSize: 17,
            color: BRAND.ink,
            border: `1.5px solid ${selected ? BRAND.teal : BRAND.line}`,
            borderRadius: 14,
            outline: "none",
            boxShadow: "0 2px 12px rgba(8,28,33,.05)",
            fontFamily: "'Manrope', sans-serif",
          }}
        />
        {suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "#fff",
              border: `1px solid ${BRAND.line}`,
              borderRadius: 14,
              boxShadow: "0 14px 40px rgba(8,28,33,.14)",
              overflow: "hidden",
              zIndex: 20,
            }}
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => pick(s)}
                className="gl-suggestion"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "13px 20px",
                  background: "transparent",
                  border: "none",
                  borderTop: i ? `1px solid ${BRAND.line}` : "none",
                  cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                <div style={{ fontWeight: 600, color: BRAND.ink, fontSize: 15.5 }}>{s.main}</div>
                <div style={{ color: BRAND.soft, fontSize: 13.5 }}>{s.secondary}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: 52 }}>
        <PrimaryButton disabled={!selected} onClick={() => onNext(selected)}>
          Next
        </PrimaryButton>
      </div>
    </Question>
  );
};

export default StepAddress;
