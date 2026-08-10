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
  eyebrow: "OUR COMMITMENTS",
  title: "HOW WE WORK",
  intro: "Verified carbon data, EPDs, and compliance documentation for every product",
  blocks: [
    {
      heading: "TECHNICAL GUIDANCE",
      text: "Technical specifications you can build from; accurate, detailed, and aligned with real-world installation requirements.",
    },
    {
      heading: "ENGINEERING PRECISION",
      text: "De-risked supply chains, project-ready timelines, and logistics managed end-to-end so you can focus on your work.",
    },
    {
      heading: "PROCUREMENT RESILIENCE",
      text: "De-risked supply chains, project-ready timelines",
    },
    {
      heading: "EXCEPTIONAL CLIENT EXPERIENCE",
      text: "Responsive, clear, and accountable from first conversation to final delivery",
    },
  ],
};

export default function AboutCommitments({ page }) {
  const acf = page?.acf || {};

  const eyebrow = acf.commitments_eyebrow || fallback.eyebrow;
  const title = acf.commitments_title || fallback.title;
  const intro = acf.commitments_intro || fallback.intro;
  const imageUrl = getImageUrl(acf.commitments_image);

  const rawBlocks = Array.isArray(acf.commitments_blocks) && acf.commitments_blocks.length
    ? acf.commitments_blocks
    : fallback.blocks;

  return (
    <section className="about-commitments">
      <div className="about-commitments__left">
        <div className="about-commitments__left-inner">
          <Reveal>
            <p className="about-commitments__eyebrow">{eyebrow}</p>
            <h2 className="about-commitments__title">{title}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="about-commitments__intro">{intro}</p>
          </Reveal>

          <div className="about-commitments__blocks">
            {rawBlocks.map((block, i) => {
              const heading = block.block_heading || block.heading || "";
              const text = block.block_text || block.text || "";
              return (
                <Reveal key={i} delay={160 + i * 80}>
                  <div className="about-commitments__block">
                    <h3 className="about-commitments__block-heading">{heading}</h3>
                    <p className="about-commitments__block-text">{text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="about-commitments__right"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
    </section>
  );
}
