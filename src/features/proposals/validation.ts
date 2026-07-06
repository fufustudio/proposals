import type { Proposal } from "@/features/proposals";

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
] as const;

const slideLayoutValues = [
  "appendix",
  "cover",
  "grid",
  "list",
  "pricing",
  "split",
  "statement",
  "timeline",
] as const;

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
] as const;

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
  } else {
    value.forEach((proposal, index) => {
      validateProposalObject(proposal, `proposals[${index}]`, errors);
    });
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

  requireString(value, "slug", path, errors);
  requireString(value, "title", path, errors);
  requireString(value, "clientLabel", path, errors);
  requireEnum(value, "status", path, proposalStatusValues, errors);
  requireString(value, "preparedAt", path, errors);
  optionalString(value, "updatedAt", path, errors);
  requireString(value, "summary", path, errors);

  if (!Array.isArray(value.slides)) {
    errors.push(`${path}.slides must be an array.`);
    return;
  }

  value.slides.forEach((slide, index) =>
    validateSlide(slide, `${path}.slides[${index}]`, errors),
  );
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
      requireString(value, "href", path, errors);
      optionalString(value, "support", path, errors);
      optionalString(value, "supportHref", path, errors);
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
    !(record[key] as unknown[]).every((item) => typeof item === "string")
  ) {
    errors.push(`${path}.${key} must be an array of strings.`);
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

  record[key].forEach((item, index) => {
    const itemPath = `${path}.${key}[${index}]`;

    if (!isRecord(item)) {
      errors.push(`${itemPath} must be an object.`);
      return;
    }

    validateItem(item, itemPath);
  });
}
