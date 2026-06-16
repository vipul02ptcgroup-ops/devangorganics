import { NextRequest, NextResponse } from "next/server";
import {
  jsonError,
  requireAuth,
  upsertUserProfileFromToken,
} from "@/lib/server-api";

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await requireAuth(request);
    const profile = await upsertUserProfileFromToken(decodedToken);
    return NextResponse.json({ profile });
  } catch (error) {
    return jsonError(error);
  }
}
