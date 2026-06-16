"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import type { ProductReviewRecord } from "@/lib/api-types";
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

function mapReviewDocument(id: string, data: DocumentData): ProductReviewRecord {
  return {
    id,
    userId: String(data.userId || ""),
    userEmail: String(data.userEmail || ""),
    userName: String(data.userName || ""),
    productId: Number(data.productId || 0),
    productName: String(data.productName || ""),
    productImage: String(data.productImage || ""),
    productCategory: String(data.productCategory || "Others"),
    rating: Number(data.rating || 0),
    comment: String(data.comment || ""),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

function sortReviewsByDate(items: ProductReviewRecord[]) {
  return [...items].sort((a, b) => {
    const aTime = a.updatedAt || a.createdAt;
    const bTime = b.updatedAt || b.createdAt;

    return new Date(bTime || 0).getTime() - new Date(aTime || 0).getTime();
  });
}

export async function getReviewsForProductClient(productId: number) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const snapshot = await getDocs(collection(db, "reviews"));

  return sortReviewsByDate(
    snapshot.docs
      .map((entry) => mapReviewDocument(entry.id, entry.data()))
      .filter((entry) => entry.productId === productId)
  );
}

export async function getAllReviewsClient() {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const snapshot = await getDocs(collection(db, "reviews"));

  return sortReviewsByDate(
    snapshot.docs.map((entry) => mapReviewDocument(entry.id, entry.data()))
  );
}

export async function saveReviewClient(review: ProductReviewRecord) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  await setDoc(
    doc(db, "reviews", review.id),
    {
      userId: review.userId,
      userEmail: review.userEmail,
      userName: review.userName,
      productId: review.productId,
      productName: review.productName,
      productImage: review.productImage,
      productCategory: review.productCategory,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt ? review.createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteReviewClient(reviewId: string) {
  if (!db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  await deleteDoc(doc(db, "reviews", reviewId));
}
