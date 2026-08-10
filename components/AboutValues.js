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
  eyebrow: "FOUNDATION",
  title: "OUR CORE VALUES",
  items: [
    { heading: "CUSTOMER FOCUS", text: "Your success is our primary metric" },
    { heading: "QUALITY", text: "International standards, delivered consistently" },
    { heading: "INTEGRITY", text: "We lead with radical transparency" },
    { heading: "ACCOUNTABILITY", text: "Responsible from source to site" },
    { heading: "COLLABORATION", text: "A global network working for you" },
    { heading: "SUSTAINABILITY", text: "Rooted in environmental stewardship." },
    { heading: "EFFICIENCY", text: "Streamlined processes, maximized value" },
  ],
};

export default function AboutValues({ page }) {
  const acf = page?.acf || {};

  const eyebrow = acf.values_eyebrow || fallback.eyebrow;
  const title = acf.values_title || fallback.title;

  const rawItems = Array.isArray(acf.values_items) && acf.values_items.length
    ? acf.values_items
    : fallback.items;

  const [firstItem, ...restItems] = rawItems;

  return (
    <section className="about-values">
      <div className="about-values__grid">

        {/* Header cell — spans 2 columns */}
        <Reveal className="about-values__header-wrap">
          <div className="about-values__header">
            <p className="about-values__eyebrow">{eyebrow}</p>
            <h2 className="about-values__title">{title}</h2>
          </div>
        </Reveal>

        {/* First value card — light bg, top-right */}
        {firstItem && (
          <Reveal delay={80}>
            <div className="about-values__card about-values__card--light">
              {getImageUrl(firstItem.value_icon || firstItem.icon) && (
                <Image
                  src={getImageUrl(firstItem.value_icon || firstItem.icon)}
                  alt=""
                  fill
                  className="about-values__card-icon"
                  aria-hidden="true"
                />
              )}
              <h3 className="about-values__card-heading">{firstItem.value_heading || firstItem.heading}</h3>
              <p className="about-values__card-text">{firstItem.value_text || firstItem.text}</p>
            </div>
          </Reveal>
        )}

        {/* Remaining value cards — dark bg */}
        {restItems.map((item, i) => {
          const iconUrl = getImageUrl(item.value_icon || item.icon);
          const heading = item.value_heading || item.heading || "";
          const text = item.value_text || item.text || "";
          return (
            <Reveal key={i} delay={(i + 2) * 60}>
              <div className="about-values__card about-values__card--dark">
                {iconUrl && (
                  <Image
                    src={iconUrl}
                    alt=""
                    fill
                    className="about-values__card-icon"
                    aria-hidden="true"
                  />
                )}
                <h3 className="about-values__card-heading">{heading}</h3>
                <p className="about-values__card-text">{text}</p>
              </div>
            </Reveal>
          );
        })}

      </div>
    </section>
  );
}
