function normalizeLocalPath(path: string) {
  return path.replace(/^\/+/, "");
}

export function getProductImageCandidates(image: string, productName: string) {
  const candidates = new Set<string>();
  const trimmedImage = image.trim();

  if (trimmedImage.startsWith("data:")) {
    candidates.add(trimmedImage);
  }

  if (/^(https?:)?\/\//i.test(trimmedImage)) {
    candidates.add(trimmedImage);
  }

  if (trimmedImage) {
    const normalized = normalizeLocalPath(trimmedImage);
    candidates.add(`/${normalized}`);

    if (!normalized.includes("/")) {
      candidates.add(`/assets/ProductsImage/${normalized}`);
    }
  }

  return Array.from(candidates).filter(Boolean);
}

export function resolveProductImageSrc(image: string, productName: string) {
  return getProductImageCandidates(image, productName)[0] || "";
}
