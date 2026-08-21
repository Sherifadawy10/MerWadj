import "@/styles/about.css";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import AboutName from "@/components/AboutName";
import AboutGenesis from "@/components/AboutGenesis";
import AboutSymbolism from "@/components/AboutSymbolism";
import AboutSummary from "@/components/AboutSummary";
import AboutValues from "@/components/AboutValues";
import AboutCommitments from "@/components/AboutCommitments";
import AboutServe from "@/components/AboutServe";
import { getPageBySlug } from "@/lib/wordpress";
import { buildMetadata } from "@/lib/site";
import { stripHtml } from "@/lib/html";

export const revalidate = 600;

export async function generateMetadata() {
  const page = await getPageBySlug("about");
  return buildMetadata({
    title: page?.acf?.seo_title || stripHtml(page?.title?.rendered) || "About",
    description:
      page?.acf?.seo_description ||
      "Beautiful materials, verified impact. How MERWADJ sources, engineers and delivers responsible stone finishes.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  return (
    <>
      <AboutHero page={page} />
      <AboutName page={page} />
      <AboutGenesis page={page} />
      <AboutSymbolism page={page} />
      <AboutSummary page={page} />
      <AboutValues page={page} />
      <AboutCommitments page={page} />
      <AboutServe page={page} />
      <Footer />
    </>
  );
}
