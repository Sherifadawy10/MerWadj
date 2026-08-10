"use client";

import { useState } from "react";

export default function ContactForm({ buttonText = "BOOK A CONSULTATION" }) {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire up to CF7 / WP endpoint
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="contact-success">
        <p className="contact-success__text">
          Thank you — we&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-field">
        <input type="text" name="name" placeholder="Your full name" required />
      </div>
      <div className="contact-field">
        <input type="email" name="email" placeholder="Email" required />
      </div>
      <div className="contact-field">
        <input type="tel" name="phone" placeholder="Phone" />
      </div>
      <div className="contact-field">
        <textarea name="project" placeholder="Project Details" rows={3} />
      </div>
      <button
        type="submit"
        className="contact-submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "SENDING…" : buttonText}
      </button>
    </form>
  );
}
