import Reveal from "@/components/Reveal";

const fallback = {
  title: "ABOUT",
  intro:
    "MerWadj specializes in supplying proprietary and globally sourced finishes for hospitality and commercial projects. We work alongside architects, designers, and contractors — delivering carbon transparency, engineering precision, and procurement resilience at every stage.",
  subheading: "WHAT WE SUPPLY",
  text: "Our own product line features culturally distinctive, eco-conscious finishes developed from regions with deep material heritage. Alongside that, we source from vetted global suppliers to give you a complete palette of natural surfaces, high-performance coatings, and specialty finishes. Whether you need the timeless beauty of Egyptian marble or sustainable alternatives from anywhere in the world, we bring it to you with full transparency and care.",
};

export default function AboutSummary({ page }) {
  const acf = page?.acf || {};

  const title = acf.summary_title || fallback.title;
  const intro = acf.summary_intro || fallback.intro;
  const subheading = acf.summary_subheading || fallback.subheading;
  const text = acf.summary_text || fallback.text;

  return (
    <section className="about-summary">
      <div className="about-summary__inner">
        <Reveal>
          <h2 className="about-summary__title">{title}</h2>
        </Reveal>

        <div className="about-summary__right">
          <Reveal delay={80}>
            <p className="about-summary__intro">{intro}</p>
          </Reveal>
          <Reveal delay={160}>
            <div className="about-summary__block">
              <h3 className="about-summary__subheading">{subheading}</h3>
              <p className="about-summary__text">{text}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
