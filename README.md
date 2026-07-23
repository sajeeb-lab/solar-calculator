# Growth Local — Solar & Battery Estimate Calculator

A 6-step lead-generation calculator built with React + Vite. Single-page app:
steps swap in place with no page reloads.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## The flow

1. **State** — Queensland / New South Wales / Victoria / South Australia
   (auto-advances on click)
2. **Address** — Google Places autocomplete, restricted to Australia
3. **Monthly power bill** — slider + synced input, $50–$3,000
4. **Solar system size** — slider + synced input, 3–30 kW
5. **Calculating** — satellite image reveals left-to-right with a scan line,
   three checklist items complete one by one, then auto-advances
6. **Lead form** — name, email, +61 phone, consent checkbox →
   "GET MY QUOTE NOW"

The restart icon (top-left) resets to step 1. A mint progress bar under the
header tracks completion.

## Google Maps API key

Paste your key into `src/config.js`:

```js
export const GOOGLE_MAPS_API_KEY = "AIzaSy...";
```

**Without a key the app runs in demo mode** — sample address suggestions and
an illustrated property placeholder — so the full flow is testable
immediately.

The key needs these APIs enabled: **Places API**, **Maps Static API**,
**Geocoding API**. Restrict the key to your domains (add `http://localhost:*`
for development) and cap daily quotas in Google Cloud Console to guarantee
you're never billed unexpectedly.

## Lead submission (placeholder)

Submissions are currently logged to the browser console — see `submitLead()`
in `src/App.jsx`. Replace the `console.log` with your endpoint / CRM call in
the next phase.

## Project structure

```
src/
  config.js            API key, brand colors, states list
  App.jsx              Layout shell, step routing, app state
  index.css            Global styles + animations
  assets/logo.png      Growth Local logo (client-supplied)
  components/          Logo, PrimaryButton, Question, SliderInput
  steps/               StepState, StepAddress, StepCalculating,
                       StepLead, StepDone
  hooks/useGoogleMaps.js
  data/demoAddresses.js
```

## Build for production

```bash
npm run build
```

Output goes to `dist/` — deploy to any static host (Vercel, Netlify, etc.).
