/* /api/leads — Vercel serverless function.
   POST: validate and accept a calculator submission.
   GET:  list leads received by THIS function instance (dev convenience).

   NOTE ON STORAGE: serverless functions don't share or keep memory between
   requests, so the array below is ephemeral — leads are validated and
   logged (visible in Vercel -> Deployment -> Functions -> Logs) but not
   durably stored. The database phase replaces this with real persistence;
   the validation and response contract here are already final. */

const leads = [];

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || "");
const isPhone = (v) => {
  const d = (v || "").replace(/\D/g, "");
  return (d.length === 9 && d[0] !== "0") || (d.length === 10 && d[0] === "0");
};

export default function handler(req, res) {
  if (req.method === "GET") {
    return res
      .status(200)
      .json({ ok: true, count: leads.length, leads, note: "ephemeral until DB phase" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, errors: ["method not allowed"] });
  }

  const { state, address, bill, systemKw, lead } = req.body || {};

  /* server-side validation — never trust only the browser */
  const errors = [];
  if (!state) errors.push("state is required");
  if (!address?.main) errors.push("address is required");
  if (typeof bill !== "number" || bill < 50 || bill > 3000)
    errors.push("bill must be a number between 50 and 3000");
  if (typeof systemKw !== "number" || systemKw < 3 || systemKw > 30)
    errors.push("systemKw must be a number between 3 and 30");
  if (!lead?.first?.trim()) errors.push("first name is required");
  if (!lead?.last?.trim()) errors.push("last name is required");
  if (!isEmail(lead?.email)) errors.push("valid email is required");
  if (!isPhone(lead?.phone)) errors.push("valid phone is required");
  if (!lead?.consent) errors.push("consent is required");

  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }

  const record = {
    id: leads.length + 1,
    state,
    address,
    bill,
    systemKw,
    lead: {
      first: lead.first.trim(),
      last: lead.last.trim(),
      email: lead.email.trim().toLowerCase(),
      phone: lead.phone.trim(),
      consent: true,
    },
    receivedAt: new Date().toISOString(),
  };

  leads.push(record);
  console.log("NEW LEAD:", JSON.stringify(record));

  return res.status(201).json({ ok: true, id: record.id });
}
