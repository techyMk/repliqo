// =============================================================================
// GET /api/auth/instagram
// Starts the Instagram OAuth flow. Generates a state token, stores it in an
// http-only cookie, redirects the user to instagram.com/oauth/authorize.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildInstagramAuthUrl } from "@/lib/instagram/oauth";
import { generateOAuthState } from "@/lib/crypto";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const state = generateOAuthState();
  const url = buildInstagramAuthUrl(state);

  const jar = await cookies();
  jar.set("ig_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  // Optional: capture where to return the user after connection.
  const returnTo = req.nextUrl.searchParams.get("return_to");
  if (returnTo) {
    jar.set("ig_oauth_return", returnTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });
  }

  return NextResponse.redirect(url);
}
