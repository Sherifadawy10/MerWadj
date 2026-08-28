/*
 * Research & Insights: the articles are unpublished, the page stays.
 *
 * The published articles were bylined to people who do not work at MERWADJ
 * ("Dr. Elena Marchetti", "Marcus Chen") and written in the first person
 * — "our analysis of 25 five-star properties" — so the site was presenting
 * someone else's research as its own. The client asked for the section to
 * come down until she has reviewed it.
 *
 * The client's instruction was precise: leave the hero picture and say the
 * research is coming soon, rather than remove the section. So /blog stays
 * a real 200 page with its hero and a coming-soon body, and keeps its place
 * in the navigation and the sitemap. What comes down is the writing itself:
 * every article URL answers 404 and the JSON endpoint is closed.
 *
 * Nothing is deleted. Set INSIGHTS_ENABLED=true to publish the articles again.
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

/*
 * The menu is deliberately untouched: /blog remains reachable while the
 * articles are unpublished, so the link belongs there.
 */
