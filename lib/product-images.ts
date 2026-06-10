const localExtensions = [".webp", ".png", ".jpg", ".jpeg", ".avif"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  const productSlug = slugify(productName);
  const productNameRaw = productName.trim();

  if (productSlug) {
    for (const extension of localExtensions) {
      candidates.add(`/assets/ProductsImage/${productSlug}${extension}`);
      candidates.add(`/assets/ProductsImage/${productNameRaw}${extension}`);
    }
  }

  return Array.from(candidates).filter(Boolean);
}
