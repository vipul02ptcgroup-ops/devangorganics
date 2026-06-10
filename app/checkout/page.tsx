"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Lock, CreditCard, Smartphone, Building } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CheckoutPage() {
  const { cart, cartTotal } = useStore();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("card");
  const shipping = cartTotal >= 499 ? 0 : 49;

  const inputStyle = { width: "100%", padding: "12px 16px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem", fontFamily: "Raleway, sans-serif" };
  const labelStyle = { display: "block" as const, color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px", fontFamily: "Raleway, sans-serif" };

  return (
    <div style={{ padding: "3rem 5%" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", color: "#F5F0E8" }}>Checkout</h1>
        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
          {[["1", "Address"], ["2", "Payment"], ["3", "Review"]].map(([n, label], i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: step >= Number(n) ? "linear-gradient(135deg, #C9A84C, #9A7A2E)" : "#161616", border: step >= Number(n) ? "none" : "1px solid #2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cinzel, serif", fontSize: "0.8rem", fontWeight: 700, color: step >= Number(n) ? "#0A0A0A" : "#666" }}>
                {n}
              </div>
              <span style={{ color: step >= Number(n) ? "#C9A84C" : "#666", fontSize: "0.8rem", fontFamily: "Raleway, sans-serif" }}>{label}</span>
              {i < 2 && <ChevronRight size={16} style={{ color: "#2A2A2A" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem" }} className="checkout-grid">
        {/* Left */}
        <div>
          {step === 1 && (
            <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2rem" }}>
              <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "1rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>DELIVERY ADDRESS</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div><label style={labelStyle}>First Name</label><input style={inputStyle} placeholder="First name" /></div>
                <div><label style={labelStyle}>Last Name</label><input style={inputStyle} placeholder="Last name" /></div>
                <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Email</label><input type="email" style={inputStyle} placeholder="Email address" /></div>
                <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Phone</label><input style={inputStyle} placeholder="+91 91208 79879" /></div>
                <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Address Line 1</label><input style={inputStyle} placeholder="Street address, flat no." /></div>
                <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Address Line 2</label><input style={inputStyle} placeholder="Landmark (optional)" /></div>
                <div><label style={labelStyle}>City</label><input style={inputStyle} placeholder="City" /></div>
                <div><label style={labelStyle}>State</label>
                  <select style={inputStyle}>
                    <option>Gujarat</option><option>Maharashtra</option><option>Rajasthan</option><option>Delhi</option>
                  </select>
                </div>
                <div><label style={labelStyle}>PIN Code</label><input style={inputStyle} placeholder="380001" /></div>
                <div><label style={labelStyle}>Country</label><input style={inputStyle} defaultValue="India" readOnly /></div>
              </div>
              <button onClick={() => setStep(2)} style={{ marginTop: "1.5rem", background: "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)", border: "none", padding: "14px 32px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                CONTINUE TO PAYMENT
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2rem" }}>
              <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "1rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>PAYMENT METHOD</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { key: "card", Icon: CreditCard, label: "Credit / Debit Card" },
                  { key: "upi", Icon: Smartphone, label: "UPI / Google Pay / PhonePe" },
                  { key: "netbanking", Icon: Building, label: "Net Banking" },
                  { key: "cod", Icon: Lock, label: "Cash on Delivery" },
                ].map(({ key, Icon, label }) => (
                  <div key={key} onClick={() => setPayMethod(key)} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", border: payMethod === key ? "1px solid #C9A84C" : "1px solid #2A2A2A", cursor: "pointer", background: payMethod === key ? "rgba(201,168,76,0.05)" : "transparent", transition: "all 0.2s" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: payMethod === key ? "5px solid #C9A84C" : "2px solid #666", flexShrink: 0 }} />
                    <Icon size={18} style={{ color: payMethod === key ? "#C9A84C" : "#666" }} />
                    <span style={{ color: payMethod === key ? "#F5F0E8" : "#C8C0B0", fontFamily: "Raleway, sans-serif", fontSize: "0.875rem" }}>{label}</span>
                  </div>
                ))}
              </div>
              {payMethod === "card" && (
                <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div><label style={labelStyle}>Card Number</label><input style={inputStyle} placeholder="1234 5678 9012 3456" /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div><label style={labelStyle}>Expiry Date</label><input style={inputStyle} placeholder="MM / YY" /></div>
                    <div><label style={labelStyle}>CVV</label><input type="password" style={inputStyle} placeholder="***" /></div>
                  </div>
                  <div><label style={labelStyle}>Name on Card</label><input style={inputStyle} placeholder="As printed on card" /></div>
                </div>
              )}
              {payMethod === "upi" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>UPI ID</label>
                  <input style={inputStyle} placeholder="yourname@upi" />
                </div>
              )}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={() => setStep(1)} style={{ background: "transparent", border: "1px solid #2A2A2A", padding: "12px 24px", color: "#C8C0B0", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.8rem" }}>BACK</button>
                <button onClick={() => setStep(3)} style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)", border: "none", padding: "12px 32px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                  REVIEW ORDER
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2rem" }}>
              <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "1rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>ORDER REVIEW</h2>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1A1A1A" }}>
                  <span style={{ color: "#C8C0B0", fontSize: "0.875rem" }}>{item.name} × {item.quantity}</span>
                  <span style={{ color: "#C9A84C", fontFamily: "Cinzel, serif" }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }} >
                <button onClick={() => setStep(2)} style={{ background: "transparent", border: "1px solid #2A2A2A", padding: "12px 24px", color: "#C8C0B0", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.8rem" }}>BACK</button>
                <button disabled style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)", padding: "12px 32px", color: "#0A0A0A", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Lock size={16} /> PLACE ORDER
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "1.5rem", alignSelf: "start" }}>
          <h3 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "0.9rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>ORDER SUMMARY</h3>
          {cart.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "#C8C0B0", fontSize: "0.8rem" }}>{item.name} × {item.quantity}</span>
              <span style={{ color: "#C9A84C", fontSize: "0.8rem", fontFamily: "Cinzel, serif" }}>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ height: "1px", background: "#2A2A2A", margin: "1rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#C8C0B0", fontSize: "0.875rem" }}>Subtotal</span>
            <span style={{ color: "#C9A84C", fontFamily: "Cinzel, serif" }}>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ color: "#C8C0B0", fontSize: "0.875rem" }}>Shipping</span>
            <span style={{ color: shipping === 0 ? "#4CAF50" : "#C9A84C", fontFamily: "Cinzel, serif" }}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>
          <div style={{ height: "1px", background: "#2A2A2A", margin: "0 0 1rem" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#F5F0E8", fontFamily: "Cinzel, serif", fontSize: "1rem" }}>Total</span>
            <span style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "1.25rem" }}>₹{(cartTotal + shipping).toLocaleString()}</span>
          </div>
          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "8px", padding: "10px", background: "rgba(201,168,76,0.05)", border: "1px solid #C9A84C22" }}>
            <Lock size={14} style={{ color: "#C9A84C", flexShrink: 0 }} />
            <p style={{ color: "#666", fontSize: "0.75rem" }}>Secured by 256-bit SSL encryption</p>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.checkout-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
