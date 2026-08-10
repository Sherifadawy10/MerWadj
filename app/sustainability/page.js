import "@/styles/sustainability.css";
import Footer from "@/components/Footer";
import SusCommitment from "@/components/SusCommitment";
import SusJourney from "@/components/SusJourney";
import SusLifecycle from "@/components/SusLifecycle";
import SusPillars from "@/components/SusPillars";
import SusCta from "@/components/SusCta";
import { getPageBySlug } from "@/lib/wordpress";

export async function generateMetadata() {
  const page = await getPageBySlug("sustainability");
  return {
    title: page?.acf?.seo_title || page?.title?.rendered || "Sustainability — Merwadj",
    description: page?.acf?.seo_description || "A structured framework toward measurable accountability.",
  };
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
