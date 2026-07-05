import { getCliClient } from "sanity/cli";

import { home } from "../src/content/home";
import { site } from "../src/content/site";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-24";
const client = getCliClient({ apiVersion }).withConfig({ useCdn: false });
const dryRun =
  process.env.SANITY_DRY_RUN === "1" || process.argv.includes("--dry-run");

type SeedDocument = {
  _type: string;
  slug?: { _type: "slug"; current: string };
  [key: string]: unknown;
};

function log(message: string, details?: unknown) {
  const suffix = details ? ` ${JSON.stringify(details)}` : "";
  process.stdout.write(`${message}${suffix}\n`);
}

function block(text: string, key: string) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text,
        marks: [],
      },
    ],
  };
}

async function createBySlug(document: SeedDocument) {
  const slug = document.slug?.current;
  if (!slug) throw new Error(`Missing slug for ${document._type}`);

  if (dryRun) {
    log("[seed] Would create document if missing", {
      type: document._type,
      slug,
    });
    return `dry-run-${document._type}-${slug}`;
  }

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{_id}`,
    { type: document._type, slug },
  );

  if (existing?._id) {
    log("[seed] Existing document", { type: document._type, slug });
    return existing._id;
  }

  const created = await client.create(document);
  log("[seed] Created document", { type: document._type, slug });
  return created._id;
}

async function main() {
  const siteSettings = {
    _id: "siteSettings",
    _type: "siteSettings",
    ...site,
  };

  const page = {
    _type: "page",
    title: home.heading,
    slug: { _type: "slug" as const, current: "home" },
    description: home.intro,
    body: home.principles.map((principle, index) =>
      block(`${principle.title}: ${principle.body}`, `home-principle-${index}`),
    ),
  };

  if (dryRun) {
    log("[seed] Would createOrReplace singleton", { id: "siteSettings" });
  } else {
    await client.createOrReplace(siteSettings);
    log("[seed] Upserted singleton", { id: "siteSettings" });
  }

  await createBySlug(page);

  log("[seed] Done.");
}

main().catch((error) => {
  console.error("[seed] Failed:", error);
  process.exit(1);
});
