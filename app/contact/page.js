import "@/styles/contact.css";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { getPageBySlug, getMediaById } from "@/lib/wordpress";

async function resolveImage(field) {
  if (!field) return null;
  if (typeof field === "number") {
    const media = await getMediaById(field);
    return media?.url || null;
  }
  if (typeof field === "object") {
    return field.url || field.sizes?.large || null;
  }
  return typeof field === "string" ? field : null;
}

const fallback = {
  title: "CONTACT US",
  description:
    "Strategic partnerships begin with precise communication. Share your project parameters and we'll respond with tailored material solutions and technical specifications.",
  features: [
    "RESPONSE WITHIN 3 BUSINESS DAYS",
    "CONFIDENTIAL PROJECT INFORMATION PROTECTED",
    "DIRECT ACCESS TO TECHNICAL SPECIALISTS",
  ],
  button_text: "BOOK A CONSULTATION",
};

const featureIcons = [
  /* clock */
  <svg key="clock" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 0C15.5192 0 20 4.48085 20 10C20 15.5192 15.5192 20 10 20C4.48085 20 0 15.5192 0 10C0 4.48085 4.48085 0 10 0ZM9.0625 4.6875V10C9.0625 10.3125 9.21875 10.6055 9.48047 10.7812L13.2305 13.2812C13.6602 13.5703 14.2422 13.4531 14.5312 13.0195C14.7031 12.0078 14.2695 11.7188L10.9375 9.5V4.6875C10.9375 4.16797 10.5195 3.75 10 3.75C9.47852 3.75 9.0625 4.16797 9.0625 4.6875Z" fill="white" fillOpacity="0.7"/>
  </svg>,
  /* shield */
  <svg key="shield" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 0C10.1797 0 10.3594 0.0390625 10.5235 0.113281L17.8789 3.23438C18.7383 3.59766 19.3789 4.44531 19.375 5.46875C19.3555 9.34375 17.7617 16.4336 11.0313 19.6562C10.3789 19.9688 9.62111 19.9688 8.96877 19.6562C2.2383 16.4336 0.644549 9.34375 0.625018 5.46875C0.621112 4.44531 1.26174 3.59766 2.12111 3.23438L9.48049 0.113281C9.64064 0.0390625 9.82033 0 10 0ZM10 2.60938V17.375C15.3906 14.7656 16.8399 8.98828 16.875 5.52344L10 2.60938Z" fill="white" fillOpacity="0.7"/>
  </svg>,
  /* users */
  <svg key="users" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.5 0C5.87979 0 7 1.12021 7 2.5C7 3.87979 5.87979 5 4.5 5C3.12021 5 2 3.87979 2 2.5C2 1.12021 3.12021 0 4.5 0ZM16 0C17.3798 0 18.5 1.12021 18.5 2.5C18.5 3.87979 17.3798 5 16 5C14.6202 5 13.5 3.87979 13.5 2.5C13.5 1.12021 14.6202 0 16 0ZM0 9.33438C0 7.49375 1.49375 6 3.33438 6H4.66875C5.16563 6 5.6375 6.10938 6.0625 6.30313C6.02188 6.52813 6.00313 6.7625 6.00313 7C6.00313 8.19375 6.52813 9.26562 7.35625 10C7.35 10 7.34375 10 7.33438 10H0.665625C0.3 10 0 9.7 0 9.33438ZM12.6656 10C12.6594 10 12.6531 10 12.6438 10C13.475 9.26562 13.9969 8.19375 13.9969 7C13.9969 6.7625 13.975 6.53125 13.9375 6.30313C14.3625 6.10625 14.8344 6 15.3313 6H16.6656C18.5063 6 20 7.49375 20 9.33438C20 9.70312 19.7 10 19.3344 10H12.6656ZM7 7C7 5.34425 8.34426 4 10 4C11.6557 4 13 5.34425 13 7C13 8.65575 11.6557 10 10 10C8.34426 10 7 8.65575 7 7ZM4 15.1656C4 12.8656 5.86562 11 8.16563 11H11.8344C14.1344 11 16 12.8656 16 15.1656C16 15.625 15.6281 16 15.1656 16H4.83438C4.375 16 4 15.6281 4 15.1656Z" fill="white" fillOpacity="0.7"/>
  </svg>,
];

export async function generateMetadata() {
  const page = await getPageBySlug("contact-us");
  return {
    title: page?.acf?.seo_title || page?.title?.rendered || "Contact Us — Merwadj",
    description: page?.acf?.seo_description || undefined,
  };
}

export default async function ContactPage() {
  const page = await getPageBySlug("contact-us");
  if (!page) notFound();

  const acf = page?.acf || {};

  const title = acf.contact_title || fallback.title;
  const description = acf.contact_description || fallback.description;
  const buttonText = acf.contact_button_text || fallback.button_text;
  const imageUrl = await resolveImage(acf.contact_image);

  const rawFeatures = Array.isArray(acf.contact_features) && acf.contact_features.length
    ? acf.contact_features.map((f) => f.feature_text || "")
    : fallback.features;

  return (
    <>
      <div className="contact-page">
        <div className="contact-split">
          <div className="contact-left">
            <div className="contact-left__inner">
              <h1 className="contact-title">{title}</h1>

              <div className="contact-inner-grid">
                <div className="contact-info">
                  <p className="contact-desc">{description}</p>

                  <ul className="contact-features">
                    {rawFeatures.map((text, i) => (
                      <li key={i} className="contact-feature">
                        <span className="contact-feature__icon">
                          {featureIcons[i % featureIcons.length]}
                        </span>
                        <span className="contact-feature__text">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="contact-form-col">
                  <ContactForm buttonText={buttonText} />
                </div>
              </div>
            </div>
          </div>

          <div
            className="contact-right"
            style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
