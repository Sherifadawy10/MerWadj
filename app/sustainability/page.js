import "@/styles/sustainability.css";
import Footer from "@/components/Footer";
import SusCommitment from "@/components/SusCommitment";
import SusJourney from "@/components/SusJourney";
import SusLifecycle from "@/components/SusLifecycle";
import SusPillars from "@/components/SusPillars";
import SusCta from "@/components/SusCta";
import { getPageBySlug } from "@/lib/wordpress";
import { buildMetadata } from "@/lib/site";
import { stripHtml } from "@/lib/html";

export const revalidate = 600;

export async function generateMetadata() {
  const page = await getPageBySlug("sustainability");
  return buildMetadata({
    title: page?.acf?.seo_title || stripHtml(page?.title?.rendered) || "Sustainability",
    description:
      page?.acf?.seo_description ||
      "A structured framework toward measurable accountability across sourcing, processing and delivery.",
    path: "/sustainability",
  });
}

export default async function SustainabilityPage() {
  const page = await getPageBySlug("sustainability");

  return (
    <>
      <SusCommitment page={page} />
      <SusJourney page={page} />
      <SusLifecycle page={page} />
      <SusPillars page={page} />
      <SusCta page={page} />
      <Footer />
    </>
  );
}
