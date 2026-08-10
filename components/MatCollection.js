import Link from "next/link";
import Image from "next/image";

function getImageUrl(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field.url || field.sizes?.["2048x2048"] || field.sizes?.large || "";
  }
  return "";
}

const fallback = {
  eyebrow: "COMING SOON",
  title: "NEW COLLECTION",
  text: "Each MERWADJ collection presents a refined selection of natural stone and interior finishes designed to work in harmony. Inspired by architecture, culture, and nature, our collections bring together materials that elevate contemporary spaces with quiet elegance and enduring quality.",
};

export default function MatCollection({ page }) {
  const acf = page?.acf || {};

  const eyebrow = acf.mat_collection_eyebrow || fallback.eyebrow;
  const title = acf.mat_collection_title || fallback.title;
  const text = acf.mat_collection_text || fallback.text;
  const buttonLink = acf.mat_collection_button_url;
  const buttonText = acf.mat_collection_button_text || (typeof buttonLink === "object" ? buttonLink?.title : null) || "BOOK A CONSULTATION";
  const buttonUrl = (typeof buttonLink === "object" ? buttonLink?.url : buttonLink) || "/contact";
  const img1 = getImageUrl(acf.mat_collection_image_1);
  const img2 = getImageUrl(acf.mat_collection_image_2);

  return (
    <section className="mat-collection">
      <div className="mat-collection__left">
        <p data-anim="0" className="mat-collection__eyebrow">{eyebrow}</p>
        <h2 data-anim="120" className="mat-collection__title">{title}</h2>
        <p data-anim="240" className="mat-collection__text">{text}</p>
        <Link data-anim="340" href={buttonUrl} className="mat-collection__button">
          {buttonText}
        </Link>
      </div>

      <div className="mat-collection__right">
        {img1 && (
          <div data-anim="80" className="mat-collection__img-wrap mat-collection__img-wrap--1">
            <Image src={img1} alt="" fill className="mat-collection__img" />
          </div>
        )}
        {img2 && (
          <div data-anim="200" className="mat-collection__img-wrap mat-collection__img-wrap--2">
            <Image src={img2} alt="" fill className="mat-collection__img" />
          </div>
        )}
      </div>
    </section>
  );
}
