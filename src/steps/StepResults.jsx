import { useEffect, useState } from "react";
import Question from "../components/Question";
import { BRAND, GOOGLE_MAPS_API_KEY } from "../config";

/* Step 7 — the results / report page, shown after the lead form.
   STATIC VERSION: every figure below is a hard-coded placeholder
   (marked PLACEHOLDER) until the calculation phase wires them to
   POST /api/estimate. Company name, email, phone and address are
   obvious demo values — find & replace when the client provides
   the real details. */

/* ====== DEMO VALUES — replace later ====== */
const DEMO = {
  company: "Demo Company",
  calendarUrl: null, // client's booking link goes here later
  batteryRange: "15kWh and 20kWh",            // PLACEHOLDER
  rebateRange: "$5,580 – $7,440",             // PLACEHOLDER
  savingsRange: "$1,752 – $2,336",            // PLACEHOLDER
  priceBefore: "$17,399 – $20,281",           // PLACEHOLDER
  priceAfter: "$11,819 – $12,841",            // PLACEHOLDER
  email: "support@demo-company.com.au",       // DEMO — replace
  phone: "1300 000 000",                      // DEMO — replace
  postal: "PO Box 000, Demo Suburb, STATE 0000", // DEMO — replace
};

const demoClick = (e) => {
  e.preventDefault();
  alert("Demo button — the booking calendar link will be connected here.");
};

const SectionTitle = ({ children }) => (
  <h2
    style={{
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
      color: BRAND.ink,
      fontSize: "clamp(20px, 3vw, 28px)",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      margin: "0 0 22px",
    }}
  >
    {children}
  </h2>
);

const BigFigure = ({ children }) => (
  <p
    style={{
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
      color: BRAND.ink,
      fontSize: "clamp(18px, 2.6vw, 24px)",
      lineHeight: 1.45,
      margin: "0 0 18px",
    }}
  >
    {children}
  </p>
);

const Body = ({ children, style = {} }) => (
  <p
    style={{
      color: BRAND.soft,
      fontSize: 16.5,
      lineHeight: 1.7,
      maxWidth: 760,
      margin: "0 auto 14px",
      fontFamily: "'Manrope', sans-serif",
      ...style,
    }}
  >
    {children}
  </p>
);

const Divider = () => (
  <hr
    style={{
      border: "none",
      borderTop: `1px solid ${BRAND.line}`,
      margin: "46px auto",
      maxWidth: 820,
    }}
  />
);

const CtaButton = ({ children }) => (
  <a
    href={DEMO.calendarUrl || "#"}
    onClick={DEMO.calendarUrl ? undefined : demoClick}
    style={{
      display: "inline-block",
      background: BRAND.mint,
      color: BRAND.headerBg,
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: "0.06em",
      textDecoration: "none",
      borderRadius: 999,
      padding: "14px 40px",
      boxShadow: "0 6px 18px rgba(154,230,180,.45)",
    }}
  >
    {children}
  </a>
);

