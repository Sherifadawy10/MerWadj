import Link from "next/link";
import { getMediaById } from "@/lib/wordpress";

const fallbackHero = {
  title: "Where architectural vision meets material expression.",
  text: "Install ACF in WordPress, open the page with slug home, and fill the dedicated hero fields to replace this fallback content.",
  buttonText: "Explore Journal",
  buttonUrl: "/blog",
};

function getImageUrl(imageField) {
  if (!imageField) return "";
  if (typeof imageField === "string") return imageField;
  if (typeof imageField === "object") {
    return imageField.url || imageField.sizes?.["2048x2048"] || imageField.sizes?.large || "";
  }
  return "";
}

export default async function Hero({ page }) {
  const acf = page?.acf;
  const hasConfiguredHero = Boolean(
    acf &&
      (acf.hero_title ||
        acf.hero_text ||
        acf.hero_background_image ||
        acf.hero_button_text ||
        acf.hero_button_url)
  );
  const source = hasConfiguredHero ? acf : fallbackHero;

  let rawImage = source.hero_background_image;
  if (typeof rawImage === "number") {
    rawImage = await getMediaById(rawImage);
  }
  const backgroundImage = getImageUrl(rawImage);
  const title = source.hero_title || source.title || fallbackHero.title;
  const text = source.hero_text || source.text || fallbackHero.text;
  const buttonText = source.hero_button_text || source.buttonText || fallbackHero.buttonText;
  const buttonUrl = source.hero_button_url || source.buttonUrl || fallbackHero.buttonUrl;

  return (
    <section className="hero-shell">
      <div
        className="hero-background"
        style={{
          backgroundImage: backgroundImage
            ? `linear-gradient(180deg, rgba(0, 0, 0, 0) 40.53%, rgba(25, 25, 25, 0.8) 76.09%), url(${backgroundImage})`
            : "linear-gradient(180deg, rgba(0, 0, 0, 0) 40.53%, rgba(25, 25, 25, 0.8) 76.09%)",
        }}
      />

      <div className="hero-layout">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-text">{text}</p>
          <Link href={buttonUrl} className="hero-button">{buttonText}</Link>
        </div>
      </div>
    </section>
  );
}
