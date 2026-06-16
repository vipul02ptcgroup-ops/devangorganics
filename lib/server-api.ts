import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { DecodedIdToken } from "firebase-admin/auth";
import {
  FirebaseAdminConfigError,
  getAdminAuth,
  getAdminDb,
} from "@/lib/firebase-admin";
import { baseProducts } from "@/lib/data";
import type {
  AppUserProfile,
  OrderProduct,
  OrderRecord,
  OrderStatus,
  OrderType,
  PaymentStatus,
  UserRole,
  WishlistRecord,
  WishlistSummaryRecord,
} from "@/lib/api-types";

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function toIsoString(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const dateValue = (value as { toDate: () => Date }).toDate();
    return dateValue.toISOString();
  }

  return null;
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof FirebaseAdminConfigError) {
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 503 }
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}

export async function readJsonBody<T>(request: NextRequest) {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, "Invalid JSON payload.");
  }
}

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing authorization token.");
  }

  return header.slice("Bearer ".length).trim();
}

export async function requireAuth(request: NextRequest) {
  const token = getBearerToken(request);
  const decodedToken = await getAdminAuth().verifyIdToken(token);
  return decodedToken;
}

export async function requireAdmin(request: NextRequest) {
  const decodedToken = await requireAuth(request);
  const profile = await getUserProfile(decodedToken.uid);

  if (!profile || profile.role !== "admin") {
    throw new ApiError(403, "Admin access is required.");
  }

  return { decodedToken, profile };
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateUserRole(value: unknown): UserRole {
  if (value === "admin" || value === "customer") {
    return value;
  }

  throw new ApiError(400, "Role must be either customer or admin.");
}

function getRoleFromDecodedToken(decodedToken: DecodedIdToken): UserRole | null {
  if (decodedToken.role === "admin" || decodedToken.admin === true) {
    return "admin";
  }

  if (decodedToken.role === "customer") {
    return "customer";
  }

  return null;
}

export function validateNewsletterEmail(value: unknown) {
  if (!isNonEmptyString(value)) {
    throw new ApiError(400, "Email is required.");
  }

  const normalizedEmail = normalizeEmail(value);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    throw new ApiError(400, "Please enter a valid email address.");
  }

  return normalizedEmail;
}

export function validateOrderInput(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    throw new ApiError(400, "Order payload is required.");
  }

  const source = payload as Record<string, unknown>;
  const customerName = String(source.customerName || "").trim();
  const email = validateNewsletterEmail(source.email);
  const phone = String(source.phone || "").trim();
  const address = String(source.address || "").trim();
  const totalAmount = Number(source.totalAmount);
  const paymentStatus = source.paymentStatus as PaymentStatus;
  const orderStatus = source.orderStatus as OrderStatus;
  const orderType = source.orderType as OrderType;
  const rawProducts = Array.isArray(source.products) ? source.products : [];

  if (!customerName) {
    throw new ApiError(400, "Customer name is required.");
  }

  if (!phone) {
    throw new ApiError(400, "Phone is required.");
  }

  if (!address) {
    throw new ApiError(400, "Address is required.");
  }

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    throw new ApiError(400, "Total amount must be greater than zero.");
  }

  if (
    paymentStatus !== "pending" &&
    paymentStatus !== "paid" &&
    paymentStatus !== "failed"
  ) {
    throw new ApiError(400, "Invalid payment status.");
  }

  if (
    orderStatus !== "placed" &&
    orderStatus !== "confirmed" &&
    orderStatus !== "processing" &&
    orderStatus !== "shipped" &&
    orderStatus !== "delivered" &&
    orderStatus !== "cancelled"
  ) {
    throw new ApiError(400, "Invalid order status.");
  }

  if (
    orderType !== "card" &&
    orderType !== "upi" &&
    orderType !== "netbanking" &&
    orderType !== "cod"
  ) {
    throw new ApiError(400, "Invalid order type.");
  }

  const products = rawProducts.map((product, index) => {
    if (!product || typeof product !== "object") {
      throw new ApiError(400, `Product #${index + 1} is invalid.`);
    }

    const sourceProduct = product as Record<string, unknown>;
    const id = Number(sourceProduct.id);
    const name = String(sourceProduct.name || "").trim();
    const image = String(sourceProduct.image || "").trim();
    const price = Number(sourceProduct.price);
    const quantity = Number(sourceProduct.quantity);

    if (!Number.isFinite(id)) {
      throw new ApiError(400, `Product #${index + 1} is missing a valid id.`);
    }

    if (!name) {
      throw new ApiError(400, `Product #${index + 1} is missing a name.`);
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new ApiError(400, `Product #${index + 1} has an invalid price.`);
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new ApiError(400, `Product #${index + 1} has an invalid quantity.`);
    }

    const normalizedProduct: OrderProduct = {
      id,
      name,
      price,
      quantity,
    };

    if (image) {
      normalizedProduct.image = image;
    }

    return normalizedProduct;
  });

  if (products.length === 0) {
    throw new ApiError(400, "At least one product is required.");
  }

  return {
    customerName,
    email,
    phone,
    address,
    products,
    totalAmount,
    paymentStatus,
    orderStatus,
    orderType,
  };
}

