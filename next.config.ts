import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Empaqueta el server con solo las dependencias que el tracer detecta como
  // usadas, en .next/standalone. Es lo que copia el Dockerfile: sin esto la
  // imagen de runtime tendría que llevar node_modules entero.
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "gwm.com.py" }],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
