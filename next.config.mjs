/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medwadj.dialen.com.ua",
      },
    ],
  },
};

export default nextConfig;
