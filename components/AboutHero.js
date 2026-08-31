import ScrollLink from "@/components/ScrollLink";

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
  /*
   * "READ MORE" means read on down this page, so it only ever takes a
   * same-page anchor. The ACF field held /materials, which sent the reader
   * off to the catalogue instead — reported by the client on 31.08.2026.
   * An editor can still retarget it, as long as the value is an anchor.
   */
  const configuredUrl = acf.about_hero_button_url;
  const buttonUrl =
    typeof configuredUrl === "string" && configuredUrl.startsWith("#")
      ? configuredUrl
      : fallback.buttonUrl;

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
          <ScrollLink href={buttonUrl} className="about-hero-button">
            {buttonText}
          </ScrollLink>
        </div>
      </div>
    </section>
  );
}
