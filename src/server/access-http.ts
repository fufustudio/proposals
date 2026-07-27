import "server-only";

import { NextResponse } from "next/server";

export const accessRequestLimitBytes = 8 * 1024;

type AccessPayloadResult =
  | { ok: true; fields: Record<string, string> }
  | {
      ok: false;
      reason: "invalid" | "too-large" | "unsupported-media";
    };

export async function readAccessPayload(
  request: Request,
  fieldNames: readonly string[],
  maxBytes = accessRequestLimitBytes,
): Promise<AccessPayloadResult> {
  const mediaType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (
    mediaType !== "application/json" &&
    mediaType !== "application/x-www-form-urlencoded"
  ) {
    return { ok: false, reason: "unsupported-media" };
  }

  const body = await readBoundedBody(request, maxBytes);
  if (!body.ok) return body;

  let value: unknown;
  try {
    value =
      mediaType === "application/json"
        ? JSON.parse(body.text)
        : new URLSearchParams(body.text);
  } catch {
    return { ok: false, reason: "invalid" };
  }

  const fields = Object.fromEntries(
    fieldNames.map((name) => [name, fieldValue(value, name)]),
  );

  return { ok: true, fields };
}

export function accessResponse({
  request,
  redirectPath,
  success,
  status = 200,
  message,
}: {
  request: Request;
  redirectPath: string;
  success: boolean;
  status?: number;
  message?: string;
}) {
  const wantsJson = request.headers.get("accept")?.includes("application/json");
  const response = wantsJson
    ? NextResponse.json(
        {
          success,
          redirectTo: redirectPath,
          ...(message ? { message } : {}),
        },
        { status },
      )
    : NextResponse.redirect(new URL(redirectPath, request.url), 303);

  return applyPrivateResponseHeaders(response);
}

export function invalidAccessPayloadResponse(
  request: Request,
  reason: "invalid" | "too-large" | "unsupported-media",
) {
  const responseByReason = {
    invalid: {
      status: 400,
      message: "The access request was invalid.",
    },
    "too-large": {
      status: 413,
      message: "The access request was too large.",
    },
    "unsupported-media": {
      status: 415,
      message: "Send access requests as JSON or form data.",
    },
  } as const;
  const failure = responseByReason[reason];

  return accessResponse({
    request,
    redirectPath: "/",
    success: false,
    status: failure.status,
    message: failure.message,
  });
}

export function applyPrivateResponseHeaders<T extends Response>(response: T) {
  response.headers.set(
    "Cache-Control",
    "private, no-store, max-age=0, must-revalidate",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set(
    "X-Robots-Tag",
    "noindex, nofollow, noarchive, nosnippet",
  );
  return response;
}

export function isSecureRequest(request: Request) {
  return (
    new URL(request.url).protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https"
  );
}

async function readBoundedBody(
  request: Request,
  maxBytes: number,
): Promise<
  { ok: true; text: string } | { ok: false; reason: "invalid" | "too-large" }
> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false, reason: "too-large" };
  }
  if (!request.body) return { ok: false, reason: "invalid" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    byteLength += value.byteLength;
    if (byteLength > maxBytes) {
      await reader.cancel();
      return { ok: false, reason: "too-large" };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true, text: new TextDecoder().decode(bytes) };
}

function fieldValue(value: unknown, key: string) {
  const field =
    value instanceof URLSearchParams
      ? value.get(key)
      : value && typeof value === "object"
        ? (value as Record<string, unknown>)[key]
        : undefined;

  return typeof field === "string" ? field.trim() : "";
}
