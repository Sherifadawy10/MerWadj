import { stripHtml } from "@/lib/html";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

/*
 * Inline SVG budget for anything we paste straight into the document.
 * An editor once pasted a "logo.svg" that was a 1024x1024 PNG wrapped in
 * an <svg> — 1.2 MB of base64 on every page and in every RSC prefetch.
 * Anything raster, or anything over the budget, is refused here and the
 * caller falls back to the static vector mark in /public.
 */
const INLINE_SVG_MAX_BYTES = 16 * 1024;

export function sanitizeInlineSvg(raw) {
  if (typeof raw !== "string") return null;

  const svg = raw.trim();
  if (!svg.startsWith("<svg")) return null;
  if (/data:image\/(png|jpe?g|gif|webp|bmp)/i.test(svg)) return null;
  if (Buffer.byteLength(svg, "utf8") > INLINE_SVG_MAX_BYTES) return null;

  return svg;
}
/*
 * WORDPRESS_API_ALLOW_SELF_SIGNED is set to "true" in Vercel Production,
 * which made every server-side fetch run with certificate verification
 * off — not just the WordPress ones. The CMS certificate is valid
 * (Google Trust Services, verified from the build host), so the flag is
 * not needed there. Gated to non-production; the variable itself should
 * be deleted from Production and Preview.
 */
const ALLOW_SELF_SIGNED =
  process.env.WORDPRESS_API_ALLOW_SELF_SIGNED === "true" &&
  process.env.NODE_ENV !== "production";

function getApiUrl() {
  if (!API_URL) {
    throw new Error(
      "Missing NEXT_PUBLIC_WORDPRESS_API_URL. Add it to your .env.local file."
    );
  }

  return API_URL.replace(/\/$/, "");
}

function buildWordPressUrl(path) {
  const baseUrl = getApiUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (baseUrl.includes("rest_route=")) {
    const sanitizedBase = baseUrl.replace(/\/?$/, "");
    const [routePath, search = ""] = normalizedPath.split("?");
    const route = routePath.startsWith("/") ? routePath : `/${routePath}`;
    const querySuffix = search ? `&${search}` : "";

    return `${sanitizedBase}${route}${querySuffix}`;
  }

  return `${baseUrl}${normalizedPath}`;
}

