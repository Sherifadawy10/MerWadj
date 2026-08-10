import "@/styles/globals.css";
import Header from "@/components/Header";
import PreloaderManager from "@/components/PreloaderManager";
import SiteAnimations from "@/components/SiteAnimations";
import { getSiteOptions } from "@/lib/wordpress";

export const metadata = {
  title: "Merwadj",
  description: "Headless WordPress frontend for Merwadj.",
};

export default async function RootLayout({ children }) {
  let preloaderSvg = null;

  try {
    const options = await getSiteOptions();
    const raw = options?.preloader;
    preloaderSvg = typeof raw === "string" && raw.trim() ? raw.trim() : null;
  } catch {}

  return (
    <html lang="en">
      <body className="site-body">
        <PreloaderManager svgCode={preloaderSvg} />
        <SiteAnimations />
        <div className="site-frame">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
