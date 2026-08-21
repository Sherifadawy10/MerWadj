import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { getPageBySlug } from "@/lib/wordpress";
import { buildMetadata } from "@/lib/site";
import { excerptFrom, stripHtml } from "@/lib/html";

export const revalidate = 300;

/*
 * Slugs that must never be resolved against WordPress. Static routes in
 * app/ already win over this catch-all, but asset-shaped requests
 * (/favicon.ico, /apple-touch-icon.png, ...) land here and would otherwise
 * be answered with a rendered "page not found" body instead of a 404.
 */
const RESERVED_SLUGS = new Set([
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "apple-touch-icon.png",
  "apple-touch-icon-precomposed.png",
  "browserconfig.xml",
  "manifest.json",
  "site.webmanifest",
]);

function isReserved(slug) {
  return RESERVED_SLUGS.has(slug.toLowerCase()) || slug.includes(".");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (isReserved(slug)) {
    return buildMetadata({ title: "Page not found", path: `/${slug}`, noIndex: true });
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    return buildMetadata({ title: "Page not found", path: `/${slug}`, noIndex: true });
  }

  return buildMetadata({
    title: page?.acf?.seo_title || stripHtml(page.title?.rendered),
    description:
      page?.acf?.seo_description || excerptFrom(page.excerpt?.rendered, 180) || undefined,
    path: `/${slug}`,
    image: page.featuredImage?.sourceUrl || undefined,
  });
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;

  if (isReserved(slug)) {
    notFound();
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <div className="page-wrap page-wrap--narrow">
        <article className="dyn-article">
          {page.featuredImage?.sourceUrl ? (
            <div className="dyn-cover">
              <Image
                src={page.featuredImage.sourceUrl}
                alt={page.featuredImage.alt || stripHtml(page.title?.rendered)}
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
      <Footer />
    </>
  );
}
