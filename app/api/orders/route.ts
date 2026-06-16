import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  FieldValue,
  jsonError,
  listOrdersForUser,
  readJsonBody,
  requireAuth,
  validateOrderInput,
} from "@/lib/server-api";

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await requireAuth(request);
    const orders = await listOrdersForUser(decodedToken.uid);
    return NextResponse.json({ orders });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await requireAuth(request);
    const payload = await readJsonBody<Record<string, unknown>>(request);
    const order = validateOrderInput(payload);
    const orderId = randomUUID();

    await getAdminDb().collection("orders").doc(orderId).set({
      ...order,
      userId: decodedToken.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        orderId,
        message: "Order placed successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return jsonError(error);
  }
}
