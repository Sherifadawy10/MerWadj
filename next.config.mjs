/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medwadj.dialen.com.ua",
      },
      {
        protocol: "https",
        hostname: "1196411.us17.myftpupload.com",
      },
      {
        protocol: "https",
        hostname: "merwadj.com",
      },
    ],
  },
};

export default nextConfig;
