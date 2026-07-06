import { NextResponse } from "next/server";
import {
  adminAccessCookieName,
  adminAccessPath,
  adminPath,
} from "@/server/admin-access";

export async function POST(request: Request) {
  const wantsJson = request.headers.get("accept")?.includes("application/json");
  const response = wantsJson
    ? NextResponse.json({ success: true, redirectTo: adminAccessPath })
    : NextResponse.redirect(new URL(adminAccessPath, request.url), 303);

  response.cookies.set({
    name: adminAccessCookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest(request),
    path: adminPath,
    maxAge: 0,
  });

  return response;
}

function isSecureRequest(request: Request) {
  return (
    new URL(request.url).protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https"
  );
}
