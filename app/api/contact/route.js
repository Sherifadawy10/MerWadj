import { NextResponse } from "next/server";

/*
 * Contact form endpoint.
 *
 * The form used to resolve to a "thank you" without sending anything, so
 * every enquiry since launch was discarded. It now posts here, and this
 * hands the submission to Contact Form 7 in WordPress, which mails
 * Hello@merwadj.com and — through Flamingo — files the enquiry under
 * Inbound Messages, the client's "Potential Clients" list.
 *
 * Going through our own route rather than calling WordPress from the
 * browser keeps the CMS host and the form id out of the page, avoids CORS,
 * and lets us set a browser User-Agent: GoDaddy's firewall answers 403 to
 * anything that does not look like one.
 *
 * Needs CONTACT_FORM_ID in the environment. Without it the route reports
 * that it is not configured rather than pretending the message was sent.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const FORM_ID = process.env.CONTACT_FORM_ID;
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
  const base = String(WP_API || "").replace(/\/$/, "");
  return base.includes("rest_route=") ? `${base}${route}` : `${base}${route}`;
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

  const form = new FormData();
  form.set("your-name", values.name);
  form.set("your-email", values.email);
  form.set("your-phone", values.phone);
  form.set("your-project", values.project);
  form.set("_wpcf7_unit_tag", `merwadj-site-${Date.now()}`);

  let payload;
  try {
    const response = await fetch(
      wpUrl(`/contact-form-7/v1/contact-forms/${encodeURIComponent(FORM_ID)}/feedback`),
      { method: "POST", headers: { "User-Agent": UA }, body: form, cache: "no-store" }
    );
    payload = await response.json();
  } catch (error) {
    console.error("contact: WordPress unreachable", error);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }

  /*
   * CF7 answers 200 even when it refuses the submission; the verdict is in
   * the body. Treating the status alone as success is how a form ends up
   * silently dropping mail again.
   */
  if (payload?.status === "mail_sent") {
    return NextResponse.json({ ok: true });
  }

  console.error("contact: CF7 refused", payload?.status, payload?.message);
  return NextResponse.json(
    { ok: false, error: payload?.status || "rejected" },
    { status: 502 }
  );
}
