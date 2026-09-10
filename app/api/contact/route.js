import { NextResponse } from "next/server";

/*
 * Contact form endpoint.
 *
 * Two jobs, deliberately separated:
 *
 *   1. The enquiry is filed in WordPress. Contact Form 7 records it and
 *      Flamingo keeps it under Inbound Messages, the client's list of
 *      potential clients. This is the copy that must never be lost.
 *
 *   2. The notification email is sent, by us, through a transactional
 *      provider on merwadj.com's own DNS records.
 *
 * Why not let WordPress send the mail. It sits on GoDaddy's shared relay
 * and cannot sign anything: the client's mailbox is on Microsoft 365 and
 * DKIM for merwadj.com can only be switched on from the M365 admin centre,
 * which the client cannot be asked to do. Mail from a shared relay with no
 * signature is what lands in spam, and until 09.09.2026 it was worse than
 * that: sent as wordpress@1196411.us17.myftpupload.com, a domain with no
 * SPF at all, Gmail discarded it outright rather than filing it as spam.
 *
 * With RESEND_API_KEY unset this falls back to letting Contact Form 7 send,
 * which is the previous behaviour. Nothing changes until the key is there.
 *
 * Environment:
 *   NEXT_PUBLIC_WORDPRESS_API_URL  the CMS REST root            (required)
 *   CONTACT_FORM_ID                the Contact Form 7 form id   (required)
 *   RESEND_API_KEY                 turns on provider sending    (optional)
 *   CONTACT_MAIL_TO                override the recipient       (optional)
 *   CONTACT_MAIL_FROM              override the sender          (optional)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const FORM_ID = process.env.CONTACT_FORM_ID;
const RESEND_KEY = process.env.RESEND_API_KEY;
const MAIL_TO = process.env.CONTACT_MAIL_TO || "Hello@merwadj.com";
const MAIL_FROM =
  process.env.CONTACT_MAIL_FROM || "MerWadj website <website@merwadj.com>";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/140.0 Safari/537.36";

const MAX = { name: 120, email: 160, phone: 40, project: 4000 };

/* Mirrors the client-side rules. The browser's copy is a convenience; this
 * one is the one that counts, because anything can post here. */
function validate(v) {
  const errors = {};
  if (!v.name) errors.name = "Enter your full name so we know who to reply to.";
  if (!v.email) {
    errors.email = "Enter an email address so we can respond.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) {
    errors.email = "That email address does not look complete. Check it and try again.";
  }
  if (v.phone && v.phone.replace(/[^\d]/g, "").length < 6) {
    errors.phone = "That phone number looks too short. Include the country code.";
  }
  for (const [field, limit] of Object.entries(MAX)) {
    if (v[field] && v[field].length > limit) errors[field] = "That is longer than we can accept.";
  }
  return errors;
}

function wpUrl(route) {
  return `${String(WP_API || "").replace(/\/$/, "")}${route}`;
}

function plainBody(v) {
  return [
    "A new enquiry was sent from merwadj.com",
    "",
    `Name:    ${v.name}`,
    `Email:   ${v.email}`,
    `Phone:   ${v.phone || "not given"}`,
    "",
    "Project details:",
    v.project || "not given",
    "",
    "--",
    "Sent from the contact form on merwadj.com",
  ].join("\n");
}

/*
 * File the enquiry in WordPress. CF7 answers 200 even when it refuses the
 * submission; the verdict is in the body, and reading the status alone is
 * how a form ends up silently dropping enquiries again.
 */
async function fileWithWordPress(values) {
  const form = new FormData();
  form.set("your-name", values.name);
  form.set("your-email", values.email);
  form.set("your-phone", values.phone);
  form.set("your-project", values.project);
  form.set("_wpcf7_unit_tag", `merwadj-site-${Date.now()}`);

  const response = await fetch(
    wpUrl(`/contact-form-7/v1/contact-forms/${encodeURIComponent(FORM_ID)}/feedback`),
    { method: "POST", headers: { "User-Agent": UA }, body: form, cache: "no-store" }
  );
  const payload = await response.json();
  return { ok: payload?.status === "mail_sent", status: payload?.status, message: payload?.message };
}

/* Send through the provider. Plain fetch rather than the SDK: one HTTP call
 * does not justify a dependency. Reply-To carries the visitor so hitting
 * reply in the client's mailbox answers the person who wrote in. */
async function sendWithProvider(values) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: MAIL_TO.split(",").map((address) => address.trim()).filter(Boolean),
      reply_to: values.email,
      subject: `New enquiry from merwadj.com: ${values.name}`,
      text: plainBody(values),
    }),
    cache: "no-store",
  });

  if (response.ok) return { ok: true };
  const detail = await response.text();
  return { ok: false, status: response.status, detail: detail.slice(0, 300) };
}

export async function POST(request) {
  if (!WP_API || !FORM_ID) {
    console.error("contact: CONTACT_FORM_ID or NEXT_PUBLIC_WORDPRESS_API_URL missing");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  /* Bots fill every field they find; people never see this one. */
  if (String(body.website || "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const values = {
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim(),
    phone: String(body.phone || "").trim(),
    project: String(body.project || "").trim(),
  };

  const errors = validate(values);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "invalid", errors }, { status: 422 });
  }

  let filed;
  try {
    filed = await fileWithWordPress(values);
  } catch (error) {
    console.error("contact: WordPress unreachable", error);
    filed = { ok: false, status: "unreachable" };
  }

  if (!RESEND_KEY) {
    /* No provider configured: WordPress sent the mail itself, so its verdict
     * is the only one we have. */
    if (filed.ok) return NextResponse.json({ ok: true });
    console.error("contact: CF7 refused", filed.status, filed.message);
    return NextResponse.json({ ok: false, error: filed.status || "rejected" }, { status: 502 });
  }

  let sent;
  try {
    sent = await sendWithProvider(values);
  } catch (error) {
    console.error("contact: provider unreachable", error);
    sent = { ok: false, status: "unreachable" };
  }

  if (sent.ok) return NextResponse.json({ ok: true });

  /*
   * The email failed but the enquiry is filed in WordPress, so it is not
   * lost and the visitor has no useful action to take: telling them it went
   * wrong only makes them send it twice. Log everything needed to recover
   * the lead from here alone.
   */
  console.error(
    "contact: provider refused",
    sent.status,
    sent.detail || "",
    "| filed in WordPress:",
    filed.ok,
    "| enquiry:",
    JSON.stringify(values)
  );

  if (filed.ok) return NextResponse.json({ ok: true });

  return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
}
