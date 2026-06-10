"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Package, Heart, MapPin, LogOut, Star } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { products } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";

const tabs = [
  { key: "overview", label: "Overview", Icon: User },
  { key: "orders", label: "My Orders", Icon: Package },
  { key: "wishlist", label: "Wishlist", Icon: Heart },
  { key: "addresses", label: "Addresses", Icon: MapPin },
];

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("overview");
  const { wishlist } = useStore();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && tabs.some(({ key }) => key === currentTab)) {
      setTab(currentTab);
    }
  }, [searchParams]);

  const initials = (user?.displayName || user?.email || "Guest User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const displayName = user?.displayName || "Customer";
  const displayEmail = user?.email || "";

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ProtectedRoute>
      <div
        style={{
          padding: "3rem 5%",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "2rem",
        }}
        className="profile-layout"
      >
        <aside>
          <div
            style={{
              background: "#161616",
              border: "1px solid #2A2A2A",
              padding: "1.5rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontFamily: "Cinzel, serif",
                fontWeight: 700,
                color: "#0A0A0A",
              }}
            >
              {initials || "CU"}
            </div>
            <h3
              style={{
                fontFamily: "Cinzel, serif",
                color: "#F5F0E8",
                marginBottom: "4px",
              }}
            >
              {displayName}
            </h3>
            <p style={{ color: "#666", fontSize: "0.8rem" }}>{displayEmail}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #2A2A2A",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "#C9A84C",
                    fontFamily: "Cinzel, serif",
                    fontSize: "1.1rem",
                  }}
                >
                  0
                </p>
                <p style={{ color: "#666", fontSize: "0.7rem" }}>Orders</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "#C9A84C",
                    fontFamily: "Cinzel, serif",
                    fontSize: "1.1rem",
                  }}
                >
                  {wishlist.length}
                </p>
                <p style={{ color: "#666", fontSize: "0.7rem" }}>Wishlist</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#161616", border: "1px solid #2A2A2A" }}>
            {tabs.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "14px 20px",
                  background: "none",
                  border: "none",
                  borderLeft:
                    tab === key ? "2px solid #C9A84C" : "2px solid transparent",
                  cursor: "pointer",
                  color: tab === key ? "#C9A84C" : "#C8C0B0",
                  fontFamily: "Raleway, sans-serif",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
            <button
              onClick={handleSignOut}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "14px 20px",
                background: "none",
                border: "none",
                borderTop: "1px solid #2A2A2A",
                cursor: "pointer",
                color: "#666",
                fontFamily: "Raleway, sans-serif",
                fontSize: "0.875rem",
              }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        <div>
          {tab === "overview" && (
            <div>
              <h2
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "#C9A84C",
                  marginBottom: "1.5rem",
                  fontSize: "1.2rem",
                  letterSpacing: "0.05em",
                }}
              >
                ACCOUNT OVERVIEW
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                {[
                  ["0", "Total Orders", Package],
                  ["Rs0", "Total Spent", Star],
                  [wishlist.length.toString(), "Wishlist Items", Heart],
                ].map(([val, label, Icon]: any) => (
                  <div
                    key={label}
                    style={{
                      background: "#161616",
                      border: "1px solid #2A2A2A",
                      padding: "1.5rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <Icon size={24} style={{ color: "#C9A84C" }} />
                    <div>
                      <p
                        style={{
                          fontFamily: "Cinzel, serif",
                          fontSize: "1.5rem",
                          color: "#C9A84C",
                        }}
                      >
                        {val}
                      </p>
                      <p style={{ color: "#666", fontSize: "0.75rem" }}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <h2
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "#C9A84C",
                  marginBottom: "1.5rem",
                  fontSize: "1.2rem",
                }}
              >
                MY WISHLIST
              </h2>
              {wishlistProducts.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem",
                    background: "#161616",
                    border: "1px solid #2A2A2A",
                  }}
                >
                  <Heart size={48} style={{ color: "#2A2A2A", margin: "0 auto 1rem" }} />
                  <p style={{ color: "#666" }}>Your wishlist is empty</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1.25rem",
                  }}
                >
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <h2
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "#C9A84C",
                  marginBottom: "1.5rem",
                  fontSize: "1.2rem",
                }}
              >
                ADDRESS
              </h2>
            </div>
          )}
        </div>
        <style>{`@media(max-width:800px){.profile-layout{grid-template-columns:1fr!important;}}`}</style>
      </div>
    </ProtectedRoute>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#C9A84C",
          }}
        >
          Loading profile...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
