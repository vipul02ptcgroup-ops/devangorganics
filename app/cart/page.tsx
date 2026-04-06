"use client";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Package } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal } = useStore();
  const shipping = cartTotal >= 499 ? 0 : 49;
  const discount = 0;
  const total = cartTotal + shipping - discount;

  return (
    <div style={{ padding: "3rem 5%" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.3em", marginBottom: "0.5rem" }}>YOUR BASKET</p>
        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#F5F0E8" }}>Shopping Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: "6rem 0" }}>
          <ShoppingBag size={64} style={{ color: "#2A2A2A", margin: "0 auto 1.5rem" }} />
          <h2 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E8", marginBottom: "1rem" }}>Your cart is empty</h2>
          <p style={{ color: "#666", marginBottom: "2rem" }}>Discover our organic products</p>
          <Link href="/products" style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#0A0A0A", padding: "14px 32px", textDecoration: "none", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em" }}>
            BROWSE PRODUCTS
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem" }} className="cart-layout">
          {/* Items */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #2A2A2A", marginBottom: "0.5rem" }}>
              <span style={{ color: "#666", fontSize: "0.8rem", letterSpacing: "0.08em", fontFamily: "Cinzel, serif" }}>PRODUCT</span>
              <div style={{ display: "flex", gap: "4rem" }}>
                <span style={{ color: "#666", fontSize: "0.8rem", letterSpacing: "0.08em", fontFamily: "Cinzel, serif" }}>QTY</span>
                <span style={{ color: "#666", fontSize: "0.8rem", letterSpacing: "0.08em", fontFamily: "Cinzel, serif" }}>TOTAL</span>
              </div>
            </div>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: "1px solid #1A1A1A", alignItems: "center" }}>
                <div style={{ width: "80px", height: "80px", background: "#161616", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #2A2A2A" }}>
                  <Package size={28} style={{ color: "#C9A84C", opacity: 0.7 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#F5F0E8", fontFamily: "Raleway, sans-serif", fontWeight: 600 }}>{item.name}</p>
                  <p style={{ color: "#666", fontSize: "0.8rem" }}>{item.weight}</p>
                  <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", marginTop: "4px" }}>₹{item.price}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #2A2A2A" }}>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ background: "none", border: "none", color: "#C8C0B0", cursor: "pointer", padding: "8px 14px" }}><Minus size={14} /></button>
                  <span style={{ color: "#F5F0E8", padding: "8px 14px", minWidth: "36px", textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ background: "none", border: "none", color: "#C8C0B0", cursor: "pointer", padding: "8px 14px" }}><Plus size={14} /></button>
                </div>
                <div style={{ textAlign: "right", minWidth: "80px" }}>
                  <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "1rem" }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px" }}><Trash2 size={16} /></button>
              </div>
            ))}

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Tag size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                <input placeholder="Coupon code (DEVANG20)" style={{ width: "100%", padding: "12px 16px 12px 44px", background: "#161616", border: "1px solid #2A2A2A", color: "#F5F0E8" }} />
              </div>
              <button style={{ background: "transparent", border: "1px solid #C9A84C", padding: "12px 24px", color: "#C9A84C", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.8rem", letterSpacing: "0.05em" }}>APPLY</button>
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "1.5rem", alignSelf: "start", position: "sticky", top: "100px" }}>
            <h3 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "0.9rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>ORDER SUMMARY</h3>
            {[["Subtotal", `₹${cartTotal.toLocaleString()}`], ["Shipping", shipping === 0 ? "FREE" : `₹${shipping}`], ["Discount", `-₹${discount}`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ color: "#C8C0B0", fontSize: "0.875rem" }}>{l}</span>
                <span style={{ color: l === "Shipping" && shipping === 0 ? "#4CAF50" : "#C9A84C", fontFamily: "Cinzel, serif" }}>{v}</span>
              </div>
            ))}
            <div style={{ height: "1px", background: "#2A2A2A", margin: "1rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <span style={{ color: "#F5F0E8", fontFamily: "Cinzel, serif", fontSize: "1rem" }}>Total</span>
              <span style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "1.25rem" }}>₹{total.toLocaleString()}</span>
            </div>
            {shipping > 0 && <p style={{ color: "#4CAF50", fontSize: "0.75rem", marginBottom: "1rem" }}>Add ₹{499 - cartTotal} more for free shipping!</p>}
            <Link href="/checkout" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", padding: "14px", color: "#0A0A0A", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", textDecoration: "none", marginBottom: "1rem" }}>
              CHECKOUT <ArrowRight size={16} />
            </Link>
            <Link href="/products" style={{ display: "block", textAlign: "center", color: "#666", fontSize: "0.8rem", textDecoration: "none" }}>← Continue Shopping</Link>
          </div>
        </div>
      )}
      <style>{`@media(max-width:900px){.cart-layout{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
