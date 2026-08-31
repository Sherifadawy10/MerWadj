import Image from "next/image";
import Reveal from "@/components/Reveal";

function getImageUrl(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field.url || field.sizes?.["2048x2048"] || field.sizes?.large || "";
  }
  return "";
}

const fallback = {
  eyebrow: "THE NAME",
  title: "MERWADJ",
  description:
    "Our name honors Egyptian heritage while embracing contemporary sustainable building practices.",
  mer_title: "MER",
  mer_text:
    "In ancient Egyptian, MER (𓇋𓅓𓂋) means pyramid — the apex of human engineering, a monument built to endure millennia through precision, proportion, and purpose.",
  wadj_title: "WADJ",
  wadj_text:
    "WADJ (𓇌𓆇𓏏𓂋) means green, fresh, and flourishing — embodying the living systems, sustainable cycles, and regenerative thinking that define our approach.",
  together_eyebrow: "TOGETHER",
  together_title_bold: "MERWADJ",
  together_title_rest: "EMBODIES OUR PHILOSOPHY",
  together_description:
    "Building enduring structures that nurture rather than deplete. We are the Green Pyramid—solid in foundation, sustainable in practice, and timeless in vision.",
};

export default function AboutName({ page }) {
  const acf = page?.acf || {};

  const eyebrow = acf.name_eyebrow || fallback.eyebrow;
  const title = acf.name_title || fallback.title;
  const description = acf.name_description || fallback.description;

  const merIcon = getImageUrl(acf.name_mer_icon);
  const merTitle = acf.name_mer_title || fallback.mer_title;
  const merText = acf.name_mer_text || fallback.mer_text;

  const wadjIcon = getImageUrl(acf.name_wadj_icon);
  const wadjTitle = acf.name_wadj_title || fallback.wadj_title;
  const wadjText = acf.name_wadj_text || fallback.wadj_text;

  const togetherEyebrow = acf.name_together_eyebrow || fallback.together_eyebrow;
  const togetherTitleBold = acf.name_together_title_bold || fallback.together_title_bold;
  const togetherTitleRest = acf.name_together_title_rest || fallback.together_title_rest;
  const togetherDescription = acf.name_together_description || fallback.together_description;

  return (
    <section className="about-name" id="about-content">
      <div className="about-name__inner">

        {/* Header row */}
        <div className="about-name__header">
          <Reveal>
            <div className="about-name__header-left">
              <p className="about-name__eyebrow">{eyebrow}</p>
              <h2 className="about-name__title">{title}</h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="about-name__desc">{description}</p>
          </Reveal>
        </div>

        {/* Two-card panel */}
        <Reveal delay={150}>
          <div className="about-name__panel">
            <div className="about-name__card">
              {merIcon && (
                <Image
                  src={merIcon}
                  alt=""
                  fill
                  className="about-name__card-icon"
                  aria-hidden="true"
                />
              )}
              <h3 className="about-name__card-title">{merTitle}</h3>
              <p className="about-name__card-text">{merText}</p>
            </div>

            <div className="about-name__divider" aria-hidden="true" />

            <div className="about-name__card">
              {wadjIcon && (
                <Image
                  src={wadjIcon}
                  alt=""
                  fill
                  className="about-name__card-icon"
                  aria-hidden="true"
                />
              )}
              <h3 className="about-name__card-title">{wadjTitle}</h3>
              <p className="about-name__card-text">{wadjText}</p>
            </div>
          </div>
        </Reveal>

        {/* Together row */}
        <Reveal delay={200}>
          <div className="about-name__together">
            <div className="about-name__together-left">
              <p className="about-name__together-eyebrow">{togetherEyebrow}</p>
              <p className="about-name__together-heading">
                <strong>{togetherTitleBold}</strong>{" "}
                <span>{togetherTitleRest}</span>
              </p>
            </div>
            <p className="about-name__together-desc">{togetherDescription}</p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
