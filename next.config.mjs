import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://github.com/vercel/next.js/issues/63318#issuecomment-2079677098
  transpilePackages: ["next-mdx-remote"],
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
