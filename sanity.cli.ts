import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

loadEnvConfig(process.cwd());

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "your-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ?? "production";

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    enabled: true,
    path: "./src/**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
});
