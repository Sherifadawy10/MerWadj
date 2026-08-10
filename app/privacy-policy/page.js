import "@/styles/post.css";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/wordpress";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getPageBySlug("privacy-policy");
  return {
    title: page?.acf?.seo_title || page?.title?.rendered || "Privacy Policy — Merwadj",
    description: page?.acf?.seo_description || undefined,
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug("privacy-policy");
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
