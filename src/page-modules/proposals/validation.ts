import type {
  Proposal,
  ProposalBlock,
  ProposalSlideLayout,
  ProposalStatus,
} from "@/page-modules/proposals/types";

type ValidationOk<T> = {
  ok: true;
  value: T;
  errors: [];
};

type ValidationError = {
  ok: false;
  value?: undefined;
  errors: string[];
};

export type ProposalValidationResult<T = Proposal> =
  ValidationOk<T> | ValidationError;

export const proposalStatusValues = [
  "draft",
  "ready",
  "accepted",
  "archived",
] as const satisfies readonly ProposalStatus[];

const slideLayoutValues = [
  "appendix",
  "cover",
  "grid",
  "list",
  "pricing",
  "split",
  "statement",
  "timeline",
] as const satisfies readonly ProposalSlideLayout[];

const mediaAspectValues = ["wide", "square", "portrait"] as const;

const blockTypeValues = [
  "cards",
  "cover",
  "cta",
  "details",
  "media",
  "numberedRows",
  "pillars",
  "priceList",
  "pricePanel",
  "pricing",
  "sitemap",
  "steps",
  "summary",
  "text",
  "timeline",
  "workstreams",
] as const satisfies readonly ProposalBlock["type"][];

type AllValuesCovered<
  Expected extends string,
  Actual extends readonly string[],
> = Exclude<Expected, Actual[number]> extends never ? true : never;

const allProposalStatusesCovered: AllValuesCovered<
  ProposalStatus,
  typeof proposalStatusValues
> = true;
const allSlideLayoutsCovered: AllValuesCovered<
  ProposalSlideLayout,
  typeof slideLayoutValues
> = true;
const allBlockTypesCovered: AllValuesCovered<
  ProposalBlock["type"],
  typeof blockTypeValues
> = true;

void allProposalStatusesCovered;
void allSlideLayoutsCovered;
void allBlockTypesCovered;

export function validateProposal(value: unknown): ProposalValidationResult {
  const errors: string[] = [];
  validateProposalObject(value, "proposal", errors);

  return errors.length
    ? { ok: false, errors }
    : { ok: true, value: value as Proposal, errors: [] };
}

export function validateProposals(
  value: unknown,
): ProposalValidationResult<readonly Proposal[]> {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push("proposals must be an array.");
  } else if (!value.length) {
    errors.push("proposals must contain at least one proposal.");
  } else {
    value.forEach((proposal, index) => {
      validateProposalObject(proposal, `proposals[${index}]`, errors);
    });
    validateUniqueStrings(value, "slug", "proposals", errors);
  }

  return errors.length
    ? { ok: false, errors }
    : { ok: true, value: value as readonly Proposal[], errors: [] };
}

export function assertProposals(value: unknown) {
  const result = validateProposals(value);

  if (!result.ok) {
    throw new Error(
      `Invalid proposal JSON:\n${result.errors
        .map((error) => `- ${error}`)
        .join("\n")}`,
    );
  }

  return result.value;
}

function validateProposalObject(
  value: unknown,
  path: string,
  errors: string[],
) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  requireSlug(value, "slug", path, errors);
  requireString(value, "title", path, errors);
  requireString(value, "clientLabel", path, errors);
  requireEnum(value, "status", path, proposalStatusValues, errors);
  requireDate(value, "preparedAt", path, errors);
  optionalDate(value, "updatedAt", path, errors);
  requireString(value, "summary", path, errors);

  if (!Array.isArray(value.slides)) {
    errors.push(`${path}.slides must be an array.`);
    return;
  }
  if (!value.slides.length) {
    errors.push(`${path}.slides must contain at least one slide.`);
    return;
  }

  value.slides.forEach((slide, index) =>
    validateSlide(slide, `${path}.slides[${index}]`, errors),
  );
  validateUniqueStrings(value.slides, "id", `${path}.slides`, errors);
}

