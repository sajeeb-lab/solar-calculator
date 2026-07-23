/* Battery / rebate / savings estimate calculation.
   Formula supplied by the client — see the 6-step breakdown below.
   Source of truth: monthly power bill + state. */

/* STEP 1 — monthly bill -> recommended battery size + typical cost.
   Sorted ascending by bill threshold. A bill is matched to the highest
   threshold that is <= its value (step function), and anything at or
   above the top threshold uses the final ("$300+") tier. */
const BILL_TABLE = [
  { bill: 80, batteryMin: 4, batteryMax: 5, costMin: 9500, costMax: 11000 },
  { bill: 100, batteryMin: 5, batteryMax: 6, costMin: 10500, costMax: 12000 },
  { bill: 120, batteryMin: 6, batteryMax: 8, costMin: 11000, costMax: 13000 },
  { bill: 150, batteryMin: 8, batteryMax: 10, costMin: 13000, costMax: 15000 },
  { bill: 180, batteryMin: 10, batteryMax: 12, costMin: 14000, costMax: 16500 },
  { bill: 200, batteryMin: 10, batteryMax: 13.5, costMin: 15000, costMax: 18000 },
  { bill: 250, batteryMin: 13.5, batteryMax: 15, costMin: 17000, costMax: 22000 },
  { bill: 300, batteryMin: 15, batteryMax: 15, costMin: 21000, costMax: 24000 },
];

/* STEP 2 — max rebate per state. Only the 4 states this calculator
   supports (see STATES in config.js) — no others are added. */
const STATE_MAX_REBATE = {
  Queensland: 4000,
  "New South Wales": 4000,
  Victoria: 3137,
  "South Australia": 6400,
};

const REBATE_PER_KWH = 500; // STEP 3
const SAVINGS_LOW_RATE = 0.35; // STEP 6 conservative
const SAVINGS_HIGH_RATE = 0.45; // STEP 6 optimistic

const lookupBillTier = (bill) => {
  let tier = BILL_TABLE[0];
  for (const row of BILL_TABLE) {
    if (bill >= row.bill) tier = row;
  }
  return tier;
};

/* Returns every figure needed for the results page, computed from the
   customer's actual monthly bill and state. */
export const calculateEstimate = (bill, state) => {
  const safeBill = Number(bill) || 0;
  const tier = lookupBillTier(safeBill);
  const stateMax = STATE_MAX_REBATE[state] ?? 0;

  // STEP 3 — rebate range, capped at the state maximum
  const rebateMin = Math.min(tier.batteryMin * REBATE_PER_KWH, stateMax);
  const rebateMax = Math.min(tier.batteryMax * REBATE_PER_KWH, stateMax);

  // STEP 4 — cost before rebate (straight from the table)
  const costBeforeMin = tier.costMin;
  const costBeforeMax = tier.costMax;

  // STEP 5 — cost after rebate: best case pairs min cost with max rebate,
  // worst case pairs max cost with min rebate
  const costAfterMin = costBeforeMin - rebateMax;
  const costAfterMax = costBeforeMax - rebateMin;

  // STEP 6 — annual savings range
  const savingsMin = Math.round(safeBill * SAVINGS_LOW_RATE * 12);
  const savingsMax = Math.round(safeBill * SAVINGS_HIGH_RATE * 12);

  return {
    batteryMin: tier.batteryMin,
    batteryMax: tier.batteryMax,
    rebateMin,
    rebateMax,
    costBeforeMin,
    costBeforeMax,
    costAfterMin,
    costAfterMax,
    savingsMin,
    savingsMax,
  };
};

/* ---- formatting helpers ---- */
export const fmtCurrency = (n) => `$${Math.round(n).toLocaleString("en-AU")}`;

export const fmtCurrencyRange = (min, max) =>
  min === max ? fmtCurrency(min) : `${fmtCurrency(min)} – ${fmtCurrency(max)}`;

const trimNum = (n) => {
  const rounded = Math.round(n * 10) / 10; // keep at most one decimal
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
};

export const fmtKwh = (n) => `${trimNum(n)} kWh`;

export const fmtKwhRange = (min, max) =>
  min === max ? fmtKwh(min) : `${trimNum(min)}–${trimNum(max)} kWh`;
