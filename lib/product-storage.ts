"use client";

import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import type { Product } from "@/lib/data";
import { storage } from "@/lib/firebase";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripQueryAndHash(value: string) {
  return value.split("#")[0]?.split("?")[0] ?? value;
}

function normalizeLocalImagePath(image: string) {
  const trimmed = image.trim().replace(/^\/+/, "");

  if (!trimmed) {
    return "";
  }

  if (trimmed.includes("/")) {
    return `/${trimmed}`;
  }

  return `/assets/ProductsImage/${trimmed}`;
}

function guessFileExtension(image: string, mimeType?: string) {
  const cleaned = stripQueryAndHash(image);
  const match = cleaned.match(/\.([a-z0-9]+)$/i);
  if (match) {
    return match[1].toLowerCase();
  }

  if (mimeType === "image/png") return "png";
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/avif") return "avif";
  if (mimeType === "image/gif") return "gif";

  return "webp";
}

function buildStoragePath(product: Product, extension: string) {
  const safeName = slugify(product.name) || `product-${product.id}`;
  return `products/${product.id}/${safeName}.${extension}`;
}

function isFirebaseStorageUrl(image: string) {
  return /firebasestorage\.googleapis\.com|storage\.googleapis\.com/i.test(image);
}

async function uploadDataUrlImage(image: string, product: Product) {
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }

  const mimeMatch = image.match(/^data:([^;,]+)[;,]/i);
  const mimeType = mimeMatch?.[1];
  const extension = guessFileExtension("", mimeType);
  const storageRef = ref(storage, buildStoragePath(product, extension));

  await uploadString(storageRef, image, "data_url");
  return getDownloadURL(storageRef);
}

async function uploadFetchedImage(sourceUrl: string, originalImage: string, product: Product) {
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to load image from ${sourceUrl}.`);
  }

  const blob = await response.blob();
  const extension = guessFileExtension(originalImage || sourceUrl, blob.type);
  const storageRef = ref(storage, buildStoragePath(product, extension));

  await uploadBytes(storageRef, blob, blob.type ? { contentType: blob.type } : undefined);
  return getDownloadURL(storageRef);
}

export async function ensureProductImageInStorage(product: Product) {
  const image = product.image.trim();

  if (!image) {
    return product;
  }

  if (isFirebaseStorageUrl(image)) {
    return product;
  }

  if (image.startsWith("data:")) {
    try {
      const uploadedUrl = await uploadDataUrlImage(image, product);
      return {
        ...product,
        image: uploadedUrl,
      };
    } catch (error) {
      console.warn("Failed to upload inline product image to Firebase Storage.", {
        productId: product.id,
        image,
        error,
      });
      return product;
    }
  }

  if (/^(https?:)?\/\//i.test(image)) {
    try {
      const uploadedUrl = await uploadFetchedImage(image, image, product);
      return {
        ...product,
        image: uploadedUrl,
      };
    } catch (error) {
      console.warn("Failed to copy remote product image to Firebase Storage.", {
        productId: product.id,
        image,
        error,
      });
      return product;
    }
  }

  const localPath = normalizeLocalImagePath(image);

  if (localPath.startsWith("/")) {
    try {
      const uploadedUrl = await uploadFetchedImage(localPath, image, product);
      return {
        ...product,
        image: uploadedUrl,
      };
    } catch (error) {
      console.warn("Failed to copy local product image to Firebase Storage.", {
        productId: product.id,
        localPath,
        image,
        error,
      });
      return product;
    }
  }

  return product;
}
