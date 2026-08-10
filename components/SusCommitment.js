function getImageUrl(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field.url || field.sizes?.["2048x2048"] || field.sizes?.large || "";
  }
  return "";
}

const fallback = {
  eyebrow: "OUR COMMITMENT",
  title: "THE PATH TO CARBON TRANSPARENCY",
  text: "A structured framework toward measurable accountability. We're building systems for carbon labeling, supply chain visibility, and environmental impact reduction — one milestone at a time.",
};

export default function SusCommitment({ page }) {
  const acf = page?.acf || {};

  const eyebrow = acf.sus_commitment_eyebrow || fallback.eyebrow;
  const title = acf.sus_commitment_title || fallback.title;
  const text = acf.sus_commitment_text || fallback.text;
  const imageUrl = getImageUrl(acf.sus_commitment_image);

  return (
    <section className="sus-commitment">
      <div
        className="sus-commitment__bg"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
      {/* <div className="sus-commitment__overlay" /> */}

      <div className="sus-commitment__content">
        <p className="sus-commitment__eyebrow">{eyebrow}</p>
        <h2 className="sus-commitment__title">{title}</h2>
        <p className="sus-commitment__text">{text}</p>
      </div>
    </section>
  );
}
