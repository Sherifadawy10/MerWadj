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
  title: "SYMBOLISM\nOF STRUCTURE",
  description:
    "Every element of our identity reflects our commitment to longevity, responsibility, and the harmony between human ambition and natural systems.",
  cards: [
    {
      heading: "ROOTED IN THE EARTH",
      text: "Rooted in the earth. Honed by nature. Each material we source carries the memory of millennia — and a clear path forward with verified environmental data.",
    },
    {
      heading: "THE GREEN",
      text: "Sustainability is not an afterthought. It is our starting point. Every product includes transparent carbon data, so you can build with confidence and accountability.",
    },
    {
      heading: "THE PYRAMID",
      text: "Enduring. Precise. Purposeful. Like the structures that have stood for thousands of years, we build systems and relationships designed to last.",
    },
    {
      heading: "THE PRECISION",
      text: "From quarry to construction site, every step is measured, tracked, and optimized. No guesswork. No surprises. Just meticulous execution.",
    },
  ],
};

export default function AboutSymbolism({ page }) {
  const acf = page?.acf || {};

  const rawTitle = acf.symbolism_title || fallback.title;
  const description = acf.symbolism_description || fallback.description;

  const rawCards = Array.isArray(acf.symbolism_cards) && acf.symbolism_cards.length
    ? acf.symbolism_cards
    : fallback.cards;

  return (
    <section className="about-symbolism">
      <div className="about-symbolism__inner">

        <Reveal>
          <div className="about-symbolism__header">
            <h2 className="about-symbolism__title">
              {rawTitle.split("\n").map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h2>
            <p className="about-symbolism__desc">{description}</p>
          </div>
        </Reveal>

        <div className="about-symbolism__grid">
          {rawCards.map((card, i) => {
            const iconUrl = getImageUrl(card.card_icon || card.icon);
            const heading = card.card_heading || card.heading || "";
            const text = card.card_text || card.text || "";
            return (
              <Reveal key={i} delay={i * 80}>
                <div className="about-symbolism__card">
                  <div className="about-symbolism__card-icon-wrap">
                    {iconUrl && (
                      <Image
                        src={iconUrl}
                        alt=""
                        fill
                        className="about-symbolism__card-icon"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="about-symbolism__card-body">
                    <h3 className="about-symbolism__card-heading">{heading}</h3>
                    <p className="about-symbolism__card-text">{text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
