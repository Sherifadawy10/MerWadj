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
    // TODO(B1): POST to /api/contact once the client confirms the destination
    // mailbox and CRM. Until then nothing is delivered — see the handover doc.
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
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
