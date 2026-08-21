import "@/styles/post.css";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/wordpress";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/site";
import { stripHtml } from "@/lib/html";

export const revalidate = 3600;

export async function generateMetadata() {
  const page =
    (await getPageBySlug("terms-of-service")) ??
    (await getPageBySlug("terms"));
  return buildMetadata({
    title: page?.acf?.seo_title || stripHtml(page?.title?.rendered) || "Terms of Service",
    description:
      page?.acf?.seo_description ||
      "The terms that govern use of the MERWADJ website and the information published on it.",
    path: "/terms-of-service",
  });
}

export default async function TermsOfServicePage() {
  const page =
    (await getPageBySlug("terms-of-service")) ??
    (await getPageBySlug("terms"));
  if (!page) notFound();

  return (
    <>
      <div className="post-page">
        <div className="post-narrow">
          <h1
            className="post-single__title"
            dangerouslySetInnerHTML={{ __html: page.title?.rendered || "" }}
          />
          <hr className="post-single__divider" />
        </div>
        <div className="post-narrow post-narrow--body">
          <div
            className="post-single__content"
            dangerouslySetInnerHTML={{ __html: page.content?.rendered || "" }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
