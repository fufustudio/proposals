import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

const appRoot = join(process.cwd(), "src/app");
const sharedComponentsRoot = join(process.cwd(), "src/components");

function walk(dir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    files.push(...(stat.isDirectory() ? walk(path) : [path]));
  }

  return files;
}

const errors = [];
if (existsSync(sharedComponentsRoot)) {
  for (const category of ["ui", "sections", "layout"]) {
    const categoryRoot = join(sharedComponentsRoot, category);
    if (existsSync(categoryRoot) && walk(categoryRoot).length) {
      errors.push(
        `src/components/${category} should be flattened into src/components/<component>.`,
      );
    }
  }

  const nestedNamespaces = new Set(["admin", "proposals"]);
  for (const entry of readdirSync(sharedComponentsRoot)) {
    const path = join(sharedComponentsRoot, entry);
    if (!statSync(path).isDirectory() || nestedNamespaces.has(entry)) continue;

    const nestedFolders = readdirSync(path).filter((child) =>
      statSync(join(path, child)).isDirectory(),
    );
    if (nestedFolders.length) {
      errors.push(
        `src/components/${entry} contains nested component folders; keep shared components flat or use an explicit domain namespace.`,
      );
    }
  }
}

function findImplementationRoots(root) {
  if (!existsSync(root)) return [];

  const roots = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    if (!statSync(path).isDirectory()) continue;
    if (entry === "components" || entry === "features") roots.push(path);
    roots.push(...findImplementationRoots(path));
  }
  return roots;
}

function validateReactFolders(root) {
  if (!existsSync(root)) return;

  for (const file of walk(root)) {
    const filename = basename(file);
    const projectPath = relative(process.cwd(), file);

    if (filename.endsWith(".tsx")) {
      if (filename !== "index.tsx") {
        errors.push(
          `${projectPath} should live in its own kebab-case folder as index.tsx.`,
        );
      }

      const folderName = basename(dirname(file));
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folderName)) {
        errors.push(`${projectPath} should use a kebab-case component folder.`);
      }
    }

    if (!filename.endsWith(".module.css")) continue;

    if (filename !== "styles.module.css") {
      errors.push(
        `${projectPath} should be named styles.module.css inside its component folder.`,
      );
    }

    if (!existsSync(join(dirname(file), "index.tsx"))) {
      errors.push(`${projectPath} should have a sibling index.tsx component.`);
    }
  }
}

for (const root of findImplementationRoots(appRoot)) {
  validateReactFolders(root);
}
validateReactFolders(sharedComponentsRoot);

for (const root of [appRoot, sharedComponentsRoot]) {
  if (!existsSync(root)) continue;

  for (const file of walk(root)) {
    if (!file.endsWith(".module.css")) continue;

    const source = readFileSync(file, "utf8");
    if (/(?:#[\da-f]{3,8}|rgba?\()/i.test(source)) {
      errors.push(
        `${relative(process.cwd(), file)} contains a raw color; promote it to the globals.css theme contract.`,
      );
    }
  }
}

for (const root of [appRoot, sharedComponentsRoot]) {
  if (!existsSync(root)) continue;

  for (const file of walk(root)) {
    if (!file.endsWith(".tsx")) continue;

    const source = readFileSync(file, "utf8");
    if (/<h[1-6]\b/.test(source)) {
      errors.push(
        `${relative(process.cwd(), file)} renders a raw heading; use the Heading primitive so semantic level and visual scale stay consistent.`,
      );
    }
  }
}

if (errors.length) {
  console.error("Component structure check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Shared and route-local component structure check passed.");
