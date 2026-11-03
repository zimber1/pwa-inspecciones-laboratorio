import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { securityHeaders } from "./src/lib/security/headers.mjs";

const rootDir = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(resolve(rootDir, "package.json"), "utf8"),
);

const appVersion =
  process.env.APP_VERSION ||
  process.env.NEXT_PUBLIC_APP_VERSION ||
  packageJson.version ||
  "0.1.0";

const commitSha =
  process.env.COMMIT_SHA ||
  process.env.GIT_COMMIT_SHA ||
  process.env.NEXT_PUBLIC_COMMIT_SHA ||
  "dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["127.0.0.1"],
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
