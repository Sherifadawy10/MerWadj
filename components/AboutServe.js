import Link from "next/link";
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
  title: "WHO WE SERVE",
  description:
    "Boutique hospitality, sustainable commercial developments, and the architects, designers, and contractors who bring them to life.",
  buttonText: "BOOK A CONSULTATION",
  buttonUrl: "/contact",
};

export default function AboutServe({ page }) {
  const acf = page?.acf || {};

  const title = acf.serve_title || fallback.title;
  const description = acf.serve_description || fallback.description;
  const buttonText = acf.serve_button_text || fallback.buttonText;
  const buttonUrl = acf.serve_button_url || fallback.buttonUrl;
  const imageUrl = getImageUrl(acf.serve_image);

  return (
    <section className="about-serve">
      <div
        className="about-serve__image"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />

      <div className="about-serve__panel">
        <div className="about-serve__content">
          <Reveal>
            <h2 className="about-serve__title">{title}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="about-serve__desc">{description}</p>
          </Reveal>
          <Reveal delay={200}>
            <Link href={buttonUrl} className="about-serve__button">
              {buttonText}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
