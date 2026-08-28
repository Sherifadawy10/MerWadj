/*
 * Research & Insights kill switch.
 *
 * The published articles were bylined to people who do not work at MERWADJ
 * ("Dr. Elena Marchetti", "Marcus Chen") and written in the first person
 * — "our analysis of 25 five-star properties" — so the site was presenting
 * someone else's research as its own. The client asked for the section to
 * come down until she has reviewed it.
 *
 * Nothing is deleted. This one flag removes the section from the navigation,
 * makes every one of its routes answer 404, drops it from the sitemap and
 * closes the JSON endpoint. Set INSIGHTS_ENABLED=true to bring it all back.
 *
 * Unset means off, deliberately: a new environment that forgets the variable
 * should hide the material rather than publish it.
 */
export const INSIGHTS_ENABLED = process.env.INSIGHTS_ENABLED === "true";

/** Route prefixes the section owns. */
export const INSIGHTS_PATHS = ["/blog", "/insights"];

/** True when a nav href points into the section. */
export function isInsightsPath(href) {
  if (typeof href !== "string") return false;
  const path = href.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return INSIGHTS_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Drops the section's items from a menu while it is switched off. */
export function filterInsightsFromMenu(items) {
  const list = Array.isArray(items) ? items : [];
  return INSIGHTS_ENABLED ? list : list.filter((item) => !isInsightsPath(item?.href));
}
