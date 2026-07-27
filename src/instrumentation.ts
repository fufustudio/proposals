import type { Instrumentation } from "next";

export function redactPrivatePath(path: string) {
  return path
    .replace(
      /^\/admin\/proposals\/[^/?#]+/,
      "/admin/proposals/[private-proposal]",
    )
    .replace(/^\/proposals\/[^/?#]+/, "/proposals/[private-proposal]");
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const safeError =
    error && typeof error === "object"
      ? {
          name:
            "name" in error && typeof error.name === "string"
              ? error.name
              : "Error",
          digest:
            "digest" in error && typeof error.digest === "string"
              ? error.digest
              : undefined,
        }
      : { name: "Error", digest: undefined };

  console.error("[next] Unhandled request error", {
    error: safeError,
    method: request.method,
    path: redactPrivatePath(request.path),
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
    ...(process.env.NODE_ENV === "development"
      ? { developmentError: error }
      : {}),
  });
};
