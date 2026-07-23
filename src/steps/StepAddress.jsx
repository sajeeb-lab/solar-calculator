import { useCallback, useRef, useState } from "react";
import Question from "../components/Question";
import PrimaryButton from "../components/PrimaryButton";
import { BRAND, GOOGLE_MAPS_API_KEY } from "../config";
import { DEMO_ADDRESSES } from "../data/demoAddresses";

/* Step 2 — address autocomplete, restricted to Australia.
   Calls the Places API (New) REST endpoints directly:
     POST https://places.googleapis.com/v1/places:autocomplete
     GET  https://places.googleapis.com/v1/places/{id}   (for coordinates)
   No Google JS SDK is loaded — the key only needs "Places API (New)"
   (plus "Maps Static API" for the satellite image later).
   With no API key configured, falls back to demo suggestions. */
const StepAddress = ({ onNext }) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const lastQueryRef = useRef("");

  const search = useCallback(async (q) => {
    lastQueryRef.current = q;
    if (q.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    /* --- live mode: Places API (New) REST --- */
    if (GOOGLE_MAPS_API_KEY) {
      try {
        const res = await fetch(
          "https://places.googleapis.com/v1/places:autocomplete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            },
            body: JSON.stringify({
              input: q,
              includedRegionCodes: ["au"],
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Places autocomplete error:", data.error || data);
          return;
        }
        if (lastQueryRef.current !== q) return; // stale response, ignore
        setSuggestions(
          (data.suggestions || [])
            .filter((s) => s.placePrediction)
            .map((s) => ({
              main:
                s.placePrediction.structuredFormat?.mainText?.text ||
                s.placePrediction.text?.text ||
                "",
              secondary:
                s.placePrediction.structuredFormat?.secondaryText?.text || "",
              placeId: s.placePrediction.placeId,
            }))
        );
        return;
      } catch (err) {
        console.error("Places autocomplete request failed:", err);
        return;
      }
    }

    /* --- demo mode --- */
    const ql = q.toLowerCase();
    setSuggestions(
      DEMO_ADDRESSES.filter(
        (a) =>
          a.main.toLowerCase().includes(ql) ||
          a.secondary.toLowerCase().includes(ql) ||
          ql.length >= 3
      ).slice(0, 4)
    );
  }, []);

  const pick = async (s) => {
    setText(`${s.main}, ${s.secondary}`);
    setSuggestions([]);

    /* live mode: fetch coordinates via Place Details (New) */
    if (s.placeId && GOOGLE_MAPS_API_KEY) {
      try {
        const res = await fetch(
          `https://places.googleapis.com/v1/places/${s.placeId}`,
          {
            headers: {
              "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
              "X-Goog-FieldMask": "location",
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Place details error:", data.error || data);
          setSelected({ main: s.main, secondary: s.secondary });
          return;
        }
        setSelected({
          main: s.main,
          secondary: s.secondary,
          lat: data.location?.latitude,
          lng: data.location?.longitude,
        });
        return;
      } catch (err) {
        console.error("Place details request failed:", err);
        setSelected({ main: s.main, secondary: s.secondary });
        return;
      }
    }

    /* demo mode */
    setSelected(s);
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
                key={s.placeId || i}
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
