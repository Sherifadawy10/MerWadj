import "@/styles/globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import PreloaderManager from "@/components/PreloaderManager";
import { PRELOADER_SESSION_KEY } from "@/lib/preloader";
import SiteAnimations from "@/components/SiteAnimations";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import { getSiteOptions, sanitizeInlineSvg } from "@/lib/wordpress";
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

/*
 * Runs before the preloader markup paints, so a visitor who has already
 * seen it this session never gets a flash of it on the next page.
 */
const PRELOADER_FLAG_SCRIPT = `try{if(sessionStorage.getItem('${PRELOADER_SESSION_KEY}')==='1'){document.documentElement.setAttribute('data-preloaded','1')}}catch(e){}`;

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

  const preloaderSvg = sanitizeInlineSvg(options?.preloader);

  const schema = organizationSchema({
    phone: options?.phone || undefined,
    email: options?.email || undefined,
    address: options?.address ? stripHtml(options.address) : undefined,
    sameAs: socialUrls(options),
  });

  return (
    <html lang="en">
      <body className="site-body">
        <Script id="preloader-flag" strategy="beforeInteractive">
          {PRELOADER_FLAG_SCRIPT}
        </Script>

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
