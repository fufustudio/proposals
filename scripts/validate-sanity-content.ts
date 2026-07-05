import { getCliClient } from "sanity/cli";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-24";
const client = getCliClient({ apiVersion }).withConfig({ useCdn: false });

const query = /* groq */ `
{
  "missingSingletons": ["siteSettings"][!(@ in *[defined(_id)]._id)],
  "missingRequiredValues": [
    select(!defined(*[_id == "siteSettings"][0].name) => "siteSettings.name", null)
  ][@ != null],
  "missingImageAlt": *[
    defined(*[references(^._id)][0]) || _type in ["page", "post", "service", "siteSettings"]
  ]{
    "documentId": _id,
    "images": [
      {"path": "image", "hasImage": defined(image.asset), "alt": image.alt}
    ][hasImage == true && !defined(alt)]
  }[count(images) > 0]{
    documentId,
    "paths": images[].path
  }
}
`;

type ValidationResult = {
  missingSingletons: string[];
  missingRequiredValues: string[];
  missingImageAlt: Array<{ documentId: string; paths?: string[] }>;
};

async function main() {
  const result = await client.fetch<ValidationResult>(query);

  if (
    result.missingSingletons.length ||
    result.missingRequiredValues.length ||
    result.missingImageAlt.length
  ) {
    console.error("[content] Validation failed:");
    console.error(JSON.stringify(result, null, 2));
    process.exitCode = 1;
    return;
  }

  console.log("[content] Validation passed.");
}

main().catch((error) => {
  console.error("[content] Validation failed:", error);
  process.exit(1);
});
