import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  FieldValue,
  getUserProfile,
  jsonError,
  listWishlistForUser,
  readJsonBody,
  requireAuth,
  validateWishlistInput,
} from "@/lib/server-api";

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await requireAuth(request);
    const wishlist = await listWishlistForUser(decodedToken.uid);
    return NextResponse.json({ wishlist });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await requireAuth(request);
    const payload = await readJsonBody<Record<string, unknown>>(request);
    const wishlistInput = validateWishlistInput(payload);
    const profile = await getUserProfile(decodedToken.uid);
    const docId = `${decodedToken.uid}_${wishlistInput.productId}`;

    await getAdminDb().collection("wishlists").doc(docId).set({
      userId: decodedToken.uid,
      userEmail: profile?.email || decodedToken.email || "",
      userName: profile?.name || decodedToken.name || "",
      productId: wishlistInput.productId,
      productName: wishlistInput.productName,
      productImage: wishlistInput.productImage,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        message: "Wishlist item saved.",
      },
      { status: 201 }
    );
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decodedToken = await requireAuth(request);
    const payload = await readJsonBody<Record<string, unknown>>(request);
    const wishlistInput = validateWishlistInput(payload);
    const docId = `${decodedToken.uid}_${wishlistInput.productId}`;

    await getAdminDb().collection("wishlists").doc(docId).delete();
    return NextResponse.json({ message: "Wishlist item removed." });
  } catch (error) {
    return jsonError(error);
  }
}
