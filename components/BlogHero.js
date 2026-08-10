function getImageUrl(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field.url || field.sizes?.["2048x2048"] || field.sizes?.large || "";
  }
  return "";
}

const fallback = {
  eyebrow: "BLOG",
  title: "NEWS & INSIGHTS",
  text: "Insights, ideas, and expertise to help you elevate customer experience and grow with purpose.",
};

export default function BlogHero({ page }) {
  const acf = page?.acf || {};

  const bgUrl  = getImageUrl(acf.blog_hero_image);
  const eyebrow = acf.blog_hero_eyebrow || fallback.eyebrow;
  const title   = acf.blog_hero_title   || fallback.title;
  const text    = acf.blog_hero_text    || fallback.text;

  return (
    <section className="blog-hero">
      <div
        className="blog-hero__bg"
        style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
      />
      <div className="blog-hero__overlay" />

      <div className="blog-hero__content">
        <p className="blog-hero__eyebrow">{eyebrow}</p>
        <h1 className="blog-hero__title">{title}</h1>
        <p className="blog-hero__text">{text}</p>
      </div>
    </section>
  );
}
