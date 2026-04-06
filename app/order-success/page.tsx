import Link from "next/link";
import { CheckCircle, Package, Truck, Home, Download } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 5%", background: "linear-gradient(135deg, #0A0A0A, #111111)" }}>
      <div style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
        {/* Success icon */}
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.3))", border: "2px solid #C9A84C", margin: "0 auto 2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CheckCircle size={48} style={{ color: "#C9A84C" }} />
        </div>

        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "2.2rem", color: "#F5F0E8", marginBottom: "0.5rem" }}>Order Placed!</h1>
        <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "1rem", marginBottom: "1rem" }}>Thank you for choosing Devang Organics</p>
        <p style={{ color: "#C8C0B0", lineHeight: 1.8, marginBottom: "2rem", fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem" }}>
          Your order has been confirmed and will be processed shortly. You'll receive an email confirmation with tracking details.
        </p>

        <div style={{ background: "#161616", border: "1px solid #C9A84C", padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#666", fontSize: "0.75rem", letterSpacing: "0.1em" }}>ORDER NUMBER</p>
              <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "1.1rem" }}>ORD-2024-00847</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#666", fontSize: "0.75rem", letterSpacing: "0.1em" }}>ESTIMATED DELIVERY</p>
              <p style={{ color: "#F5F0E8", fontFamily: "Cinzel, serif" }}>Dec 22 – 24, 2024</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            <div style={{ position: "absolute", top: "24px", left: "10%", right: "10%", height: "2px", background: "linear-gradient(90deg, #C9A84C 40%, #2A2A2A 40%)" }} />
            {[
              { Icon: CheckCircle, label: "Order Confirmed", done: true },
              { Icon: Package, label: "Packed", done: false },
              { Icon: Truck, label: "Shipped", done: false },
              { Icon: Home, label: "Delivered", done: false },
            ].map(({ Icon, label, done }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 1 }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: done ? "linear-gradient(135deg, #C9A84C, #9A7A2E)" : "#0A0A0A", border: done ? "none" : "2px solid #2A2A2A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} style={{ color: done ? "#0A0A0A" : "#666" }} />
                </div>
                <span style={{ color: done ? "#C9A84C" : "#666", fontSize: "0.7rem", fontFamily: "Raleway, sans-serif", textAlign: "center" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/profile?tab=orders" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)", color: "#0A0A0A", padding: "14px 28px", textDecoration: "none", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em" }}>
            TRACK ORDER
          </Link>
          <button style={{ background: "transparent", border: "1px solid #2A2A2A", padding: "14px 28px", color: "#C8C0B0", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.85rem", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
            <Download size={16} /> INVOICE
          </button>
          <Link href="/products" style={{ background: "transparent", border: "1px solid #C9A84C", color: "#C9A84C", padding: "14px 28px", textDecoration: "none", fontFamily: "Cinzel, serif", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}
