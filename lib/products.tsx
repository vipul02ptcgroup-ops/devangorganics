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
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  baseProducts,
  buildCategories,
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
  categories: Category[];
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  importProducts: (records: RawProductRecord[]) => Promise<number>;
};

const ProductContext = createContext<ProductContextValue | null>(null);

function sortProducts(items: Product[]) {
  return [...items].sort((a, b) => a.id - b.id);
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(
    isFirebaseConfigured ? [] : baseProducts
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !isFirebaseConfigured) {
      setProducts(baseProducts);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        if (snapshot.empty) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const firestoreProducts = snapshot.docs.map((entry, index) =>
          normalizeProductRecord(entry.data() as RawProductRecord, index)
        );
        setProducts(sortProducts(firestoreProducts));
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load Firestore products", error);
        setProducts([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const categories = useMemo(() => buildCategories(products), [products]);

  const value: ProductContextValue = {
    products,
    categories,
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
            normalizeProductRecord(record, products.length + index)
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
