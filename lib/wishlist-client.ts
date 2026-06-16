"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { baseProducts } from "@/lib/data";
import type { WishlistRecord, WishlistSummaryRecord } from "@/lib/api-types";
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

function mapWishlistDocument(id: string, data: DocumentData): WishlistRecord {
  return {
    id,
    userId: String(data.userId || ""),
    userEmail: String(data.userEmail || ""),
    userName: String(data.userName || ""),
    productId: Number(data.productId || 0),
    productName: String(data.productName || ""),
    productImage: String(data.productImage || ""),
    createdAt: toIsoString(data.createdAt),
  };
}

export async function getWishlistForUserClient(userId: string) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const snapshot = await getDocs(
    query(collection(db, "wishlists"), where("userId", "==", userId))
  );

  return snapshot.docs
    .map((entry) => mapWishlistDocument(entry.id, entry.data()))
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
}

export async function saveWishlistItemClient(item: WishlistRecord) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  await setDoc(doc(db, "wishlists", item.id), {
    userId: item.userId,
    userEmail: item.userEmail,
    userName: item.userName,
    productId: item.productId,
    productName: item.productName,
    productImage: item.productImage,
    createdAt: serverTimestamp(),
  });
}

export async function deleteWishlistItemClient(recordId: string) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  await deleteDoc(doc(db, "wishlists", recordId));
}

export async function getWishlistSummaryClient() {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const snapshot = await getDocs(collection(db, "wishlists"));
  const productLookup = new Map(
    baseProducts.map((product) => [
      product.id,
      {
        productCategory: product.categories || "Others",
        productImage: product.image || "",
      },
    ])
  );
  const grouped = new Map<string, WishlistSummaryRecord>();

  snapshot.docs.forEach((entry) => {
    const record = mapWishlistDocument(entry.id, entry.data());
    const fallbackProduct = productLookup.get(record.productId);
    const key = String(record.productId);
    const current =
      grouped.get(key) ||
      ({
        productId: record.productId,
        productName: record.productName,
        productImage: record.productImage || fallbackProduct?.productImage || "",
        productCategory: fallbackProduct?.productCategory || "N/A",
        count: 0,
        userEmails: [],
        users: [],
      } satisfies WishlistSummaryRecord);

    current.count += 1;

    if (record.userEmail && !current.userEmails.includes(record.userEmail)) {
      current.userEmails.push(record.userEmail);
    }

    if (!current.users.some((user) => user.userId === record.userId)) {
      current.users.push({
        userId: record.userId,
        userEmail: record.userEmail,
        userName: record.userName,
        createdAt: record.createdAt,
      });
    }

    grouped.set(key, current);
  });

  return Array.from(grouped.values())
    .map((entry) => ({
      ...entry,
      users: [...entry.users].sort((a, b) =>
        (a.userName || a.userEmail || a.userId).localeCompare(
          b.userName || b.userEmail || b.userId
        )
      ),
    }))
    .sort((a, b) => b.count - a.count);
}
