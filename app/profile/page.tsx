"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, LogOut, MapPin, Package, Star, User } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ApiRequestError, apiRequest, createAuthHeaders } from "@/lib/client-api";
import type { OrderRecord } from "@/lib/api-types";
import { useAuth } from "@/lib/auth";
import { getOrdersForUserClient } from "@/lib/orders-client";
import { useProducts } from "@/lib/products";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";

const tabs = [
  { key: "overview", label: "Overview", Icon: User },
  { key: "orders", label: "My Orders", Icon: Package },
  { key: "wishlist", label: "Wishlist", Icon: Heart },
  { key: "addresses", label: "Addresses", Icon: MapPin },
];

function isServiceUnavailableError(error: unknown) {
  return error instanceof ApiRequestError && error.status === 503;
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userProfile, logout, loading, roleLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { wishlist, wishlistLoading } = useStore();
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const wishlistProducts = products.filter((product) => wishlist.includes(product.id));
  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + order.totalAmount, 0),
    [orders]
  );

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && tabs.some(({ key }) => key === currentTab)) {
      setTab(currentTab);
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const headers = await createAuthHeaders(user);
        const response = await apiRequest<{ orders: OrderRecord[] }>("/api/orders", {
          headers,
        });

        if (!cancelled) {
          setOrders(response.orders);
        }
      } catch (error) {
        if (isServiceUnavailableError(error)) {
          try {
            const fallbackOrders = await getOrdersForUserClient(user.uid);
            if (!cancelled) {
              setOrders(fallbackOrders);
            }
            return;
          } catch (fallbackError) {
            if (!cancelled) {
              setOrdersError(
                fallbackError instanceof Error
                  ? fallbackError.message
                  : "Failed to load orders."
              );
            }
            return;
          }
        }

        if (!cancelled) {
          setOrdersError(
            error instanceof Error ? error.message : "Failed to load orders."
          );
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const initials = (
    userProfile?.name ||
    user?.displayName ||
    userProfile?.email ||
    user?.email ||
    "Guest User"
  )
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const displayName = userProfile?.name || user?.displayName || "Customer";
  const displayEmail = userProfile?.email || user?.email || "";
  const displayPhoto = userProfile?.photoURL || user?.photoURL || "";
  const displayRole = userProfile?.role || "customer";

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading || roleLoading) {
    return (
      <ProtectedRoute>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#C9A84C",
          }}
        >
          Loading your profile...
        </div>
      </ProtectedRoute>
    );
  }

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
                background: displayPhoto
                  ? "#0A0A0A"
                  : "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontFamily: "Cinzel, serif",
                fontWeight: 700,
                color: "#0A0A0A",
                overflow: "hidden",
              }}
            >
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  alt={displayName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                initials || "CU"
              )}
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
            <p
              style={{
                color: "#C9A84C",
                fontSize: "0.72rem",
                marginTop: "0.4rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {displayRole}
            </p>
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
                  {orders.length}
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
                  [orders.length.toString(), "Total Orders", Package],
                  [`Rs${totalSpent}`, "Total Spent", Star],
                  [wishlist.length.toString(), "Wishlist Items", Heart],
                ].map(([value, label, Icon]: any) => (
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
                        {value}
                      </p>
                      <p style={{ color: "#666", fontSize: "0.75rem" }}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "#C9A84C",
                  marginBottom: "1.5rem",
                  fontSize: "1.2rem",
                }}
              >
                MY ORDERS
              </h2>
              {ordersLoading ? (
                <div
                  style={{
                    background: "#161616",
                    border: "1px solid #2A2A2A",
                    padding: "2rem",
                    color: "#C9A84C",
                  }}
                >
                  Loading your orders...
                </div>
              ) : ordersError ? (
                <div
                  style={{
                    background: "#161616",
                    border: "1px solid rgba(229,139,139,0.3)",
                    padding: "2rem",
                    color: "#E58B8B",
                  }}
                >
                  {ordersError}
                </div>
              ) : orders.length === 0 ? (
                <div
                  style={{
                    background: "#161616",
                    border: "1px solid #2A2A2A",
                    padding: "2rem",
                    color: "#666",
                  }}
                >
                  You have not placed any orders yet.
                </div>
              ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        background: "#161616",
                        border: "1px solid #2A2A2A",
                        padding: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "1rem",
                          flexWrap: "wrap",
                          marginBottom: "1rem",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              color: "#666",
                              fontSize: "0.72rem",
                              letterSpacing: "0.08em",
                            }}
                          >
                            ORDER ID
                          </p>
                          <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif" }}>
                            {order.id}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              color: "#666",
                              fontSize: "0.72rem",
                              letterSpacing: "0.08em",
                            }}
                          >
                            STATUS
                          </p>
                          <p style={{ color: "#F5F0E8" }}>{order.orderStatus}</p>
                        </div>
                        <div>
                          <p
                            style={{
                              color: "#666",
                              fontSize: "0.72rem",
                              letterSpacing: "0.08em",
                            }}
                          >
                            PAYMENT
                          </p>
                          <p style={{ color: "#F5F0E8" }}>{order.paymentStatus}</p>
                        </div>
                        <div>
                          <p
                            style={{
                              color: "#666",
                              fontSize: "0.72rem",
                              letterSpacing: "0.08em",
                            }}
                          >
                            TOTAL
                          </p>
                          <p style={{ color: "#C9A84C", fontFamily: "Cinzel, serif" }}>
                            Rs{order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "grid", gap: "0.75rem" }}>
                        {order.products.map((product) => (
                          <div
                            key={`${order.id}-${product.id}`}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              color: "#C8C0B0",
                              fontSize: "0.85rem",
                            }}
                          >
                            <span>
                              {product.name} x {product.quantity}
                            </span>
                            <span>
                              Rs{(product.price * product.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {productsLoading || wishlistLoading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem",
                    background: "#161616",
                    border: "1px solid #2A2A2A",
                    color: "#C9A84C",
                  }}
                >
                  Loading wishlist products...
                </div>
              ) : wishlistProducts.length === 0 ? (
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
                  {wishlistProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
              <div
                style={{
                  background: "#161616",
                  border: "1px solid #2A2A2A",
                  padding: "2rem",
                  color: "#666",
                }}
              >
                Your saved addresses will appear here when you add address management.
              </div>
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