function validateSlide(value: unknown, path: string, errors: string[]) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  requireString(value, "id", path, errors);
  requireString(value, "label", path, errors);
  optionalString(value, "eyebrow", path, errors);
  requireString(value, "heading", path, errors);
  optionalString(value, "intro", path, errors);
  optionalString(value, "note", path, errors);
  requireEnum(value, "layout", path, slideLayoutValues, errors);

  if (!Array.isArray(value.blocks)) {
    errors.push(`${path}.blocks must be an array.`);
    return;
  }
  if (!value.blocks.length) {
    errors.push(`${path}.blocks must contain at least one block.`);
    return;
  }

  value.blocks.forEach((block, index) =>
    validateBlock(block, `${path}.blocks[${index}]`, errors),
  );
}

function validateBlock(value: unknown, path: string, errors: string[]) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  requireEnum(value, "type", path, blockTypeValues, errors);

  switch (value.type) {
    case "cover":
      requireString(value, "eyebrow", path, errors);
      requireString(value, "year", path, errors);
      requireString(value, "preparedFor", path, errors);
      requireString(value, "title", path, errors);
      requireString(value, "tagline", path, errors);
      requireStringArray(value, "meta", path, errors);
      requireString(value, "actionLabel", path, errors);
      return;
    case "text":
      requireStringArray(value, "body", path, errors);
      return;
    case "numberedRows":
      requireObjectArray(value, "items", path, errors, (item, itemPath) => {
        requireString(item, "title", itemPath, errors);
        requireString(item, "body", itemPath, errors);
      });
      return;
    case "cards":
    case "pillars":
      requireObjectArray(value, "items", path, errors, (item, itemPath) => {
        optionalString(item, "kicker", itemPath, errors);
        requireString(item, "title", itemPath, errors);
        optionalString(item, "body", itemPath, errors);
      });
      return;
    case "sitemap":
      requireObjectArray(value, "columns", path, errors, (column, itemPath) => {
        requireString(column, "title", itemPath, errors);
        requireStringArray(column, "items", itemPath, errors);
      });
      return;
    case "workstreams":
      requireObjectArray(value, "items", path, errors, (item, itemPath) => {
        requireString(item, "title", itemPath, errors);
        requireString(item, "body", itemPath, errors);
      });
      return;
    case "timeline":
      requireObjectArray(value, "items", path, errors, (item, itemPath) => {
        optionalString(item, "kicker", itemPath, errors);
        requireString(item, "label", itemPath, errors);
        optionalString(item, "detail", itemPath, errors);
        optionalString(item, "milestone", itemPath, errors);
        optionalBoolean(item, "active", itemPath, errors);
      });
      optionalString(value, "meta", path, errors);
      return;
    case "details":
      requireObjectArray(value, "items", path, errors, (item, itemPath) => {
        requireString(item, "label", itemPath, errors);
        optionalString(item, "detail", itemPath, errors);
      });
      return;
    case "summary":
      requireObjectArray(value, "items", path, errors, (item, itemPath) => {
        requireString(item, "label", itemPath, errors);
        requireString(item, "value", itemPath, errors);
        optionalString(item, "detail", itemPath, errors);
      });
      return;
    case "pricing":
      optionalString(value, "footer", path, errors);
      requireObjectArray(value, "items", path, errors, (item, itemPath) => {
        requireString(item, "label", itemPath, errors);
        requireString(item, "title", itemPath, errors);
        requireString(item, "body", itemPath, errors);
        requireString(item, "price", itemPath, errors);
        optionalString(item, "note", itemPath, errors);
        requireStringArray(item, "features", itemPath, errors);
        optionalBoolean(item, "recommended", itemPath, errors);
      });
      return;
    case "priceList":
      requireObjectArray(value, "items", path, errors, (item, itemPath) => {
        requireString(item, "title", itemPath, errors);
        requireString(item, "body", itemPath, errors);
        requireString(item, "price", itemPath, errors);
      });
      return;
    case "pricePanel":
      optionalString(value, "eyebrow", path, errors);
      requireString(value, "price", path, errors);
      optionalString(value, "suffix", path, errors);
      requireStringArray(value, "features", path, errors);
      return;
    case "steps":
      requireObjectArray(value, "items", path, errors, (item, itemPath) => {
        requireString(item, "title", itemPath, errors);
        requireString(item, "body", itemPath, errors);
      });
      return;
    case "cta":
      requireString(value, "label", path, errors);
      requireHref(value, "href", path, errors);
      optionalString(value, "support", path, errors);
      optionalHref(value, "supportHref", path, errors);
      optionalString(value, "supportLabel", path, errors);
      return;
    case "media":
      requireString(value, "label", path, errors);
      optionalEnum(value, "aspect", path, mediaAspectValues, errors);
      return;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function requireString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
) {
  if (typeof record[key] !== "string" || !record[key]) {
    errors.push(`${path}.${key} must be a non-empty string.`);
  }
}

