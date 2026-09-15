import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // The page is entirely static, so Vercel serves it from the edge with no function
  // invocations and no cold starts.
  output: "export",
  images: { unoptimized: true },
};

export default config;
