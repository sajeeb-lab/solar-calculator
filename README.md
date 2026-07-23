# Growth Local — Solar Calculator (Vercel version)

Single-deployment version: the React app AND the API run on Vercel together.

```
src/        React frontend (the 6-step calculator)
api/        Vercel serverless functions
  health.js   GET  /api/health
  leads.js    GET/POST /api/leads
```

## Deploy to Vercel (GitHub route — recommended)

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com -> Add New -> Project -> Import the repo.
3. Vercel auto-detects Vite. Before deploying, open "Environment Variables"
   and add:
   - Name:  `VITE_GOOGLE_MAPS_API_KEY`
   - Value: your Google Maps API key
4. Click Deploy. Your app is live at `https://<project>.vercel.app`
   with the API at `https://<project>.vercel.app/api/leads`.

### Alternative: CLI (no GitHub needed)

```bash
npm i -g vercel
vercel          # from this folder; follow the prompts
vercel env add VITE_GOOGLE_MAPS_API_KEY
vercel --prod
```

## After deploying — Google key restrictions

In Google Cloud Console -> Credentials -> your key -> Application
restrictions -> Websites, add:

```
https://<project>.vercel.app/*
```

(plus `http://localhost:*` for local development).

## Local development

```bash
npm install
npx vercel dev      # runs frontend AND the /api functions locally
```

(`npm run dev` runs only the frontend; /api calls will 404 without
`vercel dev`.) Create `.env` from `.env.example` for the key locally.

## Lead storage note

Serverless functions are stateless: leads are validated and logged
(Vercel -> Deployments -> Functions -> Logs) but not durably stored yet.
The database phase adds persistence. For long-term architecture with a
database, the separate Express-server version of this project remains the
base.
