import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  ApiError,
  FieldValue,
  getUserProfile,
  jsonError,
  readJsonBody,
  requireAdmin,
  validateUserRole,
} from "@/lib/server-api";

type Params = {
  params: Promise<{
    uid: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { profile: requesterProfile } = await requireAdmin(request);
    const { uid } = await params;
    const payload = await readJsonBody<Record<string, unknown>>(request);
    const role = validateUserRole(payload.role);
    const targetProfile = await getUserProfile(uid);

    if (!targetProfile) {
      throw new ApiError(404, "User not found.");
    }

    if (requesterProfile.uid === uid && role !== "admin") {
      throw new ApiError(400, "You cannot remove your own admin access.");
    }

    await getAdminDb().collection("users").doc(uid).set(
      {
        role,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ message: "Role updated successfully." });
  } catch (error) {
    return jsonError(error);
  }
}
