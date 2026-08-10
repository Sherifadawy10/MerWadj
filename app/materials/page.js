import "@/styles/materials.css";
import Footer from "@/components/Footer";
import MatCatalog from "@/components/MatCatalog";
import MatCollection from "@/components/MatCollection";
import PageReveal from "@/components/PageReveal";
import { getPageBySlug, getStones } from "@/lib/wordpress";

export async function generateMetadata() {
  const page = await getPageBySlug("materials");
  return {
    title: page?.acf?.seo_title || page?.title?.rendered || "Materials — Merwadj",
    description: page?.acf?.seo_description || "A refined selection of natural stone and interior finishes.",
  };
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
