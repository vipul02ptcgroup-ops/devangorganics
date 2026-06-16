"use client";

import {
  collection,
  getDocs,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import type { OrderProduct, OrderRecord, OrderStatus, OrderType, PaymentStatus } from "@/lib/api-types";
import { db } from "@/lib/firebase";

function toIsoString(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return typeof value === "string" ? value : null;
}

function mapOrderDocument(id: string, data: DocumentData): OrderRecord {
  return {
    id,
    userId: data.userId ? String(data.userId) : null,
    customerName: String(data.customerName || ""),
    email: String(data.email || ""),
    phone: String(data.phone || ""),
    address: String(data.address || ""),
    products: Array.isArray(data.products) ? (data.products as OrderProduct[]) : [],
    totalAmount: Number(data.totalAmount || 0),
    paymentStatus: data.paymentStatus as PaymentStatus,
    orderStatus: data.orderStatus as OrderStatus,
    orderType: data.orderType as OrderType,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

export async function getOrdersForUserClient(userId: string) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const snapshot = await getDocs(
    query(collection(db, "orders"), where("userId", "==", userId))
  );

  return snapshot.docs
    .map((entry) => mapOrderDocument(entry.id, entry.data()))
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
}

export async function getAllOrdersClient() {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const snapshot = await getDocs(collection(db, "orders"));

  return snapshot.docs
    .map((entry) => mapOrderDocument(entry.id, entry.data()))
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
}
