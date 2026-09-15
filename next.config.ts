import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ["firebase", "@firebase/app", "@firebase/analytics", "@firebase/firestore", "@firebase/auth"],
  async redirects() {
    return [
      {
        source: "/sa/admin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/sa/:path*/admin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/DocumentVerify/:path*/admin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/:serial/:unified/admin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/:serial/admin",
        destination: "/admin",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