function requireSlug(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
) {
  requireString(record, key, path, errors);

  if (
    typeof record[key] === "string" &&
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record[key])
  ) {
    errors.push(
      `${path}.${key} must use lowercase letters, numbers, and single hyphens.`,
    );
  }
}

function requireDate(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
) {
  requireString(record, key, path, errors);

  if (typeof record[key] === "string" && !isIsoDate(record[key])) {
    errors.push(`${path}.${key} must be a valid YYYY-MM-DD date.`);
  }
}

function optionalDate(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
) {
  optionalString(record, key, path, errors);

  if (typeof record[key] === "string" && !isIsoDate(record[key])) {
    errors.push(`${path}.${key} must be a valid YYYY-MM-DD date.`);
  }
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function optionalString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
) {
  if (record[key] !== undefined && typeof record[key] !== "string") {
    errors.push(`${path}.${key} must be a string when provided.`);
  }
}

function requireHref(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
) {
  requireString(record, key, path, errors);

  if (typeof record[key] === "string" && !isSupportedHref(record[key])) {
    errors.push(
      `${path}.${key} must be an https, mailto, tel, root-relative, or hash URL.`,
    );
  }
}

function optionalHref(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
) {
  optionalString(record, key, path, errors);

  if (typeof record[key] === "string" && !isSupportedHref(record[key])) {
    errors.push(
      `${path}.${key} must be an https, mailto, tel, root-relative, or hash URL.`,
    );
  }
}

function isSupportedHref(value: string) {
  if (value.startsWith("/") || value.startsWith("#")) return true;

  try {
    return ["https:", "mailto:", "tel:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function optionalBoolean(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
) {
  if (record[key] !== undefined && typeof record[key] !== "boolean") {
    errors.push(`${path}.${key} must be a boolean when provided.`);
  }
}

function requireEnum<T extends readonly string[]>(
  record: Record<string, unknown>,
  key: string,
  path: string,
  values: T,
  errors: string[],
) {
  if (typeof record[key] !== "string" || !values.includes(record[key])) {
    errors.push(`${path}.${key} must be one of: ${values.join(", ")}.`);
  }
}

function optionalEnum<T extends readonly string[]>(
  record: Record<string, unknown>,
  key: string,
  path: string,
  values: T,
  errors: string[],
) {
  if (record[key] !== undefined) {
    requireEnum(record, key, path, values, errors);
  }
}

function requireStringArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
) {
  if (
    !Array.isArray(record[key]) ||
    !(record[key] as unknown[]).length ||
    !(record[key] as unknown[]).every(
      (item) => typeof item === "string" && item.length > 0,
    )
  ) {
    errors.push(`${path}.${key} must be a non-empty array of strings.`);
  }
}

function requireObjectArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
  validateItem: (item: Record<string, unknown>, path: string) => void,
) {
  if (!Array.isArray(record[key])) {
    errors.push(`${path}.${key} must be an array.`);
    return;
  }
  if (!record[key].length) {
    errors.push(`${path}.${key} must contain at least one item.`);
    return;
  }

  record[key].forEach((item, index) => {
    const itemPath = `${path}.${key}[${index}]`;

    if (!isRecord(item)) {
      errors.push(`${itemPath} must be an object.`);
      return;
    }

    validateItem(item, itemPath);
  });
}

function validateUniqueStrings(
  values: readonly unknown[],
  key: string,
  path: string,
  errors: string[],
) {
  const seen = new Set<string>();

  values.forEach((value, index) => {
    if (!isRecord(value) || typeof value[key] !== "string" || !value[key]) {
      return;
    }

    const candidate = value[key];
    if (seen.has(candidate)) {
      errors.push(`${path}[${index}].${key} duplicates "${candidate}".`);
      return;
    }

    seen.add(candidate);
  });
}
