import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const componentRoot = join(process.cwd(), "src/components");
const appRoot = join(process.cwd(), "src/app");
const routeConventionFiles = new Set([
  "default.tsx",
  "error.tsx",
  "forbidden.tsx",
  "global-error.tsx",
  "icon.tsx",
  "instrumentation.ts",
  "layout.tsx",
  "loading.tsx",
  "manifest.ts",
  "not-found.tsx",
  "opengraph-image.tsx",
  "page.tsx",
  "robots.ts",
  "route.ts",
  "route.tsx",
  "sitemap.ts",
  "template.tsx",
  "twitter-image.tsx",
  "unauthorized.tsx",
]);

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...walk(path));
    } else {
      files.push(path);
    }
  }

  return files;
}

function isSourceComponentFile(path) {
  if (!/\.(ts|tsx)$/.test(path)) return false;
  return true;
}

function isCssModuleFile(path) {
  return /\.module\.css$/.test(path);
}

const errors = [];

function validateSourceRoot(root, { allowRouteConventions = false } = {}) {
  if (!existsSync(root)) return;

  const sourceFiles = walk(root).filter(isSourceComponentFile);
  const filesByDir = new Map();

  for (const file of sourceFiles) {
    const rel = relative(root, file);
    const parts = rel.split("/");
    const filename = parts.at(-1);
    const isRouteConvention =
      allowRouteConventions && routeConventionFiles.has(filename);

    if (
      !isRouteConvention &&
      filename !== "index.ts" &&
      filename !== "index.tsx"
    ) {
      errors.push(
        `${relative(process.cwd(), file)} should be moved into its own folder and named index.tsx/index.ts.`,
      );
    }

    if (!isRouteConvention) {
      const dir = parts.slice(0, -1).join("/");
      filesByDir.set(dir, [...(filesByDir.get(dir) ?? []), rel]);
    }
  }

  for (const [dir, files] of filesByDir) {
    if (files.length > 1) {
      errors.push(
        `${relative(process.cwd(), join(root, dir)) || "."} contains multiple component source files: ${files.join(", ")}`,
      );
    }
  }
}

validateSourceRoot(componentRoot);
validateSourceRoot(appRoot, { allowRouteConventions: true });

for (const root of [componentRoot, appRoot]) {
  if (!existsSync(root)) continue;

  for (const file of walk(root).filter(isCssModuleFile)) {
    const filename = file.split("/").at(-1);

    if (filename !== "styles.module.css") {
      errors.push(
        `${relative(process.cwd(), file)} should be named styles.module.css.`,
      );
    }
  }
}

if (errors.length) {
  console.error("Component structure check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Component structure check passed.");
