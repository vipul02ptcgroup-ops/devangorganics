"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  color: string;
}

interface StoreContextType {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  cartTotal: number;
  cartCount: number;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(c => c.id === id ? { ...c, quantity: qty } : c));
  }, [removeFromCart]);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  }, []);

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <StoreContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, cartTotal, cartCount, wishlist, toggleWishlist }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
