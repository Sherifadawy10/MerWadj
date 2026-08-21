import "@/styles/globals.css";
import Header from "@/components/Header";
import PreloaderManager from "@/components/PreloaderManager";
import SiteAnimations from "@/components/SiteAnimations";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import { getSiteOptions, sanitizeInlineSvg } from "@/lib/wordpress";
import { PRELOADER_MARK_SVG } from "@/lib/preloader-mark";
import { stripHtml } from "@/lib/html";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  organizationSchema,
} from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Responsible Finishes for Hospitality & Commercial Spaces`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} — Responsible Finishes for Hospitality & Commercial Spaces`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Responsible Finishes for Hospitality & Commercial Spaces`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport = {
  themeColor: "#0F0E0D",
  colorScheme: "dark",
};

function socialUrls(options) {
  const raw = Array.isArray(options?.social_links) ? options.social_links : [];
  return raw
    .map((item) => item?.link?.social_link?.url)
    .filter((url) => typeof url === "string" && /^https?:\/\//i.test(url));
}

export default async function RootLayout({ children }) {
  let options = {};
  try {
    options = (await getSiteOptions()) || {};
  } catch {
    options = {};
  }

  /*
   * The ACF value is the designer's mark with a 470 KB base64 PNG inside.
   * sanitizeInlineSvg() rejects it on size, and we substitute the same
   * artwork pointing at a cached file. If an editor ever replaces the
   * field with a genuine vector, that is used as-is instead.
   */
  const preloaderSvg = sanitizeInlineSvg(options?.preloader) || PRELOADER_MARK_SVG;

  const schema = organizationSchema({
    phone: options?.phone || undefined,
    email: options?.email || undefined,
    address: options?.address ? stripHtml(options.address) : undefined,
    sameAs: socialUrls(options),
  });

  return (
    <html lang="en">
      <body className="site-body">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <PreloaderManager svgCode={preloaderSvg} />
        <SiteAnimations />

        <div className="site-frame">
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
        </div>

        <CookieConsent />
        <Analytics />

        {/*
          * Plain tag on purpose. next/script queues even beforeInteractive
          * through the Next bootstrap, which leaves no literal
          * application/ld+json block in the HTML for crawlers to read.
          */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
