import { NextRequest, NextResponse } from "next/server";
import {
  jsonError,
  listAllOrders,
  requireAdmin,
} from "@/lib/server-api";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const orders = await listAllOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    return jsonError(error);
  }
}
