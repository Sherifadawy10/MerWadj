const fallback = {
  eyebrow: "OUR JOURNEY",
  title: "We're building a more transparent future.\nStep by step.",
  steps: [
    {
      number: "01",
      heading: "Where we are today",
      text: "We are vetting our suppliers and choosing our logistics partners. Together, we are working to secure verified EPDs and reliable carbon data.",
    },
    {
      number: "02",
      heading: "Where we are going",
      text: "Full carbon labeling on every product. Complete supply chain visibility. Measurable impact reduction.",
    },
    {
      number: "03",
      heading: "Our promise",
      text: "We won't claim what we don't yet have. But we will be transparent about every step forward. And we will bring you along with us.",
    },
  ],
};

export default function SusJourney({ page }) {
  const acf = page?.acf || {};

  const eyebrow = acf.sus_journey_eyebrow || fallback.eyebrow;
  const title = acf.sus_journey_title || fallback.title;

  const rawSteps =
    Array.isArray(acf.sus_journey_steps) && acf.sus_journey_steps.length
      ? acf.sus_journey_steps
      : fallback.steps;

  return (
    <section className="sus-journey">
      <div className="sus-journey__grid">
        <div data-anim="0" className="sus-journey__header">
          <p className="sus-journey__eyebrow">{eyebrow}</p>
          <h2 className="sus-journey__title">{title}</h2>
        </div>

        {rawSteps.map((step, i) => {
          const number = step.step_number || step.number || `0${i + 1}`;
          const heading = step.step_heading || step.heading || "";
          const text = step.step_text || step.text || "";
          return (
            <div key={i} data-anim={String((i + 1) * 100)} className="sus-journey__step">
              <p className="sus-journey__step-number">{number}</p>
              <div className="sus-journey__step-line" />
              <h3 className="sus-journey__step-heading">{heading}</h3>
              <p className="sus-journey__step-text">{text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
