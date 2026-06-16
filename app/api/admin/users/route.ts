import { NextRequest, NextResponse } from "next/server";
import {
  jsonError,
  listUsers,
  requireAdmin,
} from "@/lib/server-api";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const users = await listUsers();
    return NextResponse.json({ users });
  } catch (error) {
    return jsonError(error);
  }
}
