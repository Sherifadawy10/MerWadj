import "@/styles/materials.css";
import Footer from "@/components/Footer";
import MatCatalog from "@/components/MatCatalog";
import MatCollection from "@/components/MatCollection";
import PageReveal from "@/components/PageReveal";
import { getPageBySlug, getStones } from "@/lib/wordpress";
import { buildMetadata } from "@/lib/site";
import { stripHtml } from "@/lib/html";

export const revalidate = 300;

export async function generateMetadata() {
  const page = await getPageBySlug("materials");
  return buildMetadata({
    title: page?.acf?.seo_title || stripHtml(page?.title?.rendered) || "Materials Catalog",
    description:
      page?.acf?.seo_description ||
      "A refined selection of engineered stone and interior finishes for hospitality and commercial projects.",
    path: "/materials",
  });
}

export default async function MaterialsPage() {
  const [page, stones] = await Promise.all([
    getPageBySlug("materials"),
    getStones(),
  ]);

  const acf = page?.acf || {};

  return (
    <>
      <MatCatalog
        eyebrow={acf.mat_catalog_eyebrow || "MATERIAL DISCOVERY"}
        title={acf.mat_catalog_title || "ENGINEERED STONE CATALOG"}
        stones={stones}
      />
      <MatCollection page={page} />
      <PageReveal />
      <Footer />
    </>
  );
}
