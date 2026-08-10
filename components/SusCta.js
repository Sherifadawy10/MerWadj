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
  title: "QUESTIONS ABOUT OUR APPROACH?",
  text: "We welcome scrutiny and collaboration. If you have feedback on our methodology or want to discuss sustainability partnerships, let's talk.",
  buttonText: "BOOK A CONSULTATION",
  buttonUrl: "/contact",
};

export default function SusCta({ page }) {
  const acf = page?.acf || {};

  const imageUrl = getImageUrl(acf.sus_cta_image);
  const title = acf.sus_cta_title || fallback.title;
  const text = acf.sus_cta_text || fallback.text;
  const buttonText = acf.sus_cta_button_text || fallback.buttonText;
  const buttonUrl = acf.sus_cta_button_url || fallback.buttonUrl;

  return (
    <section className="sus-cta">
      <div
        className="sus-cta__image"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />

      <div className="sus-cta__panel">
        <div className="sus-cta__content">
          <h2 data-anim="0" className="sus-cta__title">{title}</h2>
          <p data-anim="160" className="sus-cta__text">{text}</p>
          <Link data-anim="300" href={buttonUrl} className="sus-cta__button">
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
