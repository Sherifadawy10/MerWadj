import Image from "next/image";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: "Page not found" };
  }

  return {
    title: page?.acf?.seo_title || page.title.rendered,
    description: page?.acf?.seo_description || page.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() || undefined,
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;

  if (slug === "favicon.ico" || slug === "about" || slug === "terms-of-service" || slug === "privacy-policy" || slug === "terms") {
    notFound();
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="page-wrap page-wrap--narrow">
      <article className="dyn-article">
        {page.featuredImage?.sourceUrl ? (
          <div className="dyn-cover">
            <Image
              src={page.featuredImage.sourceUrl}
              alt={page.featuredImage.alt || page.title.rendered}
              fill
              className="dyn-cover-img"
              sizes="(min-width: 1024px) 896px, 100vw"
              priority
            />
          </div>
        ) : null}

        <div className="dyn-meta">
          <p className="dyn-eyebrow">Page</p>
          <h1
            className="dyn-title"
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />
        </div>

        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </article>
    </div>
  );
}
