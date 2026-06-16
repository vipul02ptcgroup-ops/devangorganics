import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  getUserProfile,
  jsonError,
  requireAuth,
} from "@/lib/server-api";

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await requireAuth(request);
    const profile = await getUserProfile(decodedToken.uid);

    if (!profile) {
      throw new ApiError(404, "User profile was not found.");
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return jsonError(error);
  }
}
