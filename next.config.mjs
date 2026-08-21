/** @type {import('next').NextConfig} */

const WP_IMAGE_HOSTS = [
  // Temporary GoDaddy address the CMS still lives on. Remove once the
  // backend moves to cms.merwadj.com — see the developer backlog.
  "1196411.us17.myftpupload.com",
  "cms.merwadj.com",
  "merwadj.com",
];

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: WP_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
    formats: ["image/avif", "image/webp"],
    // WordPress originals are re-encoded once and then served from the edge.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async redirects() {
    return [
      // /terms was a second copy of the same WordPress page.
      { source: "/terms", destination: "/terms-of-service", permanent: true },
      // www must be attached to the project in Vercel for this to fire.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.merwadj.com" }],
        destination: "https://merwadj.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
