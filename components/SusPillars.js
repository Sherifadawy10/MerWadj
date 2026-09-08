/*
 * Review 03 item 23. These four are the live copy: the page has no
 * sus_pillars_* fields in ACF, so this fallback is what renders.
 * Text is the client's, verbatim.
 */
const fallback = {
  heading: "STRUCTURED ACCOUNTABILITY",
  subtitle:
    "We break down our sustainability goals into actionable, measurable pillars across our entire supply chain.",
  items: [
    {
      number: "01",
      title: "RESOURCE CONSERVATION",
      text: "Raw material efficiency, reduced ecological footprint at extraction, and sourcing with intention.",
    },
    {
      number: "02",
      title: "ETHICAL MANUFACTURING",
      text: "Alignment with UN Conventions for labor rights. Safe, fair working conditions with no exceptions.",
    },
    {
      number: "03",
      title: "WASTE MANAGEMENT",
      text: "Water recycling, stone dust reuse, and packaging waste minimization. Circular economy principles in action.",
    },
    {
      number: "04",
      title: "TRANSPARENCY & REPORTING",
      text: "ISO 14001 and 45001 alignment, transparent LCA data, and readiness for your ESG reporting.",
    },
  ],
};

export default function SusPillars({ page }) {
  const acf = page?.acf || {};

  const heading = acf.sus_pillars_heading || fallback.heading;
  const subtitle = acf.sus_pillars_subtitle || fallback.subtitle;

  const rawItems =
    Array.isArray(acf.sus_pillars_items) && acf.sus_pillars_items.length
      ? acf.sus_pillars_items
      : fallback.items;

  return (
    <section className="sus-pillars">
      <div data-anim="0" className="sus-pillars__header">
        <h2 className="sus-pillars__heading">{heading}</h2>
        <p className="sus-pillars__subtitle">{subtitle}</p>
      </div>

      <div className="sus-pillars__grid">
        {rawItems.map((item, i) => {
          const number = item.item_number || item.number || `0${i + 1}`;
          const title = item.item_title || item.title || "";
          const text = item.item_text || item.text || "";
          return (
            <div key={i} data-anim={String(i * 100)} className="sus-pillars__item">
              <p className="sus-pillars__item-number">{number}</p>
              <div className="sus-pillars__item-line" />
              <h3 className="sus-pillars__item-title">{title}</h3>
              <p className="sus-pillars__item-text">{text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
