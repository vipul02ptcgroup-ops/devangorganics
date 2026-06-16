import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  FieldValue,
  jsonError,
  normalizeEmail,
  readJsonBody,
  validateNewsletterEmail,
} from "@/lib/server-api";

export async function POST(request: NextRequest) {
  try {
    const payload = await readJsonBody<Record<string, unknown>>(request);
    const email = validateNewsletterEmail(payload.email);
    const subscriberId = normalizeEmail(email).replace(/[^a-z0-9]+/g, "_");
    const subscriberRef = getAdminDb()
      .collection("newsletterSubscribers")
      .doc(subscriberId);
    const snapshot = await subscriberRef.get();

    if (snapshot.exists) {
      return NextResponse.json({
        message: "This email is already subscribed.",
        duplicate: true,
      });
    }

    await subscriberRef.set({
      email,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        message: "Subscribed successfully.",
        duplicate: false,
      },
      { status: 201 }
    );
  } catch (error) {
    return jsonError(error);
  }
}
