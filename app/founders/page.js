import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { getPageBySlug, getMediaById, displayPageTitle } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/site";
import { stripHtml } from "@/lib/html";

export const revalidate = 600;

export async function generateMetadata() {
  const page = await getPageBySlug("founders");
  return buildMetadata({
    title:
      page?.acf?.seo_title ||
      displayPageTitle(stripHtml(page?.title?.rendered)) ||
      "Meet Us",
    description:
      page?.acf?.seo_description ||
      "The architects behind MERWADJ, and the engineering discipline they bring to material selection.",
    path: "/founders",
  });
}

function formatParagraphs(text) {
  if (!text) return "";
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  return text
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((p) => `<p>${p.trim().replace(/\n/g, "<br />")}</p>`)
    .join("");
}

async function resolveImage(field) {
  if (!field) return null;
  if (typeof field === "number") {
    const media = await getMediaById(field);
    return media?.url || null;
  }
  if (typeof field === "object") {
    return field.url || field.sizes?.large || null;
  }
  return typeof field === "string" ? field : null;
}

const fallback = {
  eyebrow: "FOUNDERS",
  title: "The People Behind the Vision",
  description:
    "Two architects united by a shared commitment to material integrity and spatial precision.",
  founders: [
    {
      name: "Founder Name",
      role: "Co-founder & Design Director",
      bio: "Add ACF fields to replace this placeholder content. Install ACF, create a field group assigned to the page with slug 'founders', and fill in the repeater.",
      photo: null,
      photo_label: "Co-founder",
      right_description:
        "A brief description of this founder's philosophy and approach.",
      expertise_items: ["Spatial Design", "Material Research", "Client Strategy"],
      qualifications_items: ["M.Arch, Example University", "Licensed Architect"],
    },
  ],
  vision_title: "Shared Vision",
  vision_description:
    "Both founders believe architecture should serve people as much as it serves ideas.",
  vision_quote:
    "Great spaces don't impose — they invite, they breathe, they belong.",
  cta_background: null,
  cta_title: "READY TO DISCUSS YOUR PROJECT?",
  cta_description:
    "Let's explore how Merwadj can bring clarity and intention to your space.",
  cta_button_text: "BOOK A CONSULTATION",
  cta_button_url: "/contact",
};

export default async function FoundersPage() {
  const page = await getPageBySlug("founders");
  if (!page) notFound();

  const acf = page?.acf || {};

  const eyebrow = acf.founders_eyebrow || fallback.eyebrow;
  const title = acf.founders_title || fallback.title;
  const description = acf.founders_description || fallback.description;
  const visionTitle = acf.vision_title || fallback.vision_title;
  const visionDesc = acf.vision_description || fallback.vision_description;
  const visionQuote = acf.vision_quote || fallback.vision_quote;
  const ctaTitle = acf.cta_title || fallback.cta_title;
  const ctaDesc = acf.cta_description || fallback.cta_description;
  const ctaBtnText = acf.cta_button_text || fallback.cta_button_text;
  const ctaBtnUrl = acf.cta_button_url || fallback.cta_button_url;

  const ctaBg = await resolveImage(acf.cta_background);

  const rawFounders = Array.isArray(acf.founders) && acf.founders.length
    ? acf.founders
    : fallback.founders;

  const founders = await Promise.all(
    rawFounders.map(async (f) => ({
      ...f,
      photoUrl: await resolveImage(f.photo),
      expertise_items: Array.isArray(f.expertise_items)
        ? f.expertise_items.map((e) => (typeof e === "object" ? e.item : e))
        : [],
      qualifications_items: Array.isArray(f.qualifications_items)
        ? f.qualifications_items.map((q) => (typeof q === "object" ? q.item : q))
        : [],
    }))
  );

  return (
    <div className="founders-page">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="founders-hero">
        <div className="founders-hero__inner">
          <p className="founders-eyebrow">{eyebrow}</p>
          <div className="founders-hero__row">
            <h1 className="founders-hero__title">{title}</h1>
            <p className="founders-hero__desc">{description}</p>
          </div>
        </div>
      </section>

      {/* ── Founder cards ──────────────────────────────────── */}
      <section className="founders-list">
        {founders.map((founder, i) => (
          <article key={i} className={`founder-card ${i % 2 === 0 ? "founder-card--dark" : "founder-card--light"}`} data-anim={i * 100}>
            <div className="founder-card__photo-col">
              {founder.photoUrl ? (
                <Image
                  src={founder.photoUrl}
                  alt={founder.name}
                  fill
                  className="founder-card__photo"
                />
              ) : (
                <div className="founder-card__photo-placeholder" />
              )}
              {founder.photo_label && (
                <p className="founder-card__photo-label">{founder.photo_label}</p>
              )}
            </div>

            <div className="founder-card__mid">
              <h2 className="founder-card__name">{founder.name}</h2>
              <p className="founder-card__role">{founder.role}</p>
              {founder.bio && (
                <div
                  className="founder-card__bio"
                  dangerouslySetInnerHTML={{ __html: formatParagraphs(founder.bio) }}
                />
              )}
            </div>

            <div className="founder-card__right">
              {founder.right_description && (
                <div
                  className="founder-card__right-desc"
                  dangerouslySetInnerHTML={{ __html: formatParagraphs(founder.right_description) }}
                />
              )}
              {founder.expertise_items.length > 0 && (
                <div className="founder-card__expertise">
                  <p className="founder-card__label">Expertise</p>
                  {founder.expertise_intro && (
                    <div
                      className="founder-card__expertise-intro"
                      dangerouslySetInnerHTML={{ __html: formatParagraphs(founder.expertise_intro) }}
                    />
                  )}
                  <ul className="founder-card__checklist">
                    {founder.expertise_items.map((item, j) => (
                      <li key={j} className="founder-card__check-item">
                        <span className="founder-card__check-icon" aria-hidden="true"><svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.995 6.88232C12.3368 7.22412 12.3368 7.7792 11.995 8.121L4.99502 15.121C4.65322 15.4628 4.09814 15.4628 3.75635 15.121L0.256348 11.621C-0.0854492 11.2792 -0.0854492 10.7241 0.256348 10.3823C0.598145 10.0405 1.15322 10.0405 1.49502 10.3823L4.37705 13.2616L10.7591 6.88232C11.1009 6.54053 11.656 6.54053 11.9978 6.88232H11.995Z" fill="#777777"/>
                        </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {founder.qualifications_items.length > 0 && (
                <div className="founder-card__qualifications">
                  <p className="founder-card__label">Qualifications</p>
                  <ul className="founder-card__qual-list">
                    {founder.qualifications_items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* ── Shared Vision ──────────────────────────────────── */}
      <section className="founders-vision">
        <div className="founders-vision__inner">
          <div className="founders-vision__left" data-anim="0">
            <h2 className="founders-vision__title">{visionTitle}</h2>
            <p className="founders-vision__desc">{visionDesc}</p>
          </div>
          <div className="founders-vision__right" data-anim="100">
            <blockquote className="founders-vision__quote">
              &ldquo;{visionQuote}&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="founders-cta">
        {ctaBg && (
          <div className="founders-cta__image-col">
            <Image src={ctaBg} alt="" fill className="founders-cta__image" />
          </div>
        )}
        <div className={`founders-cta__content ${!ctaBg ? "founders-cta__content--full" : ""}`}>
          <h2 className="founders-cta__title">{ctaTitle}</h2>
          <p className="founders-cta__desc">{ctaDesc}</p>
          <Link href={ctaBtnUrl} className="founders-cta__btn">
            {ctaBtnText}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
