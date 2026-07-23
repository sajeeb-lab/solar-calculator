import { useState } from "react";
import { BRAND, GOOGLE_MAPS_API_KEY } from "./config";
import Logo from "./components/Logo";
import Question from "./components/Question";
import PrimaryButton from "./components/PrimaryButton";
import SliderInput from "./components/SliderInput";
import StepState from "./steps/StepState";
import StepAddress from "./steps/StepAddress";
import StepCalculating from "./steps/StepCalculating";
import StepLead from "./steps/StepLead";
import StepResults from "./steps/StepResults";

const TOTAL_STEPS = 6;

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    state: null,
    address: null,
    bill: 125,
    systemKw: 7,
    lead: null,
  });

  const restart = () => {
    setData({ state: null, address: null, bill: 125, systemKw: 7, lead: null });
    setStep(0);
  };

  const submitLead = async (lead) => {
    const payload = {
      state: data.state,
      address: data.address,
      bill: data.bill,
      systemKw: data.systemKw,
      lead,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const out = await res.json();
      if (!res.ok) {
        console.error("Lead submission rejected:", out.errors);
        alert("Something went wrong submitting your details. Please check the form and try again.");
        return;
      }
      setData((d) => ({ ...d, lead }));
      setStep(6);
    } catch (err) {
      console.error("Lead submission failed:", err);
      alert("Could not reach the server. Please try again in a moment.");
    }
  };

  const steps = [
    <StepState
      key="s0"
      onSelect={(state) => {
        setData((d) => ({ ...d, state }));
        setStep(1);
      }}
    />,
    <StepAddress
      key="s1"
      onNext={(address) => {
        setData((d) => ({ ...d, address }));
        setStep(2);
      }}
    />,
    <Question
      key="s2"
      title="What's your average monthly power bill?"
      subtitle="Quarterly bill? Divide it by 3."
    >
      <SliderInput
        min={50}
        max={3000}
        step={5}
        prefix="$"
        value={data.bill}
        onChange={(bill) => setData((d) => ({ ...d, bill }))}
      />
      <div style={{ marginTop: 52 }}>
        <PrimaryButton onClick={() => setStep(3)}>Next</PrimaryButton>
      </div>
    </Question>,
    <Question
      key="s3"
      title="Approximately, what size is your solar system?"
    >
      <SliderInput
        min={3}
        max={30}
        suffix="kW"
        value={data.systemKw}
        onChange={(systemKw) => setData((d) => ({ ...d, systemKw }))}
      />
      <div style={{ marginTop: 52 }}>
        <PrimaryButton onClick={() => setStep(4)}>Next</PrimaryButton>
      </div>
    </Question>,
    <StepCalculating key="s4" address={data.address} onDone={() => setStep(5)} />,
    <StepLead key="s5" onSubmit={submitLead} />,
    <StepResults key="s6" data={data} />,
  ];

  return (
    <div style={{ minHeight: "100vh", background: BRAND.bg }}>
      {/* Header */}
      <header style={{ background: BRAND.headerBg, position: "relative" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "38px 24px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <button
            onClick={restart}
            aria-label="Restart calculator"
            title="Restart"
            style={{
              position: "absolute",
              left: 24,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: BRAND.mint,
              padding: 6,
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <polyline points="3 4 3 9 8 9" />
            </svg>
          </button>
          <Logo />
        </div>

        {/* angled bottom edge — deliberately not the competitor's wave */}
        <svg
          viewBox="0 0 100 6"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 34, marginBottom: -1 }}
        >
          <polygon points="0,0 100,0 100,1 0,6" fill={BRAND.headerBg} />
        </svg>

        {/* progress bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 4,
            background: "rgba(255,255,255,.08)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%`,
              background: BRAND.mint,
              transition: "width .5s ease",
            }}
          />
        </div>
      </header>

      {/* Step content */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "56px 24px 80px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {steps[step]}
      </main>
    </div>
  );
}
