import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "gwm.com.py" }],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