export function validateWishlistInput(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    throw new ApiError(400, "Wishlist payload is required.");
  }

  const source = payload as Record<string, unknown>;
  const productId = Number(source.productId);
  const productName = String(source.productName || "").trim();
  const productImage = String(source.productImage || "").trim();

  if (!Number.isFinite(productId)) {
    throw new ApiError(400, "A valid product id is required.");
  }

  if (!productName) {
    throw new ApiError(400, "Product name is required.");
  }

  return {
    productId,
    productName,
    productImage,
  };
}

export async function upsertUserProfileFromToken(decodedToken: DecodedIdToken) {
  const userRef = getAdminDb().collection("users").doc(decodedToken.uid);
  const snapshot = await userRef.get();
  const existingRole = snapshot.data()?.role;
  const tokenRole = getRoleFromDecodedToken(decodedToken);
  const resolvedRole =
    tokenRole === "admin" || existingRole === "admin" ? "admin" : "customer";

  await userRef.set(
    {
      uid: decodedToken.uid,
      name: decodedToken.name || "",
      email: decodedToken.email || "",
      photoURL: decodedToken.picture || "",
      role: resolvedRole,
      createdAt: snapshot.exists
        ? snapshot.data()?.createdAt || FieldValue.serverTimestamp()
        : FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return getUserProfile(decodedToken.uid);
}

export async function getUserProfile(uid: string) {
  const snapshot = await getAdminDb().collection("users").doc(uid).get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data() as Record<string, unknown>;
  const profile: AppUserProfile = {
    uid: String(data.uid || uid),
    name: String(data.name || ""),
    email: String(data.email || ""),
    photoURL: String(data.photoURL || ""),
    role: data.role === "admin" ? "admin" : "customer",
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };

  return profile;
}

export async function listUsers() {
  const snapshot = await getAdminDb()
    .collection("users")
    .orderBy("updatedAt", "desc")
    .get();

  return snapshot.docs.map((entry) => {
    const data = entry.data() as Record<string, unknown>;
    return {
      uid: String(data.uid || entry.id),
      name: String(data.name || ""),
      email: String(data.email || ""),
      photoURL: String(data.photoURL || ""),
      role: data.role === "admin" ? "admin" : "customer",
      createdAt: toIsoString(data.createdAt),
      updatedAt: toIsoString(data.updatedAt),
    } satisfies AppUserProfile;
  });
}

export async function listOrdersForUser(userId: string) {
  const snapshot = await getAdminDb()
    .collection("orders")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(mapOrderSnapshot);
}

export async function listAllOrders() {
  const snapshot = await getAdminDb()
    .collection("orders")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(mapOrderSnapshot);
}

function mapOrderSnapshot(
  snapshot: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
) {
  const data = snapshot.data() as Record<string, unknown>;

  return {
    id: snapshot.id,
    userId: data.userId ? String(data.userId) : null,
    customerName: String(data.customerName || ""),
    email: String(data.email || ""),
    phone: String(data.phone || ""),
    address: String(data.address || ""),
    products: Array.isArray(data.products)
      ? (data.products as OrderProduct[])
      : [],
    totalAmount: Number(data.totalAmount || 0),
    paymentStatus: data.paymentStatus as PaymentStatus,
    orderStatus: data.orderStatus as OrderStatus,
    orderType: data.orderType as OrderType,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  } satisfies OrderRecord;
}

export async function listWishlistForUser(userId: string) {
  const snapshot = await getAdminDb()
    .collection("wishlists")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((entry) => {
    const data = entry.data() as Record<string, unknown>;

    return {
      id: entry.id,
      userId: String(data.userId || ""),
      userEmail: String(data.userEmail || ""),
      userName: String(data.userName || ""),
      productId: Number(data.productId || 0),
      productName: String(data.productName || ""),
      productImage: String(data.productImage || ""),
      createdAt: toIsoString(data.createdAt),
    } satisfies WishlistRecord;
  });
}

export async function listWishlistSummary() {
  const snapshot = await getAdminDb().collection("wishlists").get();
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
    const data = entry.data() as Record<string, unknown>;
    const productId = Number(data.productId || 0);
    const mapKey = String(productId);
    const fallbackProduct = productLookup.get(productId);

    const current =
      grouped.get(mapKey) ||
      ({
        productId,
        productName: String(data.productName || ""),
        productImage:
          String(data.productImage || "") || fallbackProduct?.productImage || "",
        productCategory: fallbackProduct?.productCategory || "N/A",
        count: 0,
        userEmails: [],
        users: [],
      } satisfies WishlistSummaryRecord);

    current.count += 1;
    const email = String(data.userEmail || "");
    const userId = String(data.userId || "");
    const userName = String(data.userName || "");
    const createdAt = toIsoString(data.createdAt);

    if (email && !current.userEmails.includes(email)) {
      current.userEmails.push(email);
    }

    if (userId && !current.users.some((user) => user.userId === userId)) {
      current.users.push({
        userId,
        userEmail: email,
        userName,
        createdAt,
      });
    }

    grouped.set(mapKey, current);
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

export { ApiError, FieldValue };
