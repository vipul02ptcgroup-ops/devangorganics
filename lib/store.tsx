"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { WishlistRecord } from "@/lib/api-types";
import { useAuth } from "@/lib/auth";
import { resolveProductImageSrc } from "@/lib/product-images";
import {
  deleteWishlistItemClient,
  getWishlistForUserClient,
  saveWishlistItemClient,
} from "@/lib/wishlist-client";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  color: string;
  image?: string;
}

interface WishlistInput {
  productId: number;
  productName: string;
  productImage: string;
}

interface StoreContextType {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: number[];
  wishlistItems: WishlistRecord[];
  wishlistLoading: boolean;
  toggleWishlist: (item: WishlistInput) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

function createLocalWishlistRecord(
  user: NonNullable<ReturnType<typeof useAuth>["user"]>,
  item: WishlistInput
): WishlistRecord {
  return {
    id: `${user.uid}_${item.productId}`,
    userId: user.uid,
    userEmail: user.email || "",
    userName: user.displayName || "",
    productId: item.productId,
    productName: item.productName,
    productImage: item.productImage,
    createdAt: new Date().toISOString(),
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistRecord[]>([]);
  const [guestWishlist, setGuestWishlist] = useState<WishlistInput[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    const normalizedItem = {
      ...item,
      image: item.image ? resolveProductImageSrc(item.image, item.name) : "",
    };

    setCart((prev) => {
      const existing = prev.find((entry) => entry.id === normalizedItem.id);

      if (existing) {
        return prev.map((entry) =>
          entry.id === normalizedItem.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      return [...prev, { ...normalizedItem, quantity: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const updateQty = useCallback(
    (id: number, qty: number) => {
      if (qty <= 0) {
        removeFromCart(id);
        return;
      }

      setCart((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, quantity: qty } : entry
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCartOpen(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setWishlistItems([]);
      setWishlistLoading(false);
      return;
    }

    const loadWishlist = async () => {
      setWishlistLoading(true);

      try {
        const wishlist = await getWishlistForUserClient(user.uid);

        if (!cancelled) {
          setWishlistItems(wishlist);
        }
      } catch (error) {
        console.error("Failed to load wishlist", error);
        if (!cancelled) {
          setWishlistItems([]);
        }
      } finally {
        if (!cancelled) {
          setWishlistLoading(false);
        }
      }
    };

    void loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggleWishlist = useCallback(
    async (item: WishlistInput) => {
      const normalizedItem = {
        ...item,
        productImage: resolveProductImageSrc(item.productImage, item.productName),
      };

      if (!user) {
        setGuestWishlist((prev) =>
          prev.some((entry) => entry.productId === normalizedItem.productId)
            ? prev.filter((entry) => entry.productId !== normalizedItem.productId)
            : [...prev, normalizedItem]
        );
        return;
      }

      const exists = wishlistItems.some(
        (entry) => entry.productId === normalizedItem.productId
      );

      if (exists) {
        await deleteWishlistItemClient(`${user.uid}_${normalizedItem.productId}`);

        setWishlistItems((prev) =>
          prev.filter((entry) => entry.productId !== normalizedItem.productId)
        );
        return;
      }

      await saveWishlistItemClient(createLocalWishlistRecord(user, normalizedItem));

      setWishlistItems((prev) => [
        createLocalWishlistRecord(user, normalizedItem),
        ...prev.filter((entry) => entry.productId !== normalizedItem.productId),
      ]);
    },
    [user, wishlistItems]
  );

  const cartTotal = cart.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);
  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const wishlist = useMemo(() => {
    const source = user
      ? wishlistItems.map((entry) => entry.productId)
      : guestWishlist.map((entry) => entry.productId);

    return Array.from(new Set(source));
  }, [guestWishlist, user, wishlistItems]);

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        wishlistItems,
        wishlistLoading,
        toggleWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
