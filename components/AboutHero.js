import Link from "next/link";

function getImageUrl(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field.url || field.sizes?.["2048x2048"] || field.sizes?.large || "";
  }
  return "";
}

const fallback = {
  eyebrow: "ABOUT | MERWADJ SUSTAINABLE PROCUREMENT",
  title: "MERWADJ",
  subtitleLine1: "Beautiful Materials | Verified Impact",
  subtitleLine2: "Sustainably sourced. Responsibly built. Seamlessly delivered.",
  buttonText: "READ MORE",
  buttonUrl: "#about-content",
};

export default function AboutHero({ page }) {
  const acf = page?.acf || {};

  const bgUrl = getImageUrl(acf.about_hero_background_image);
  const eyebrow = acf.about_hero_eyebrow || fallback.eyebrow;
  const title = acf.about_hero_title || fallback.title;
  const subtitleLine1 = acf.about_hero_subtitle_line1 || fallback.subtitleLine1;
  const subtitleLine2 = acf.about_hero_subtitle_line2 || fallback.subtitleLine2;
  const buttonText = acf.about_hero_button_text || fallback.buttonText;
  const buttonUrl = acf.about_hero_button_url || fallback.buttonUrl;

  return (
    <section className="about-hero-shell">
      <div
        className="about-hero-bg"
        style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
      />
      <div className="about-hero-overlay" />

      <div className="about-hero-layout">
        <div className="about-hero-content">
          <p className="about-hero-eyebrow">{eyebrow}</p>
          <h1 className="about-hero-title">{title}</h1>
          <div className="about-hero-subtitle">
            <p>{subtitleLine1}</p>
            <p>{subtitleLine2}</p>
          </div>
          <Link href={buttonUrl} className="about-hero-button">
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
