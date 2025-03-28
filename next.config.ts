import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
