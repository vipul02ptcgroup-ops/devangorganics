"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  serverTimestamp,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  baseProducts,
  baseCategoryDefinitions,
  buildCategories,
  type CategoryDefinition,
  normalizeProductRecord,
  serializeProductToRawRecord,
  type Category,
  type Product,
  type RawProductRecord,
} from "@/lib/data";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { ensureProductImageInStorage } from "@/lib/product-storage";

type ProductContextValue = {
  products: Product[];
  publicProducts: Product[];
  categories: Category[];
  publicCategories: Category[];
  categoryDefinitions: CategoryDefinition[];
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  importProducts: (records: RawProductRecord[]) => Promise<number>;
  addCategory: (category: CategoryDefinition) => Promise<void>;
  updateCategory: (
    previousSlug: string,
    category: CategoryDefinition
  ) => Promise<void>;
  deleteCategory: (slug: string) => Promise<void>;
};

const ProductContext = createContext<ProductContextValue | null>(null);

function sortProducts(items: Product[]) {
  return [...items].sort((a, b) => a.id - b.id);
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [rawProducts, setRawProducts] = useState<RawProductRecord[]>(
    isFirebaseConfigured
      ? []
      : baseProducts.map((product) => serializeProductToRawRecord(product))
  );
  const [categoryDefinitions, setCategoryDefinitions] = useState<
    CategoryDefinition[]
  >(isFirebaseConfigured ? [] : baseCategoryDefinitions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !isFirebaseConfigured) {
      setRawProducts(baseProducts.map((product) => serializeProductToRawRecord(product)));
      setCategoryDefinitions(baseCategoryDefinitions);
      setLoading(false);
      return;
    }

    let pendingSnapshots = 2;
    const finishSnapshot = () => {
      pendingSnapshots -= 1;
      if (pendingSnapshots <= 0) {
        setLoading(false);
      }
    };

    const unsubscribeProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        if (snapshot.empty) {
          setRawProducts([]);
          finishSnapshot();
          return;
        }

        const firestoreProducts = snapshot.docs.map(
          (entry) => entry.data() as RawProductRecord
        );
        setRawProducts(firestoreProducts);
        finishSnapshot();
      },
      (error) => {
        console.error("Failed to load Firestore products", error);
        setRawProducts([]);
        finishSnapshot();
      }
    );

    const unsubscribeCategories = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        if (snapshot.empty) {
          setCategoryDefinitions([]);
          finishSnapshot();
          return;
        }

        const firestoreCategories = snapshot.docs.map((entry) => {
          const data = entry.data() as Partial<CategoryDefinition>;

          return {
            name: data.name || entry.id,
            slug: data.slug || entry.id,
            iconName: data.iconName || "Leaf",
          } satisfies CategoryDefinition;
        });

        setCategoryDefinitions(
          [...firestoreCategories].sort((a, b) => a.name.localeCompare(b.name))
        );
        finishSnapshot();
      },
      (error) => {
        console.error("Failed to load Firestore categories", error);
        setCategoryDefinitions([]);
        finishSnapshot();
      }
    );

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);

  const products = useMemo(() => {
    const definitionsToUse =
      categoryDefinitions.length > 0
        ? categoryDefinitions
        : baseCategoryDefinitions;

    return sortProducts(
      rawProducts.map((product, index) =>
        normalizeProductRecord(product, index, definitionsToUse)
      )
    );
  }, [categoryDefinitions, rawProducts]);

  const categories = useMemo(() => {
    if (isFirebaseConfigured && categoryDefinitions.length === 0) {
      return [];
    }

    const definitionsToUse =
      categoryDefinitions.length > 0
        ? categoryDefinitions
        : baseCategoryDefinitions;

    return buildCategories(products, definitionsToUse, {
      includeProductOnlyCategories: categoryDefinitions.length === 0,
    });
  }, [categoryDefinitions, products]);

  const publicProducts = useMemo(() => {
    if (categoryDefinitions.length === 0) {
      return products;
    }

    const visibleCategorySlugs = new Set(
      categoryDefinitions.map((category) => category.slug)
    );

    return products.map((product) =>
      visibleCategorySlugs.has(product.category)
        ? product
        : {
            ...product,
            category: "others",
            categories: "Others",
          }
    );
  }, [categoryDefinitions, products]);

  const publicCategories = useMemo(() => {
    if (categoryDefinitions.length === 0) {
      return categories;
    }

    const definitions = [...categoryDefinitions];
    const hasOtherProducts = publicProducts.some(
      (product) => product.category === "others"
    );

    if (hasOtherProducts) {
      definitions.push({
        name: "Others",
        slug: "others",
        iconName: "Package",
      });
    }

    return buildCategories(publicProducts, definitions, {
      includeProductOnlyCategories: false,
    });
  }, [categories, categoryDefinitions, publicProducts]);

  const value: ProductContextValue = {
    products,
    publicProducts,
    categories,
    publicCategories,
    categoryDefinitions,
    loading,
    async addProduct(product) {
      if (!db) {
        throw new Error("Firebase is not configured.");
      }
      const firestore = db;
      const productWithHostedImage = await ensureProductImageInStorage(product);

      await setDoc(
        doc(firestore, "products", String(productWithHostedImage.id)),
        serializeProductToRawRecord(productWithHostedImage)
      );
    },
    async updateProduct(product) {
      if (!db) {
        throw new Error("Firebase is not configured.");
      }
      const firestore = db;
      const productWithHostedImage = await ensureProductImageInStorage(product);

      await setDoc(
        doc(firestore, "products", String(productWithHostedImage.id)),
        serializeProductToRawRecord(productWithHostedImage)
      );
    },
    async deleteProduct(id) {
      if (!db) {
        throw new Error("Firebase is not configured.");
      }
      const firestore = db;

      await deleteDoc(doc(firestore, "products", String(id)));
    },
    async importProducts(records) {
      if (!db) {
        throw new Error("Firebase is not configured.");
      }
      const firestore = db;

      const normalized = await Promise.all(
        records.map(async (record, index) =>
          ensureProductImageInStorage(
            normalizeProductRecord(
              record,
              products.length + index,
              categoryDefinitions.length > 0
                ? categoryDefinitions
                : baseCategoryDefinitions
            )
          )
        )
      );

      await Promise.all(
        normalized.map((item) =>
          setDoc(
            doc(firestore, "products", String(item.id)),
            serializeProductToRawRecord(item)
          )
        )
      );

      return normalized.length;
    },
    async addCategory(category) {
      if (!db) {
        throw new Error("Firebase is not configured.");
      }

      await setDoc(doc(db, "categories", category.slug), {
        ...category,
        updatedAt: serverTimestamp(),
      });
    },
    async updateCategory(previousSlug, category) {
      if (!db) {
        throw new Error("Firebase is not configured.");
      }

      await setDoc(doc(db, "categories", category.slug), {
        ...category,
        updatedAt: serverTimestamp(),
      });

      if (previousSlug !== category.slug) {
        await deleteDoc(doc(db, "categories", previousSlug));
      }
    },
    async deleteCategory(slug) {
      if (!db) {
        throw new Error("Firebase is not configured.");
      }

      await deleteDoc(doc(db, "categories", slug));
    },
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }
  return context;
}
