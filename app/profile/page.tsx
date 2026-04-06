"use client";
import { useState } from "react";
import { User, Package, Heart, MapPin, Settings, LogOut, Star, ChevronRight, Edit } from "lucide-react";
import { products } from "@/lib/data";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";

const tabs = [
  { key: "overview", label: "Overview", Icon: User },
  { key: "orders", label: "My Orders", Icon: Package },
  { key: "wishlist", label: "Wishlist", Icon: Heart },
  { key: "addresses", label: "Addresses", Icon: MapPin },
  // { key: "settings", label: "Settings", Icon: Settings },
];

export default function ProfilePage() {
  const [tab, setTab] = useState("overview");
  const { wishlist } = useStore();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const orders = [{}];

  const statusColor = (s: string) => s === "Delivered" ? "#4CAF50" : s === "Processing" ? "#C9A84C" : "#666";

  return (
    <div style={{ padding: "3rem 5%", display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem" }} className="profile-layout">
      {/* Sidebar */}
      <aside>
        {/* User card */}
        <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>
          <div style={{ width: "70px", height: "70px", background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", borderRadius: "50%", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontFamily: "Cinzel, serif", fontWeight: 700, color: "#0A0A0A" }}>
            GU
          </div>
          <h3 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E8", marginBottom: "4px" }}>Guest User</h3>
          <p style={{ color: "#666", fontSize: "0.8rem" }}>guestuser@gmail.com</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #2A2A2A" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "1.1rem" }}>0</p>
              <p style={{ color: "#666", fontSize: "0.7rem" }}>Orders</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "1.1rem" }}>{wishlist.length}</p>
              <p style={{ color: "#666", fontSize: "0.7rem" }}>Wishlist</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ background: "#161616", border: "1px solid #2A2A2A" }}>
          {tabs.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "14px 20px", background: "none", border: "none", borderLeft: tab === key ? "2px solid #C9A84C" : "2px solid transparent", cursor: "pointer", color: tab === key ? "#C9A84C" : "#C8C0B0", fontFamily: "Raleway, sans-serif", fontSize: "0.875rem", textAlign: "left", transition: "all 0.2s" }}>
              <Icon size={16} />{label}
            </button>
          ))}
          <button style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "14px 20px", background: "none", border: "none", borderTop: "1px solid #2A2A2A", cursor: "pointer", color: "#666", fontFamily: "Raleway, sans-serif", fontSize: "0.875rem" }}>
            <LogOut size={16} />Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div>
        {tab === "overview" && (
          <div>
            <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", marginBottom: "1.5rem", fontSize: "1.2rem", letterSpacing: "0.05em" }}>ACCOUNT OVERVIEW</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
              {[["0", "Total Orders", Package], ["₹0", "Total Spent", Star], [wishlist.length.toString(), "Wishlist Items", Heart]].map(([val, label, Icon]: any) => (
                <div key={label} style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                  <Icon size={24} style={{ color: "#C9A84C" }} />
                  <div>
                    <p style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", color: "#C9A84C" }}>{val}</p>
                    <p style={{ color: "#666", fontSize: "0.75rem" }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
            <h3 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E8", marginBottom: "1rem", fontSize: "0.9rem" }}>RECENT ORDERS</h3>
            {orders.slice(0, 2).map(o => (
              <div key={o.id} style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "1.25rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#F5F0E8", fontWeight: 600, fontSize: "0.875rem" }}>{o.id}</p>
                  <p style={{ color: "#666", fontSize: "0.8rem" }}>{o.date} · {o.items} items</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: statusColor(o.status), fontSize: "0.8rem", marginBottom: "4px" }}>● {o.status}</p>
                  <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif" }}>₹{o.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", marginBottom: "1.5rem", fontSize: "1.2rem" }}>MY ORDERS</h2>
            {orders.map(o => (
              <div key={o.id} style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "1.5rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <p style={{ color: "#F5F0E8", fontWeight: 600 }}>{o.id}</p>
                    <p style={{ color: "#666", fontSize: "0.8rem" }}>Placed on {o.date}</p>
                  </div>
                  <span style={{ background: statusColor(o.status) + "22", color: statusColor(o.status), padding: "4px 12px", fontSize: "0.75rem", fontFamily: "Cinzel, serif" }}>{o.status}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #1A1A1A" }}>
                  <span style={{ color: "#C8C0B0", fontSize: "0.875rem" }}>{o.items} items</span>
                  <span style={{ color: "#C9A84C", fontFamily: "Cinzel, serif", fontSize: "1.1rem" }}>₹{o.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "wishlist" && (
          <div>
            <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", marginBottom: "1.5rem", fontSize: "1.2rem" }}>MY WISHLIST</h2>
            {wishlistProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", background: "#161616", border: "1px solid #2A2A2A" }}>
                <Heart size={48} style={{ color: "#2A2A2A", margin: "0 auto 1rem" }} />
                <p style={{ color: "#666" }}>Your wishlist is empty</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
                {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        )}

        {tab === "addresses" && (
          <div>
            <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", marginBottom: "1.5rem", fontSize: "1.2rem" }}>ADDRESS</h2>
            {/* <div style={{ background: "#161616", border: "1px solid #C9A84C", padding: "1.5rem", marginBottom: "1rem", position: "relative" }}>
              <span style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(201,168,76,0.15)", color: "#C9A84C", padding: "2px 8px", fontSize: "0.7rem" }}>DEFAULT</span>
              <p style={{ color: "#F5F0E8", fontWeight: 600, marginBottom: "8px" }}>Home</p>
              <p style={{ color: "#C8C0B0", fontSize: "0.875rem", lineHeight: 1.7 }}>Flat 402, Green Valley Apartments,<br />Vastrapur, Ahmedabad - 380015<br />Gujarat, India</p>
              <button style={{ marginTop: "1rem", background: "transparent", border: "1px solid #2A2A2A", color: "#C8C0B0", padding: "8px 16px", cursor: "pointer", fontSize: "0.8rem" }}>Edit Address</button>
            </div> */}
            {/* <button style={{ width: "100%", background: "transparent", border: "1px dashed #2A2A2A", padding: "1.5rem", color: "#666", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              + ADD NEW ADDRESS
            </button> */}
          </div>
        )}

        {tab === "settings" && (
          <div>
            <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", marginBottom: "1.5rem", fontSize: "1.2rem" }}>ACCOUNT SETTINGS</h2>
            <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2rem", marginBottom: "1rem" }}>
              <h3 style={{ fontFamily: "Cinzel, serif", color: "#F5F0E8", fontSize: "0.9rem", marginBottom: "1.5rem" }}>PERSONAL INFORMATION</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[["First Name", "Priya"], ["Last Name", "Kumar"], ["Email", "priya.kumar@gmail.com"], ["Phone", "+91 91208 79879"]].map(([label, val]) => (
                  <div key={label}>
                    <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>{label}</label>
                    <input defaultValue={val} style={{ width: "100%", padding: "10px 16px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
                  </div>
                ))}
              </div>
              <button style={{ marginTop: "1.5rem", background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", border: "none", padding: "12px 28px", color: "#0A0A0A", cursor: "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.08em" }}>
                SAVE CHANGES
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:800px){.profile-layout{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
