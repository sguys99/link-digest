import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  register: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV !== "production",
  exclude: [/\.map$/, /^manifest.*\.js$/],
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.45.57'],
};

export default withSerwist(nextConfig);
