import { absoluteUrl } from "@/lib/site";
import { getContentIndex } from "@/lib/wordpress";
import { INSIGHTS_ENABLED } from "@/lib/features";

export const revalidate = 3600;

/*
 * `/terms` is deliberately absent: it 308s to /terms-of-service.
 * Listing a redirect in the sitemap is the "only pages answering with a
 * successful code" rule in the delivery checklist.
 */
const STATIC_ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/materials", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/founders", changeFrequency: "monthly", priority: 0.7 },
  { path: "/sustainability", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap() {
  const now = new Date();
  const { posts, insights } = await getContentIndex();

  const routes = INSIGHTS_ENABLED
    ? STATIC_ROUTES
    : STATIC_ROUTES.filter((route) => route.path !== "/blog");

  const entries = routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  for (const [prefix, items] of INSIGHTS_ENABLED
    ? [
        ["/blog", posts],
        ["/insights", insights],
      ]
    : []) {
    for (const item of items) {
      entries.push({
        url: absoluteUrl(`${prefix}/${item.slug}`),
        lastModified: item.modified ? new Date(`${item.modified}Z`) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
