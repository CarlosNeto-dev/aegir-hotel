import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "app/_styles")],
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;
