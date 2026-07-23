/* GET /api/health — quick check that the serverless API is live */
export default function handler(_req, res) {
  res.status(200).json({ ok: true, service: "growth-local-vercel-api" });
}
