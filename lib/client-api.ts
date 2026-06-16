"use client";

import type { User } from "firebase/auth";
import type { ApiErrorResponse } from "@/lib/api-types";

export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

export async function createAuthHeaders(
  user: User | null,
  forceRefresh = false
): Promise<Record<string, string>> {
  if (!user) {
    return {};
  }

  const token = await user.getIdToken(forceRefresh);
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const errorMessage =
      payload && typeof payload === "object" && "error" in payload
        ? (payload as ApiErrorResponse).error
        : "Request failed.";

    throw new ApiRequestError(response.status, errorMessage);
  }

  return payload as T;
}
