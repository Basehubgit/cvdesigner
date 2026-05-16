import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "unpdf"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