const StepResults = ({ data }) => {
  const address = data?.address;
  const [zoom, setZoom] = useState(21);

  /* the report is long — always open it from the top */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const hasCoords = address?.lat != null && GOOGLE_MAPS_API_KEY;
  const heroUrl = hasCoords
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${address.lat},${address.lng}&zoom=${zoom}&size=640x640&scale=2&maptype=satellite&key=${GOOGLE_MAPS_API_KEY}`
    : null;

  return (
    <div className="gl-step" style={{ textAlign: "center", width: "100%" }}>
      {/* ===== Report header ===== */}
      <h1
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          color: BRAND.ink,
          fontSize: "clamp(28px, 4.4vw, 44px)",
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          margin: "0 0 14px",
        }}
      >
        Your Solar &amp; Battery Rebate Report
      </h1>
      {address && (
        <p
          style={{
            letterSpacing: "0.14em",
            color: BRAND.soft,
            fontSize: 14,
            textTransform: "uppercase",
            margin: "0 0 42px",
          }}
        >
          {address.main}, {address.secondary}
        </p>
      )}

      {/* hero: the customer's own roof (personalized), demo illustration otherwise */}
      <div
        style={{
          width: "min(360px, 82vw)",
          height: "min(360px, 82vw)",
          margin: "0 auto 56px",
          borderRadius: "32px 32px 120px 120px",
          overflow: "hidden",
          background: BRAND.headerBg,
          boxShadow: "0 22px 60px rgba(8,28,33,.28)",
          border: `6px solid ${BRAND.mint}`,
        }}
      >
        {heroUrl ? (
          <img
            src={heroUrl}
            alt="Satellite view of your property"
            onError={() => zoom > 20 && setZoom(20)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%" }} aria-label="Solar report illustration">
            <rect width="300" height="300" fill={BRAND.headerBg} />
            <circle cx="230" cy="70" r="34" fill={BRAND.mint} opacity="0.9" />
            <rect x="55" y="130" width="190" height="110" rx="8" fill="#123039" />
            <polygon points="45,130 150,70 255,130" fill="#1B4450" />
            <rect x="80" y="95" width="60" height="34" rx="3" fill={BRAND.mint} opacity="0.85" transform="rotate(-19 110 112)" />
            <rect x="150" y="95" width="60" height="34" rx="3" fill={BRAND.mint} opacity="0.85" transform="rotate(-19 180 112)" />
            <rect x="200" y="165" width="34" height="60" rx="6" fill={BRAND.mint} opacity="0.9" />
            <rect x="0" y="252" width="300" height="48" fill="#0B242B" />
          </svg>
        )}
      </div>

      {/* ===== Personal assessment ===== */}
      <h2
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          color: BRAND.ink,
          fontSize: "clamp(20px, 3vw, 28px)",
          maxWidth: 780,
          margin: "0 auto 24px",
          lineHeight: 1.35,
        }}
      >
        Your personal assessment and recommendations prepared by {DEMO.company} energy experts
      </h2>
      <Body>
        Based on your current solar system, {DEMO.company} recommends a home battery with between{" "}
        {DEMO.batteryRange} of storage capacity for your property. Our team has selected a range of
        high-quality battery options to choose from, and our energy experts are happy to help you
        find the best fit for your home.
      </Body>
      <Body>
        Using your current energy usage, we&apos;ve modelled your estimated annual savings, the
        government rebates you may qualify for, and your final out-of-pocket cost after incentives —
        giving you a clear, transparent view of the financial benefits of adding a battery to your
        solar investment.
      </Body>

      <Divider />

      {/* ===== Rebates ===== */}
      <SectionTitle>Rebates</SectionTitle>
      <BigFigure>
        Federal Battery Rebate (Cheaper Home Battery Scheme, since 1 July 2025): {DEMO.rebateRange}
      </BigFigure>
      <Body>
        The Australian Federal Government wants more Australians to have access to affordable, clean
        energy — and it&apos;s making that easier by offering rebates when you add a battery to your
        solar system. It supports a more reliable power grid, and more importantly, it helps you save
        on your energy bills.
      </Body>
      <Body>
        If you&apos;re expanding an existing solar PV system or adding a new one, you may be able to
        claim solar rebates in addition to the battery rebate. {DEMO.company}&apos;s energy experts
        will make sure you&apos;re not missing out. Click below for an exact calculation.
      </Body>
      <div style={{ margin: "30px 0 8px" }}>
        <CtaButton>GET AN EXACT QUOTE</CtaButton>
      </div>

      <Divider />

      {/* ===== Energy cost savings ===== */}
      <SectionTitle>Energy Cost Savings</SectionTitle>
      <BigFigure>Estimated Annual Savings: {DEMO.savingsRange}</BigFigure>
      <Body>
        During the day, your solar system generates electricity at low cost — but if you don&apos;t
        use it right away, it gets sent back to the grid for a small return. Once the sun sets,
        you&apos;re buying electricity back at peak rates. With a home battery you can store that
        energy and use it later, especially at night and during peak hours — relying less on your
        energy provider and saving more on your power bills every month.
      </Body>

      <Divider />

      {/* ===== Battery costs ===== */}
      <SectionTitle>Estimated Battery Costs</SectionTitle>
      <BigFigure>Price Before Rebate: {DEMO.priceBefore}</BigFigure>
      <BigFigure>Price After Rebate: {DEMO.priceAfter}</BigFigure>

      {/* ===== Dark CTA banner ===== */}
      <div
        style={{
          background: BRAND.headerBg,
          borderRadius: 24,
          padding: "52px 28px",
          margin: "56px auto",
          maxWidth: 900,
        }}
      >
        <h2
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            color: "#fff",
            fontSize: "clamp(22px, 3.2vw, 30px)",
            margin: "0 0 18px",
          }}
        >
          Want an Exact Quote?
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,.85)",
            fontSize: 16.5,
            lineHeight: 1.6,
            maxWidth: 620,
            margin: "0 auto 28px",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          Rebates are limited! Schedule a consultation now to find out exactly how much you qualify
          for.
        </p>
        <CtaButton>YES, MAKE A TIME NOW!</CtaButton>
      </div>

      {/* ===== Disclaimer (DEMO legal copy — replace with the client's own) ===== */}
      <div
        style={{
          textAlign: "left",
          maxWidth: 820,
          margin: "0 auto",
          color: BRAND.soft,
          fontSize: 15,
          lineHeight: 1.7,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <h3 style={{ fontFamily: "'Sora', sans-serif", color: BRAND.ink, fontSize: 17, letterSpacing: "0.03em" }}>
          DISCLAIMER FOR SOLAR SYSTEM QUOTE
        </h3>
        <p>
          <u>General information:</u> the information provided through this quoting tool is for
          general guidance only and is subject to an on-site inspection and final design by a
          certified electrician. Price and system suitability may vary based on factors including,
          but not limited to:
        </p>
        <p>• Shading, roof pitch, access, and other site-specific factors.</p>
        <p>• Size and configuration of your existing solar system, if any.</p>
        <p>• Compliance with applicable consumer codes and Australian solar installation regulations.</p>
        <p>• Compatibility and performance of existing or new inverters.</p>
        <p>
          <u>Quote:</u> all price estimates are quoted in AUD (Australian Dollars) and are exclusive
          of GST, shipping, installation, and any other duties or charges, unless explicitly stated
          otherwise. We reserve the right to correct any errors or omissions in any estimate pricing.
        </p>
        <p>
          <u>Australian Consumer Law:</u> nothing in this disclaimer excludes, restricts, or modifies
          any rights or remedies available under the Australian Consumer Law or other applicable
          legislation.
        </p>
        <p>
          <u>Rebates and incentives:</u> any government rebates, incentives, or other financial
          benefits mentioned in this quote are subject to the customer meeting all eligibility
          criteria and successful application to the relevant government body or scheme
          administrator. We are not responsible for the approval or payment of any rebates or
          incentives, and the quoted price is not conditional on the receipt of such rebates unless
          explicitly stated and agreed upon in writing. It is the customer&apos;s responsibility to
          verify their eligibility and the current terms of any applicable schemes. Discounts
          dependent on government incentive schemes may be increased, decreased or removed from a
          quote if those schemes are withdrawn or changed.
        </p>
        <p>
          <u>Exclusions:</u> this quote does not include costs associated with structural
          modifications, additional electrical work, or other unforeseen requirements unless
          explicitly stated.
        </p>

        <h3 style={{ fontFamily: "'Sora', sans-serif", color: BRAND.ink, fontSize: 17, letterSpacing: "0.03em", marginTop: 34 }}>
          PRIVACY AND DATA USE
        </h3>
        <p>
          Your privacy is important to us. Our Privacy Policy outlines how we collect, use, store and
          disclose your personal information. You can view the policy here:{" "}
          <a href="#" onClick={demoClick} style={{ color: BRAND.teal }}>
            Privacy Policy — {DEMO.company}
          </a>
        </p>
        <p>
          We comply with the Australian Privacy Act 1988 and relevant energy and consumer protection
          laws, including the Competition and Consumer Act 2010, the Do Not Call Register Act 2006,
          and the Telecommunications Act 1997.
        </p>
        <p>
          You can also request to be added to our No Contact List at any time, to ensure we do not
          send you further marketing communications. Simply contact us via:
        </p>
        <p>
          <a href={`mailto:${DEMO.email}`} style={{ color: BRAND.teal }}>{DEMO.email}</a>
        </p>
        <p>
          {DEMO.phone} — {DEMO.postal}
        </p>
      </div>
    </div>
  );
};

export default StepResults;
