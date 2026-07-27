import {
  adminAccessCookieName,
  adminAccessPath,
  adminPath,
} from "@/server/admin-access";
import { accessResponse, isSecureRequest } from "@/server/access-http";

export async function POST(request: Request) {
  const response = accessResponse({
    request,
    redirectPath: adminAccessPath,
    success: true,
  });

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
