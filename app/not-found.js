import Link from "next/link";
import { buildMetadata } from "@/lib/site";

/*
 * No async server component may render inside this boundary — the footer
 * fetches WordPress and the boundary cannot await it.
 *
 * Known Next 15.5 limitation: the status line is a correct 404, but the
 * body arrives in the RSC payload and paints on hydration rather than in
 * the initial HTML. Verified against a bare synchronous shell, so it is
 * framework behaviour, not something in this tree. Re-check after the
 * next Next.js upgrade.
 */
export const metadata = buildMetadata({
  /* absolute: the root layout template would otherwise append the site name twice */
  title: { absolute: "Page not found — MERWADJ" },
  description: "The page you were looking for is not here. Continue from the sections below.",
  path: "/404",
  noIndex: true,
});

const DESTINATIONS = [
  { href: "/materials", title: "Materials catalog", note: "Engineered stone, finishes and applications." },
  { href: "/about", title: "About MERWADJ", note: "Who we are and how we source." },
  { href: "/sustainability", title: "Sustainability", note: "Our framework for measurable accountability." },
  { href: "/blog", title: "Research & Insights", note: "Technical writing on material selection." },
  { href: "/contact", title: "Contact us", note: "Share your project parameters with our specialists." },
];

export default function NotFound() {
  return (
    <>
      <section className="nf">
        <div className="nf__inner">
          <p className="nf__code">404</p>
          <h1 className="nf__title">This page could not be found</h1>
          <p className="nf__text">
            The address may have changed, or the page may never have existed.
            Nothing is broken on your side — pick up from one of the sections below.
          </p>

          <nav className="nf__nav" aria-label="Suggested pages">
            <ul className="nf__list">
              {DESTINATIONS.map((item) => (
                <li key={item.href} className="nf__item">
                  <Link href={item.href} className="nf__link">
                    <span className="nf__link-title">{item.title}</span>
                    <span className="nf__link-note">{item.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/" className="nf__home">
            Back to home
          </Link>
        </div>
      </section>
    </>
  );
}
