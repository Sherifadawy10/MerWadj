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
  eyebrow: "GENESIS",
  title: "HOW MERWADJ WAS BORN",
  blocks: [
    {
      heading: "MERWADJ WAS BORN",
      text: "Two worlds. One vision. The Green Pyramid.\nBeautiful materials, sustainably sourced. Verified carbon data. Seamless logistics from quarry to site.\nNo trade-offs. No shortcuts. Just timeless design, built responsibly.",
    },
    {
      heading: "THE BEGINNING",
      text: "Every great building starts with a foundation. And every great company starts with a story.\nMerWadj began with two people from two different worlds — both from the land of the pyramids.\nOne lived in the language of design — light, texture, space, and the quiet thrill of a perfect material meeting its moment.\nThe other lived in the rhythm of engineering — rigs, operations, ports, planes, supply chains, and the satisfaction of a promise delivered on time.",
    },
    {
      heading: "THE MEETING",
      text: "They didn't set out to start a company. They set out to solve something they both cared about deeply.\nThe architect wanted materials to bring to her new home that told a story — of heritage, beauty, and responsible craftsmanship.\nThe engineer wanted systems that worked — transparent, efficient, and precise.\nAnd both wanted the same thing: sustainability that wasn't just a label, but a truth.",
    },
    {
      heading: "THE DISCOVERY",
      text: "Around the world, a powerful movement is underway — toward sustainability, carbon transparency, and responsible building. Many are contributing. But there is still so much to do.\nThey decided to add their piece. To bring the beauty and heritage of Egypt and other authentic regions from around the world into this global effort — with precision, care, and commitment.",
    },
  ],
};

export default function AboutGenesis({ page }) {
  const acf = page?.acf || {};

  const eyebrow = acf.genesis_eyebrow || fallback.eyebrow;
  const title = acf.genesis_title || fallback.title;
  const imageUrl = getImageUrl(acf.genesis_image);

  const rawBlocks = Array.isArray(acf.genesis_blocks) && acf.genesis_blocks.length
    ? acf.genesis_blocks
    : fallback.blocks;

  return (
    <section className="about-genesis">
      <div className="about-genesis__left">
        <div className="about-genesis__left-inner">
          <Reveal>
            <p className="about-genesis__eyebrow">{eyebrow}</p>
            <h2 className="about-genesis__title">{title}</h2>
          </Reveal>

          <div className="about-genesis__blocks">
            {rawBlocks.map((block, i) => {
              const heading = block.block_heading || block.heading || "";
              const text = block.block_text || block.text || "";
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="about-genesis__block">
                    <h3 className="about-genesis__block-heading">{heading}</h3>
                    <div className="about-genesis__block-text">
                      {text.split("\n").map((line, j) => (
                        <p key={j}>{line}</p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="about-genesis__right"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
    </section>
  );
}
