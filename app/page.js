import Hero from "@/components/Hero";
import { getHomePage } from "@/lib/wordpress";
import { buildMetadata, SITE_NAME } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata() {
  const page = await getHomePage().catch(() => null);
  /*
   * The WordPress page is literally titled "Front Page", so it is not a
   * usable <title>. Only an explicit SEO title from ACF overrides the
   * site default here.
   */
  const seoTitle = page?.acf?.seo_title;
  return buildMetadata({
    title: seoTitle
      ? seoTitle
      : { absolute: `${SITE_NAME} — Responsible Finishes for Hospitality & Commercial Spaces` },
    description: page?.acf?.seo_description || undefined,
    path: "/",
  });
}

export default async function HomePage() {
  let homepage = null;

  try {
    homepage = await getHomePage();
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <Hero page={homepage} />
    </>
  );
}
