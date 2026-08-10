"use client";
import { useState } from "react";

export default function BlogSubscribe({ title, text }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    // TODO: wire up to WP / Mailchimp endpoint
    await new Promise((r) => setTimeout(r, 800));
    setStatus("done");
    setEmail("");
  }

  const heading = title || "SUBSCRIBE TO THE JOURNAL";
  const desc    = text  || "Receive the latest insights on sustainable procurement, material innovation, and architectural heritage directly to your inbox.";

  return (
    <section className="blog-subscribe" data-anim="0">
      <div className="blog-subscribe__inner">
        <h2 className="blog-subscribe__title">{heading}</h2>
        <p className="blog-subscribe__desc">{desc}</p>

        {status === "done" ? (
          <p className="blog-subscribe__thanks">
            Thank you — you&apos;re now subscribed.
          </p>
        ) : (
          <form className="blog-subscribe__form" onSubmit={handleSubmit} noValidate>
            <input
              className="blog-subscribe__input"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "sending"}
            />
            <button
              className="blog-subscribe__btn"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "..." : "SUBSCRIBE"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
