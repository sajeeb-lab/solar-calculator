import { useEffect, useMemo } from "react";
import Question from "../components/Question";
import { BRAND } from "../config";
import batteryProduct from "../assets/battery-product.png";
import { calculateEstimate, fmtCurrencyRange, fmtKwhRange } from "../data/rebateEstimate";

/* Step 7 — the results / report page, shown after the lead form.
   STATIC VERSION: every figure below is a hard-coded placeholder
   (marked PLACEHOLDER) until the calculation phase wires them to
   POST /api/estimate. Company name, email, phone and address are
   obvious demo values — find & replace when the client provides
   the real details. */

/* ====== DEMO VALUES — replace later ====== */
const DEMO = {
  company: "Solar Growth System",
  calendarUrl: "https://growthlocal.com.au/schedule-solar-growth-system-demo",
  // The displayed Federal Battery Rebate line is static by request — it does
  // NOT feed Price After Rebate below, which keeps using the real
  // state-based calculation from rebateEstimate.js.
  staticRebateRange: "$5,580 – $7,440",
  // battery size, rebate, savings, and cost figures are now calculated
  // live from the customer's bill and state — see calculateEstimate()
  email: "info@growthlocal.com.au",
  phone: "(+61) 03 4427 7546",
  postal: "Ground Floor/470 St Kilda Rd, Melbourne, VIC, 3004",
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
    target={DEMO.calendarUrl ? "_blank" : undefined}
    rel={DEMO.calendarUrl ? "noopener noreferrer" : undefined}
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

  /* the report is long — always open it from the top */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const estimate = useMemo(
    () => calculateEstimate(data?.bill, data?.state),
    [data?.bill, data?.state]
  );

  const batteryRangeText = fmtKwhRange(estimate.batteryMin, estimate.batteryMax);
  const savingsRangeText = fmtCurrencyRange(estimate.savingsMin, estimate.savingsMax);
  const priceBeforeText = fmtCurrencyRange(estimate.costBeforeMin, estimate.costBeforeMax);
  const priceAfterText = fmtCurrencyRange(estimate.costAfterMin, estimate.costAfterMax);

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
        Your Battery Rebate Report
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

      {/* hero: always the battery product image */}
      <div
        style={{
          width: "min(420px, 90vw)",
          margin: "0 auto 56px",
        }}
      >
        <img
          src={batteryProduct}
          alt="Recommended home battery system"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
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
        Based on your average monthly power bill, {DEMO.company} recommends a home battery with
        between{" "}
        {batteryRangeText} of storage capacity for your property. Our team has selected a range of
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
        Federal Battery Rebate (Cheaper Home Battery Scheme, since 1 July 2025): {DEMO.staticRebateRange}
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
      <BigFigure>Estimated Annual Savings: {savingsRangeText}</BigFigure>
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
      <BigFigure>Price Before Rebate: {priceBeforeText}</BigFigure>
      <BigFigure>Price After Rebate: {priceAfterText}</BigFigure>

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
          <u style={{ fontWeight: 700, color: BRAND.ink }}>General information:</u> the information provided through this quoting tool is for
          general guidance only and is subject to an on-site inspection and final design by a
          certified electrician. Price and system suitability may vary based on factors including,
          but not limited to:
        </p>
        <p>• Shading, roof pitch, access, and other site-specific factors.</p>
        <p>• Size and configuration of your existing solar system, if any.</p>
        <p>• Compliance with applicable consumer codes and Australian solar installation regulations.</p>
        <p>• Compatibility and performance of existing or new inverters.</p>
        <p>
          <u style={{ fontWeight: 700, color: BRAND.ink }}>Quote:</u> all price estimates are quoted in AUD (Australian Dollars) and are exclusive
          of GST, shipping, installation, and any other duties or charges, unless explicitly stated
          otherwise. We reserve the right to correct any errors or omissions in any estimate pricing.
        </p>
        <p>
          <u style={{ fontWeight: 700, color: BRAND.ink }}>Australian Consumer Law:</u> nothing in this disclaimer excludes, restricts, or modifies
          any rights or remedies available under the Australian Consumer Law or other applicable
          legislation.
        </p>
        <p>
          <u style={{ fontWeight: 700, color: BRAND.ink }}>Rebates and incentives:</u> any government rebates, incentives, or other financial
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
          <u style={{ fontWeight: 700, color: BRAND.ink }}>Exclusions:</u> this quote does not include costs associated with structural
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
        <p style={{ margin: "0 0 4px" }}>{DEMO.company}</p>
        <p style={{ margin: "0 0 4px" }}>{DEMO.postal}</p>
        <p style={{ margin: 0 }}>{DEMO.phone}</p>
      </div>
    </div>
  );
};

export default StepResults;
