import Image from "next/image";

function getImageUrl(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field.url || field.sizes?.thumbnail || field.sizes?.medium || field.sizes?.large || "";
  }
  return "";
}

const fallback = {
  label: "PRODUCT",
  items: [
    {
      title: "RAW MATERIALS",
      text: "Protect the planet by choosing products that conserve natural resources. Reduce your carbon footprint with materials that make a difference through responsible sourcing.",
    },
    {
      title: "EXTRACTION (QUARRYING)",
      text: "Careful consideration to quarried sites with social and environmental focus. Strategies implemented for less impact on the environment during extraction phases.",
    },
    {
      title: "FACTORIES PROCESSES",
      text: "Optimize cutting, recycle water, and manage waste. Ensure the use of eco-friendly finishing materials including sealants and paint. Uphold global Fair Labor standards aligned with UN Conventions.",
    },
    {
      title: "FACTORIES SECONDARY PROCESSES",
      text: "Implementation of energy-efficient finishing techniques and systematic reuse of stone dust byproducts to minimize industrial waste output.",
    },
    {
      title: "PACKAGING & TRANSPORTATION",
      text: "Implementation of energy-efficient finishing techniques and systematic reuse of stone dust byproducts to minimize industrial waste output.",
    },
    {
      title: "INSTALLATION & USE PHASE",
      text: "Encourage clients to select durable, low-maintenance stone. Promote reuse and recycling of stone waste. Prioritize suppliers offering eco-friendly options.",
    },
    {
      title: "ENVIRONMENTAL PERFORMANCE & ESG REPORTING",
      text: "Provide life-cycle assessment (LCA) data and clear care instructions. Audit regularly, set KPIs, follow ISO 14001 & 45001, and report via ESG updates.",
    },
  ],
};

export default function SusLifecycle({ page }) {
  const acf = page?.acf || {};

  const label = acf.sus_lifecycle_label || fallback.label;

  const rawItems =
    Array.isArray(acf.sus_lifecycle_items) && acf.sus_lifecycle_items.length
      ? acf.sus_lifecycle_items
      : fallback.items;

  return (
    <section className="sus-lifecycle">
      <div className="sus-lifecycle__left">
        <p data-anim="0" className="sus-lifecycle__label">{label}</p>
      </div>

      <div className="sus-lifecycle__right">
        {rawItems.map((item, i) => {
          const iconUrl = getImageUrl(item.item_icon);
          const title = item.item_title || item.title || "";
          const text = item.item_text || item.text || "";
          return (
            <div key={i} data-anim={String(i * 60)} className="sus-lifecycle__item">
              <div className="sus-lifecycle__item-icon-wrap">
                {iconUrl && (
                  <Image
                    src={iconUrl}
                    alt=""
                    fill
                    className="sus-lifecycle__item-icon"
                  />
                )}
              </div>
              <div className="sus-lifecycle__item-body">
                <h3 className="sus-lifecycle__item-title">{title}</h3>
                <p className="sus-lifecycle__item-text">{text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
