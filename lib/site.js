/*
 * Single source of truth for anything that needs the public origin:
 * metadata, canonicals, sitemap, robots and structured data.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://merwadj.com"
).replace(/\/$/, "");

export const SITE_NAME = "MERWADJ";

export const SITE_DESCRIPTION =
  "Responsible finishes for hospitality and commercial spaces. Engineered with clarity, rooted in heritage.";

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "MERWADJ — responsible finishes for hospitality and commercial spaces",
};

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? SITE_URL : `${SITE_URL}${clean.replace(/\/$/, "")}`;
}

/**
 * Builds a complete Metadata object: title, description, canonical,
 * Open Graph and Twitter card. Every page goes through this so no page
 * can ship without a canonical or a share preview.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
  noIndex = false,
} = {}) {
  const resolvedTitle = title || SITE_NAME;
  const resolvedDescription = description || SITE_DESCRIPTION;
  const url = absoluteUrl(path);
  const images = [image ? { ...OG_IMAGE, url: image } : OG_IMAGE];

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: resolvedTitle,
      description: resolvedDescription,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images,
    },
  };
}

/** Organization node for the site-wide JSON-LD graph. */
export function organizationSchema({ phone, email, address, sameAs = [] } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.svg"),
    image: absoluteUrl(OG_IMAGE.url),
    description: SITE_DESCRIPTION,
    ...(sameAs.length ? { sameAs } : {}),
    ...(phone || email
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "sales",
              ...(phone ? { telephone: phone } : {}),
              ...(email ? { email } : {}),
            },
          ],
        }
      : {}),
    ...(address ? { address: { "@type": "PostalAddress", streetAddress: address } } : {}),
  };
}

/** Article node for a blog post or insight. */
export function articleSchema({ title, description, path, image, published, modified, author }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description ? { description } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    image: [image || absoluteUrl(OG_IMAGE.url)],
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: author
      ? { "@type": "Person", name: author }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.svg") },
    },
  };
}
