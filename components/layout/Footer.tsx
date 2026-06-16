"use client";

import { useState } from "react";
import Link from "next/link";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Radio,
  Send,
  Share2,
} from "lucide-react";
import { ApiRequestError, apiRequest } from "@/lib/client-api";
import { db } from "@/lib/firebase";
import { useProducts } from "@/lib/products";

const quickLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Products", "/products"],
  ["Contact", "/contact"],
  ["My Account", "/profile"],
  ["FAQ", "/faq"],
] as const;

const footerPolicyLinks = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms of Service", "/terms-of-service"],
  ["Cookie Policy", "/cookie-policy"],
  ["FAQ", "/faq"],
  ["Shipping Policy", "/shipping-policy"],
  ["Returns & Exchanges", "/returns-and-exchanges"],
] as const;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase());
}

function isFirebaseAdminUnavailable(error: unknown) {
  return error instanceof ApiRequestError && error.status === 503;
}

export default function Footer() {
  const { publicCategories } = useProducts();
  const socialIcons = [Share2, MessageCircle, Send, Radio];
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusColor, setStatusColor] = useState("#666");
  const [statusTone, setStatusTone] = useState<"success" | "error" | "info">(
    "info"
  );

  const handleNewsletterSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setStatusMessage("Please enter your email address.");
      setStatusColor("#E58B8B");
      setStatusTone("error");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setStatusMessage("Please enter a valid email address.");
      setStatusColor("#E58B8B");
      setStatusTone("error");
      return;
    }

    setSubmitting(true);
    setStatusMessage("");

    try {
      let response: {
        message: string;
        duplicate?: boolean;
      };

      try {
        response = await apiRequest<{
          message: string;
          duplicate?: boolean;
        }>("/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        });
      } catch (error) {
        if (!isFirebaseAdminUnavailable(error) || !db) {
          throw error;
        }

        const subscriberId = normalizedEmail.replace(/[^a-z0-9]+/g, "_");
        const subscriberRef = doc(db, "newsletterSubscribers", subscriberId);
        const snapshot = await getDoc(subscriberRef);

        if (snapshot.exists()) {
          response = {
            message: "This email is already subscribed.",
            duplicate: true,
          };
        } else {
          await setDoc(subscriberRef, {
            email: normalizedEmail,
            createdAt: serverTimestamp(),
          });

          response = {
            message: "Subscribed successfully.",
            duplicate: false,
          };
        }
      }

      setStatusMessage(response.message);
      setStatusColor(response.duplicate ? "#C9A84C" : "#7ED6A7");
      setStatusTone(response.duplicate ? "info" : "success");

      if (!response.duplicate) {
        setEmail("");
      }
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Subscription failed."
      );
      setStatusColor("#E58B8B");
      setStatusTone("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      style={{ background: "#0D0D0D", borderTop: "1px solid #2A2A2A", marginTop: "auto" }}
    >
      <div
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
        }}
      />

      <div
        style={{
          padding: "4rem 5% 2rem",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
          gap: "3rem",
        }}
        className="footer-grid"
      >
        <div>
          <img
            src="/Images/Logo.png"
            alt="Devang Organics"
            style={{ height: "78px", width: "auto", objectFit: "contain", marginBottom: "1rem" }}
          />
          <p
            style={{
              color: "#C8C0B0",
              fontSize: "0.875rem",
              lineHeight: 1.8,
              marginBottom: "1.5rem",
              maxWidth: "280px",
            }}
          >
            Bringing nature&apos;s finest organic products to your doorstep. Rooted in
            Ayurveda, crafted with love, delivered with trust.
          </p>
          <div style={{ display: "none" }}>
            {socialIcons.map((Icon, index) => (
              <span key={index}>
                <Icon size={16} />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.9rem",
              color: "#C9A84C",
              marginBottom: "1.5rem",
              letterSpacing: "0.1em",
            }}
          >
            QUICK LINKS
          </h4>
          {quickLinks.map(([label, href]) => (
            <div key={href} style={{ marginBottom: "0.75rem" }}>
              <Link
                href={href}
                style={{
                  color: "#C8C0B0",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(event) => (event.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={(event) => (event.currentTarget.style.color = "#C8C0B0")}
              >
                {label}
              </Link>
            </div>
          ))}
        </div>

        <div>
          <h4
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.9rem",
              color: "#C9A84C",
              marginBottom: "1.5rem",
              letterSpacing: "0.1em",
            }}
          >
            CATEGORIES
          </h4>
          {publicCategories.slice(0, 6).map((category) => (
            <div key={category.slug} style={{ marginBottom: "0.75rem" }}>
              <Link
                href={`/products?category=${category.slug}`}
                style={{
                  color: "#C8C0B0",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(event) => (event.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={(event) => (event.currentTarget.style.color = "#C8C0B0")}
              >
                {category.name}
              </Link>
            </div>
          ))}
        </div>

        <div>
          <h4
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.9rem",
              color: "#C9A84C",
              marginBottom: "1.5rem",
              letterSpacing: "0.1em",
            }}
          >
            CONTACT US
          </h4>
          {[
            { Icon: MapPin, text: "Virar (West), Maharashtra, India" },
            { Icon: Phone, text: "+91 91208 79879" },
            { Icon: Mail, text: "ptcvirar@gmail.com" },
          ].map(({ Icon, text }, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "1rem",
                alignItems: "flex-start",
              }}
            >
              <Icon
                size={16}
                style={{ color: "#C9A84C", flexShrink: 0, marginTop: "3px" }}
              />
              <span
                style={{
                  color: "#C8C0B0",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                }}
              >
                {text}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#161616",
              border: "1px solid #2A2A2A",
            }}
          >
            <p
              style={{
                color: "#C9A84C",
                fontSize: "0.75rem",
                fontFamily: "Cinzel, serif",
                letterSpacing: "0.08em",
                marginBottom: "8px",
              }}
            >
              NEWSLETTER
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleNewsletterSubmit();
              }}
              style={{ display: "flex", gap: "8px" }}
            >
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                type="email"
                aria-label="Email address"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: "#0A0A0A",
                  border: "1px solid #2A2A2A",
                  color: "#F5F0E8",
                  fontSize: "0.8rem",
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  border: "none",
                  padding: "8px 14px",
                  color: "#0A0A0A",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "..." : "GO"}
              </button>
            </form>
            {statusMessage ? (
              <p
                style={{
                  color: statusColor,
                  fontSize: "0.75rem",
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {statusTone === "error" ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
                {statusMessage}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, #2A2A2A, transparent)",
          margin: "0 5%",
        }}
      />
      <div
        style={{
          padding: "1.5rem 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p style={{ color: "#666", fontSize: "0.8rem" }}>
          © 2026 Devang Organics | Powered by PTCGRAM Private Limited.
        </p>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {footerPolicyLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{
                color: "#666",
                fontSize: "0.8rem",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(event) => (event.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={(event) => (event.currentTarget.style.color = "#666")}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important;}} @media(max-width:600px){.footer-grid{grid-template-columns:1fr!important;}}`}</style>
    </footer>
  );
}
