"use client";

import { useId, useState } from "react";

/*
 * Every field carries a real <label>. A placeholder is not a label: it
 * disappears the moment the visitor types and screen readers do not
 * announce it as the field's name.
 */
const FIELDS = [
  { name: "name", label: "Your full name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", required: false, autoComplete: "tel" },
  { name: "project", label: "Project details", type: "textarea", required: false },
];

function validate(values) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = "Enter your full name so we know who to reply to.";
  }

  const email = values.email?.trim();
  if (!email) {
    errors.email = "Enter an email address so we can respond.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "That email address does not look complete. Check it and try again.";
  }

  const phone = values.phone?.trim();
  if (phone && phone.replace(/[^\d]/g, "").length < 6) {
    errors.phone = "That phone number looks too short. Include the country code.";
  }

  return errors;
}

export default function ContactForm({ buttonText = "BOOK A CONSULTATION" }) {
  const uid = useId();
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(FIELDS.map((f) => [f.name, data.get(f.name) || ""]));
    const found = validate(values);

    setErrors(found);
    if (Object.keys(found).length) {
      const firstInvalid = FIELDS.find((f) => found[f.name]);
      document.getElementById(`${uid}-${firstInvalid.name}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: data.get("website") || "" }),
      });
      const payload = await response.json().catch(() => ({}));

      if (payload?.ok) {
        setStatus("success");
        return;
      }
      /* The server revalidates; if it disagrees, show its findings. */
      if (payload?.errors) {
        setErrors(payload.errors);
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "error") {
    return (
      <div className="contact-success" role="alert" aria-live="assertive">
        <p className="contact-success__text">
          We could not send that just now. Please email{" "}
          <a href="mailto:Hello@merwadj.com" className="contact-success__link">
            Hello@merwadj.com
          </a>{" "}
          and we will pick it up from there.
        </p>
        <button type="button" className="contact-form__submit" onClick={() => setStatus("idle")}>
          TRY AGAIN
        </button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="contact-success" role="status" aria-live="polite">
        <p className="contact-success__text">
          Thank you — we&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {/*
        * Honeypot. Hidden from people and from screen readers, and left out
        * of the tab order — anything that fills it in is a bot, and the
        * server quietly accepts and discards those.
        */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="contact-form__trap"
      />

      {FIELDS.map((field) => {
        const id = `${uid}-${field.name}`;
        const errorId = `${id}-error`;
        const error = errors[field.name];
        const shared = {
          id,
          name: field.name,
          required: field.required,
          placeholder: field.label,
          autoComplete: field.autoComplete,
          "aria-invalid": error ? "true" : undefined,
          "aria-describedby": error ? errorId : undefined,
        };

        return (
          <div
            key={field.name}
            className={`contact-field${error ? " contact-field--invalid" : ""}`}
          >
            <label htmlFor={id} className="sr-only">
              {field.label}
              {field.required ? " (required)" : " (optional)"}
            </label>

            {field.type === "textarea" ? (
              <textarea {...shared} rows={3} />
            ) : (
              <input {...shared} type={field.type} />
            )}

            {error && (
              <span id={errorId} className="contact-error">
                {error}
              </span>
            )}
          </div>
        );
      })}

      <button type="submit" className="contact-submit" disabled={status === "sending"}>
        {status === "sending" ? "SENDING…" : buttonText}
      </button>
    </form>
  );
}
