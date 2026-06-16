import { NextRequest, NextResponse } from "next/server";
import {
  jsonError,
  listWishlistSummary,
  requireAdmin,
} from "@/lib/server-api";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const wishlist = await listWishlistSummary();
    return NextResponse.json({ wishlist });
  } catch (error) {
    return jsonError(error);
  }
}
