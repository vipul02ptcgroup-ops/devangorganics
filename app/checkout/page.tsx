"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  Building,
  ChevronRight,
  CreditCard,
  Lock,
  Smartphone,
} from "lucide-react";
import { ApiRequestError, apiRequest, createAuthHeaders } from "@/lib/client-api";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { resolveProductImageSrc } from "@/lib/product-images";
import { useStore } from "@/lib/store";

type PaymentMethod = "card" | "upi" | "netbanking" | "cod";

function isServiceUnavailableError(error: unknown) {
  return error instanceof ApiRequestError && error.status === 503;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { cart, cartTotal, clearCart } = useStore();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    firstName: userProfile?.name?.split(" ")[0] || "",
    lastName: userProfile?.name?.split(" ").slice(1).join(" ") || "",
    email: userProfile?.email || user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Gujarat",
    pinCode: "",
    country: "India",
  });
  const shipping = cartTotal >= 499 ? 0 : 49;
  const totalAmount = cartTotal + shipping;

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "#0A0A0A",
    border: "1px solid #2A2A2A",
    color: "#F5F0E8",
    fontSize: "0.875rem",
    fontFamily: "Raleway, sans-serif",
  };
  const labelStyle = {
    display: "block" as const,
    color: "#C8C0B0",
    fontSize: "0.8rem",
    marginBottom: "6px",
    fontFamily: "Raleway, sans-serif",
  };

  const isAddressValid = useMemo(
    () =>
      [
        form.firstName,
        form.email,
        form.phone,
        form.addressLine1,
        form.city,
        form.state,
        form.pinCode,
        form.country,
      ].every((value) => value.trim().length > 0),
    [form]
  );

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const buildOrderPayload = () => ({
    customerName: `${form.firstName} ${form.lastName}`.trim(),
    email: form.email,
    phone: form.phone,
    address: [
      form.addressLine1,
      form.addressLine2,
      `${form.city}, ${form.state} ${form.pinCode}`,
      form.country,
    ]
      .filter(Boolean)
      .join(", "),
    products: cart.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image ? resolveProductImageSrc(item.image, item.name) : "",
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount,
    paymentStatus: "pending" as const,
    orderStatus: "placed" as const,
    orderType: payMethod,
  });

  const submitOrder = async () => {
    if (!user) {
      setSubmitError("Please sign in before placing an order.");
      return;
    }

    if (cart.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const orderPayload = buildOrderPayload();
      const headers = {
        "Content-Type": "application/json",
        ...(await createAuthHeaders(user)),
      };

      const response = await apiRequest<{ orderId: string }>("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(orderPayload),
      });

      clearCart();
      router.push(`/order-success?orderId=${encodeURIComponent(response.orderId)}`);
    } catch (error) {
      if (isServiceUnavailableError(error) && db) {
        try {
          const orderRef = await addDoc(collection(db, "orders"), {
            ...buildOrderPayload(),
            userId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          clearCart();
          router.push(`/order-success?orderId=${encodeURIComponent(orderRef.id)}`);
          return;
        } catch (fallbackError) {
          setSubmitError(
            fallbackError instanceof Error
              ? fallbackError.message
              : "Failed to place order."
          );
          return;
        }
      }

      setSubmitError(
        error instanceof Error ? error.message : "Failed to place order."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "3rem 5%" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "2rem",
            color: "#F5F0E8",
          }}
        >
          Checkout
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1.5rem",
          }}
        >
          {[["1", "Address"], ["2", "Payment"], ["3", "Review"]].map(
            ([n, label], index) => (
              <div
                key={n}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background:
                      step >= Number(n)
                        ? "linear-gradient(135deg, #C9A84C, #9A7A2E)"
                        : "#161616",
                    border:
                      step >= Number(n) ? "none" : "1px solid #2A2A2A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: step >= Number(n) ? "#0A0A0A" : "#666",
                  }}
                >
                  {n}
                </div>
                <span
                  style={{
                    color: step >= Number(n) ? "#C9A84C" : "#666",
                    fontSize: "0.8rem",
                    fontFamily: "Raleway, sans-serif",
                  }}
                >
                  {label}
                </span>
                {index < 2 && <ChevronRight size={16} style={{ color: "#2A2A2A" }} />}
              </div>
            )
          )}
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem" }}
        className="checkout-grid"
      >
        <div>
          {step === 1 && (
            <div
              style={{
                background: "#161616",
                border: "1px solid #2A2A2A",
                padding: "2rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "#C9A84C",
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  marginBottom: "1.5rem",
                }}
              >
                DELIVERY ADDRESS
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input
                    value={form.firstName}
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                    style={inputStyle}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={(event) =>
                      updateField("lastName", event.target.value)
                    }
                    style={inputStyle}
                    placeholder="Last name"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    type="email"
                    style={inputStyle}
                    placeholder="Email address"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    style={inputStyle}
                    placeholder="+91 91208 79879"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Address Line 1</label>
                  <input
                    value={form.addressLine1}
                    onChange={(event) =>
                      updateField("addressLine1", event.target.value)
                    }
                    style={inputStyle}
                    placeholder="Street address, flat no."
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Address Line 2</label>
                  <input
                    value={form.addressLine2}
                    onChange={(event) =>
                      updateField("addressLine2", event.target.value)
                    }
                    style={inputStyle}
                    placeholder="Landmark (optional)"
                  />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    style={inputStyle}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <select
                    value={form.state}
                    onChange={(event) => updateField("state", event.target.value)}
                    style={inputStyle}
                  >
                    <option>Gujarat</option>
                    <option>Maharashtra</option>
                    <option>Rajasthan</option>
                    <option>Delhi</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>PIN Code</label>
                  <input
                    value={form.pinCode}
                    onChange={(event) =>
                      updateField("pinCode", event.target.value)
                    }
                    style={inputStyle}
                    placeholder="380001"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <input value={form.country} style={inputStyle} readOnly />
                </div>
              </div>
              <button
                disabled={!isAddressValid}
                onClick={() => setStep(2)}
                style={{
                  marginTop: "1.5rem",
                  background:
                    "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)",
                  border: "none",
                  padding: "14px 32px",
                  color: "#0A0A0A",
                  cursor: !isAddressValid ? "not-allowed" : "pointer",
                  fontFamily: "Cinzel, serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  opacity: !isAddressValid ? 0.65 : 1,
                }}
              >
                CONTINUE TO PAYMENT
              </button>
            </div>
          )}

          {step === 2 && (
            <div
              style={{
                background: "#161616",
                border: "1px solid #2A2A2A",
                padding: "2rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "#C9A84C",
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  marginBottom: "1.5rem",
                }}
              >
                PAYMENT METHOD
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                {[
                  { key: "card", Icon: CreditCard, label: "Credit / Debit Card" },
                  {
                    key: "upi",
                    Icon: Smartphone,
                    label: "UPI / Google Pay / PhonePe",
                  },
                  { key: "netbanking", Icon: Building, label: "Net Banking" },
                  { key: "cod", Icon: Lock, label: "Cash on Delivery" },
                ].map(({ key, Icon, label }) => (
                  <div
                    key={key}
                    onClick={() => setPayMethod(key as PaymentMethod)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem 1.25rem",
                      border:
                        payMethod === key
                          ? "1px solid #C9A84C"
                          : "1px solid #2A2A2A",
                      cursor: "pointer",
                      background:
                        payMethod === key
                          ? "rgba(201,168,76,0.05)"
                          : "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border:
                          payMethod === key
                            ? "5px solid #C9A84C"
                            : "2px solid #666",
                        flexShrink: 0,
                      }}
                    />
                    <Icon
                      size={18}
                      style={{ color: payMethod === key ? "#C9A84C" : "#666" }}
                    />
                    <span
                      style={{
                        color: payMethod === key ? "#F5F0E8" : "#C8C0B0",
                        fontFamily: "Raleway, sans-serif",
                        fontSize: "0.875rem",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              {payMethod === "card" && (
                <div
                  style={{
                    display: "grid",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Card Number</label>
                    <input style={inputStyle} placeholder="1234 5678 9012 3456" />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Expiry Date</label>
                      <input style={inputStyle} placeholder="MM / YY" />
                    </div>
                    <div>
                      <label style={labelStyle}>CVV</label>
                      <input
                        type="password"
                        style={inputStyle}
                        placeholder="***"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Name on Card</label>
                    <input style={inputStyle} placeholder="As printed on card" />
                  </div>
                </div>
              )}
              {payMethod === "upi" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>UPI ID</label>
                  <input style={inputStyle} placeholder="yourname@upi" />
                </div>
              )}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: "transparent",
                    border: "1px solid #2A2A2A",
                    padding: "12px 24px",
                    color: "#C8C0B0",
                    cursor: "pointer",
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.8rem",
                  }}
                >
                  BACK
                </button>
                <button
                  onClick={() => setStep(3)}
                  style={{
                    background:
                      "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)",
                    border: "none",
                    padding: "12px 32px",
                    color: "#0A0A0A",
                    cursor: "pointer",
                    fontFamily: "Cinzel, serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  REVIEW ORDER
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div
              style={{
                background: "#161616",
                border: "1px solid #2A2A2A",
                padding: "2rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "#C9A84C",
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  marginBottom: "1.5rem",
                }}
              >
                ORDER REVIEW
              </h2>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #1A1A1A",
                  }}
                >
                  <span style={{ color: "#C8C0B0", fontSize: "0.875rem" }}>
                    {item.name} x {item.quantity}
                  </span>
                  <span style={{ color: "#C9A84C", fontFamily: "Cinzel, serif" }}>
                    Rs{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              {submitError ? (
                <p
                  style={{
                    color: "#E58B8B",
                    fontSize: "0.8rem",
                    marginTop: "1rem",
                  }}
                >
                  {submitError}
                </p>
              ) : null}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    background: "transparent",
                    border: "1px solid #2A2A2A",
                    padding: "12px 24px",
                    color: "#C8C0B0",
                    cursor: "pointer",
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.8rem",
                  }}
                >
                  BACK
                </button>
                <button
                  onClick={() => void submitOrder()}
                  disabled={submitting || cart.length === 0}
                  style={{
                    background:
                      "linear-gradient(135deg, #C9A84C, #E8C96A, #9A7A2E)",
                    border: "none",
                    padding: "12px 32px",
                    color: "#0A0A0A",
                    fontFamily: "Cinzel, serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor:
                      submitting || cart.length === 0 ? "not-allowed" : "pointer",
                    opacity: submitting || cart.length === 0 ? 0.7 : 1,
                  }}
                >
                  <Lock size={16} />
                  {submitting ? "PLACING ORDER..." : "PLACE ORDER"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            background: "#161616",
            border: "1px solid #2A2A2A",
            padding: "1.5rem",
            alignSelf: "start",
          }}
        >
          <h3
            style={{
              fontFamily: "Cinzel, serif",
              color: "#C9A84C",
              fontSize: "0.9rem",
              letterSpacing: "0.1em",
              marginBottom: "1.5rem",
            }}
          >
            ORDER SUMMARY
          </h3>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
              }}
            >
              <span style={{ color: "#C8C0B0", fontSize: "0.8rem" }}>
                {item.name} x {item.quantity}
              </span>
              <span
                style={{
                  color: "#C9A84C",
                  fontSize: "0.8rem",
                  fontFamily: "Cinzel, serif",
                }}
              >
                Rs{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div style={{ height: "1px", background: "#2A2A2A", margin: "1rem 0" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "#C8C0B0", fontSize: "0.875rem" }}>Subtotal</span>
            <span style={{ color: "#C9A84C", fontFamily: "Cinzel, serif" }}>
              Rs{cartTotal.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <span style={{ color: "#C8C0B0", fontSize: "0.875rem" }}>Shipping</span>
            <span
              style={{
                color: shipping === 0 ? "#4CAF50" : "#C9A84C",
                fontFamily: "Cinzel, serif",
              }}
            >
              {shipping === 0 ? "FREE" : `Rs${shipping}`}
            </span>
          </div>
          <div
            style={{ height: "1px", background: "#2A2A2A", margin: "0 0 1rem" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                color: "#F5F0E8",
                fontFamily: "Cinzel, serif",
                fontSize: "1rem",
              }}
            >
              Total
            </span>
            <span
              style={{
                color: "#C9A84C",
                fontFamily: "Cinzel, serif",
                fontSize: "1.25rem",
              }}
            >
              Rs{totalAmount.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px",
              background: "rgba(201,168,76,0.05)",
              border: "1px solid #C9A84C22",
            }}
          >
            <Lock size={14} style={{ color: "#C9A84C", flexShrink: 0 }} />
            <p style={{ color: "#666", fontSize: "0.75rem" }}>
              Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.checkout-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
