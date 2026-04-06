"use client";
import { useStore } from "@/lib/store";
import { X, ShoppingBag, Minus, Plus, Trash2, Package } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useStore();

  if (!cartOpen) return null;

  return (
    <>
      <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "420px", maxWidth: "100vw", background: "#111111", zIndex: 201, display: "flex", flexDirection: "column", borderLeft: "1px solid #C9A84C" }}>
        {/* Header */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #2A2A2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={20} style={{ color: "#C9A84C" }} />
            <h3 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "1rem", letterSpacing: "0.1em" }}>YOUR CART ({cart.length})</h3>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "#C8C0B0", cursor: "pointer" }}>
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <ShoppingBag size={48} style={{ color: "#2A2A2A", margin: "0 auto 1rem" }} />
              <p style={{ color: "#666", fontFamily: "Raleway, sans-serif" }}>Your cart is empty</p>
              <button onClick={() => setCartOpen(false)} style={{ marginTop: "1.5rem", background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", border: "none", padding: "10px 24px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                BROWSE PRODUCTS
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: "12px", padding: "1rem 0", borderBottom: "1px solid #1A1A1A", alignItems: "center" }}>
                {/* Color block as image placeholder */}
                <div style={{ width: "70px", height: "70px", background: "#161616", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #2A2A2A" }}>
                  <Package size={24} style={{ color: "#C9A84C", opacity: 0.7 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#F5F0E8", fontFamily: "Raleway, sans-serif", fontWeight: 600, fontSize: "0.875rem", marginBottom: "4px" }}>{item.name}</p>
                  <p style={{ color: "#666", fontSize: "0.75rem" }}>{item.weight}</p>
                  <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "0.9rem", marginTop: "4px" }}>₹{item.price}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #2A2A2A" }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ background: "none", border: "none", color: "#C8C0B0", cursor: "pointer", padding: "4px 8px" }}><Minus size={14} /></button>
                    <span style={{ color: "#F5F0E8", padding: "4px 8px", fontSize: "0.875rem" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ background: "none", border: "none", color: "#C8C0B0", cursor: "pointer", padding: "4px 8px" }}><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "1.5rem", borderTop: "1px solid #2A2A2A" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ color: "#C8C0B0", fontFamily: "Raleway, sans-serif" }}>Subtotal</span>
              <span style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "1.1rem" }}>₹{cartTotal.toLocaleString()}</span>
            </div>
            <p style={{ color: "#666", fontSize: "0.75rem", marginBottom: "1rem" }}>Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={() => setCartOpen(false)}
              style={{ display: "block", width: "100%", background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", border: "none", padding: "14px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.1em", textAlign: "center", textDecoration: "none", marginBottom: "10px" }}>
              PROCEED TO CHECKOUT
            </Link>
            <Link href="/cart" onClick={() => setCartOpen(false)}
              style={{ display: "block", width: "100%", background: "transparent", border: "1px solid #C9A84C", padding: "12px", color: "#C9A84C", fontFamily: "Cinzel, serif", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.05em", textAlign: "center", textDecoration: "none" }}>
              VIEW CART
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
