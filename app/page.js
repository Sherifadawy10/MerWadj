import Hero from "@/components/Hero";
import { getHomePage } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getHomePage();
  return {
    title: page?.acf?.seo_title || page?.title?.rendered || "Merwadj",
    description: page?.acf?.seo_description || undefined,
  };
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