async function fetchFromWordPress(path, options = {}) {
  if (ALLOW_SELF_SIGNED) {
    /*
     * Dev-only fallback for hosts with a broken/self-signed TLS certificate.
     * Do not rely on this in production; fix the certificate on the server.
     */
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  const requestUrl = buildWordPressUrl(path);
  const response = await fetch(requestUrl, {
    next: { revalidate: 60 },
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(
      `WordPress API request failed: ${response.status} for ${requestUrl}`
    );
  }

  return response.json();
}

async function fetchCollection(path) {
  try {
    return await fetchFromWordPress(path);
  } catch (error) {
    if (error.message.includes("404")) {
      return [];
    }

    throw error;
  }
}

function normalizeFeaturedImage(item) {
  const embeddedMedia = item?._embedded?.["wp:featuredmedia"]?.[0];
  const sourceUrl = item?.featured_image_url || embeddedMedia?.source_url || null;
  const alt = embeddedMedia?.alt_text || "";
  const caption = stripHtml(embeddedMedia?.caption?.rendered || "");

  return sourceUrl ? { sourceUrl, alt, caption } : null;
}

function normalizePost(item, catMap = {}) {
  const catIds = item["stone-categories"] ?? [];
  const stoneCategories = catIds.map((id) => catMap[id]).filter(Boolean);

  return {
    ...item,
    featuredImage: normalizeFeaturedImage(item),
    stone_categories: stoneCategories,
  };
}

/*
 * WordPress slugs don't always match the Next route that renders them.
 * Without this, a "Contact us" menu item points at /contact-us, which is
 * not a route and falls through to the catch-all.
 */
const ROUTE_ALIASES = {
  "/contact-us": "/contact",
  "/contact-2": "/contact",
  "/home": "/",
  "/front-page": "/",
  "/terms": "/terms-of-service",
  "/materials-catalog": "/materials",
  "/research-insights": "/blog",
};

function toRelativeUrl(url) {
  if (!url) {
    return "/";
  }

  let path;
  try {
    const parsed = new URL(url);
    path = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/$/, "") || "/";
  } catch {
    path = url;
  }

  return ROUTE_ALIASES[path.toLowerCase()] || path;
}

/**
 * Guarantees the contact route is reachable from a nav.
 * The WordPress menu shipped without it, which left /contact orphaned:
 * no link to it from the home page, the header or the footer.
 */
export function withContactLink(items, { title = "Contact Us" } = {}) {
  const list = Array.isArray(items) ? items : [];
  if (list.some((item) => item.href === "/contact")) {
    return list;
  }

  return [
    ...list,
    { id: "contact-fallback", title, href: "/contact", target: "_self", parent: 0, order: 999 },
  ];
}

function normalizeMenuItem(item) {
  return {
    id: item.id,
    title: item.title,
    href: toRelativeUrl(item.url),
    target: item.target || "_self",
    parent: item.parent,
    order: item.order,
  };
}

export async function getSiteSettings() {
  return fetchFromWordPress("/");
}

/*
 * The site options shipped with the theme's sample phone number still in
 * them, and it reached every page footer and the Organization schema we
 * hand to Google. 555-123-4567 is a reserved fictional number, so this is
 * not a value anyone can have meant.
 *
 * The client asked for their number in its place on 31.08.2026. The right
 * home for it is the ACF field, and the moment an editor puts anything
 * there this bridge stops applying — it only ever replaces that one exact
 * placeholder string.
 */
const PLACEHOLDER_PHONE = "+1 (555) 123-4567";
// Written the way the company writes it in its own email signature.
const CLIENT_PHONE = "+1.949.444.1878";

export async function getSiteOptions() {
  try {
    const data = await fetchFromWordPress("/acf/v3/options/options");
    const options = data?.acf || {};
    if (options.phone === PLACEHOLDER_PHONE) {
      return { ...options, phone: CLIENT_PHONE };
    }
    return options;
  } catch {
    return {};
  }
}

export async function getMediaById(id) {
  if (!id || typeof id !== "number") return null;
  try {
    const media = await fetchFromWordPress(`/wp/v2/media/${id}`);
    return { url: media.source_url, alt: media.alt_text || "" };
  } catch {
    return null;
  }
}

export async function getInsights({ perPage = 6, offset = 0 } = {}) {
  const items = await fetchCollection(`/wp/v2/insight?_embed&per_page=${perPage}&offset=${offset}`);
  return items.map(normalizePost);
}

export async function getInsightBySlug(slug) {
  const items = await fetchCollection(
    `/wp/v2/insight?_embed&slug=${encodeURIComponent(slug)}`
  );
  return items.length ? normalizePost(items[0]) : null;
}

export async function getStoneCategories() {
  const cats = await fetchCollection(`/wp/v2/stone-categories?per_page=100`);
  return cats.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

export async function getStones({ perPage = 50 } = {}) {
  const [stonesRaw, categories] = await Promise.all([
    /*
     * The carousel order comes from the client's Material Gallery document.
     * The stone post type supports neither menu_order nor an extra ACF
     * field, so that position is encoded in the publish date — earlier
     * date means earlier tile. Dates are never shown for stones, so this
     * is invisible; see set-order.js in the import package.
     */
    fetchCollection(
      `/wp/v2/stone?_embed&per_page=${perPage}&orderby=date&order=asc`
    ),
    getStoneCategories(),
  ]);
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  return stonesRaw.map((item) => normalizePost(item, catMap));
}

export async function getPosts({ perPage = 10 } = {}) {
  const posts = await fetchFromWordPress(`/wp/v2/posts?_embed&per_page=${perPage}`);
  return posts.map(normalizePost);
}

export async function getPostBySlug(slug) {
  const posts = await fetchCollection(
    `/wp/v2/posts?_embed&slug=${encodeURIComponent(slug)}`
  );

  if (!posts.length) {
    return null;
  }

  return normalizePost(posts[0]);
}

export async function getPages() {
  const pages = await fetchCollection("/wp/v2/pages?_embed&per_page=100");
  return pages.map(normalizePost);
}

export async function getPageBySlug(slug) {
  const pages = await fetchCollection(
    `/wp/v2/pages?_embed&slug=${encodeURIComponent(slug)}`
  );

  if (!pages.length) {
    return null;
  }

  return normalizePost(pages[0]);
}

export async function getPageById(id) {
  if (!id) {
    return null;
  }

  try {
    const page = await fetchFromWordPress(`/wp/v2/pages/${id}?_embed`);
    return normalizePost(page);
  } catch (error) {
    if (error.message.includes("404")) {
      return null;
    }

    throw error;
  }
}

export async function getHomePage() {
  try {
    const settings = await getSiteSettings();

    if (settings?.page_on_front) {
      const frontPage = await getPageById(settings.page_on_front);

      if (frontPage) {
        return frontPage;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return getPageBySlug("home");
}

const MENU_EXCLUDE_SLUGS = new Set([
  "privacy-policy",
  "sample-page",
  "cookie-policy",
  "terms-and-conditions",
]);

export async function getMenu(location = "primary_menu") {
  const slug = location.replace(/_/g, "-"); // "primary_menu" → "primary-menu"

  // 1. Try standard WP REST API menus (WP 5.9+)
  try {
    const menus = await fetchFromWordPress("/wp/v2/menus?per_page=100");
    if (Array.isArray(menus) && menus.length) {
      const menu = menus.find(
        (m) =>
          m.slug === slug ||
          m.slug === location ||
          m.name?.toLowerCase().replace(/[\s_]+/g, "-") === slug
      );
      if (menu?.id) {
        const items = await fetchFromWordPress(
          `/wp/v2/menu-items?menus=${menu.id}&per_page=100&orderby=menu_order&order=asc`
        );
        if (Array.isArray(items) && items.length) {
          return items.map((item) => ({
            id: item.id,
            title: item.title?.rendered || item.title || "",
            href: toRelativeUrl(item.url),
            target: item.target || "_self",
            parent: item.parent || 0,
            order: item.menu_order || 0,
          }));
        }
      }
    }
  } catch {
    // standard menus API unavailable or requires auth
  }

  // 2. Try custom plugin endpoint
  for (const name of [location, slug]) {
    try {
      const items = await fetchFromWordPress(
        `/merwadj/v1/menus/${encodeURIComponent(name)}`
      );
      if (Array.isArray(items) && items.length) return items.map(normalizeMenuItem);
    } catch {
      // not found
    }
  }

  // 3. Build nav from published top-level pages — no PHP changes needed
  try {
    const pages = await fetchFromWordPress(
      "/wp/v2/pages?status=publish&per_page=100&orderby=menu_order&order=asc&parent=0" +
        "&_fields=id,title,slug,link,menu_order"
    );
    if (Array.isArray(pages) && pages.length) {
      return pages
        .filter((p) => !MENU_EXCLUDE_SLUGS.has(p.slug))
        .map((p, i) => ({
          id: p.id,
          title: p.title?.rendered || p.slug,
          href: toRelativeUrl(p.link),
          target: "_self",
          parent: 0,
          order: p.menu_order ?? i,
        }));
    }
  } catch {
    // pages API failed
  }

  return [];
}

export async function getFooterOptions() {
  try {
    const options = await getSiteOptions();
    return options || {};
  } catch {
    return {};
  }
}

/**
 * Slug + last-modified date for everything the sitemap needs to list.
 * Never throws: if WordPress is unreachable the sitemap still ships with
 * the static routes rather than failing the build.
 */
export async function getContentIndex() {
  async function slugs(path) {
    try {
      const items = await fetchFromWordPress(path);
      return Array.isArray(items)
        ? items
            .filter((item) => item?.slug)
            .map((item) => ({ slug: item.slug, modified: item.modified_gmt || item.modified || null }))
        : [];
    } catch {
      return [];
    }
  }

  const [posts, insights] = await Promise.all([
    slugs("/wp/v2/posts?per_page=100&status=publish&_fields=slug,modified_gmt"),
    slugs("/wp/v2/insight?per_page=100&status=publish&_fields=slug,modified_gmt"),
  ]);

  return { posts, insights };
}

/*
Future extension ideas:
1. Add menu helpers for /merwadj/v1/menus/primary_menu.
2. Add custom post type helpers and preview-mode token support.
3. Normalize SEO fields and multilingual alternates for production.
*/
