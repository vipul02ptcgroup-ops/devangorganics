"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, register, continueWithGoogle, isConfigured } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const nextPath = searchParams.get("next") || "/profile";
  const canUseFirebase = hasMounted && isConfigured;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextPath);
    }
  }, [loading, nextPath, router, user]);

  const getErrorMessage = (error: unknown) => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          return "An account with this email already exists.";
        case "auth/invalid-email":
          return "Please enter a valid email address.";
        case "auth/weak-password":
          return "Use a stronger password with at least 6 characters.";
        case "auth/popup-closed-by-user":
          return "The Google sign-in popup was closed before completing.";
        default:
          return error.message;
      }
    }

    return error instanceof Error ? error.message : "Something went wrong.";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(form.name, form.email, form.password);
      router.replace(nextPath);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSubmitting(true);

    try {
      await continueWithGoogle();
      router.replace(nextPath);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 5%", background: "linear-gradient(135deg, #0A0A0A, #111111)" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "Cinzel, serif", fontSize: "2rem", fontWeight: 700, background: "linear-gradient(135deg, #C9A84C, #E8C96A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DEVANG</span>
            <div style={{ fontFamily: "Raleway, sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", color: "#C9A84C" }}>ORGANICS</div>
          </Link>
          <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", color: "#F5F0E8", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Create Account</h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Join the Devang Organics family</p>
        </div>

        <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2.5rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              { field: "name", label: "Full Name", placeholder: "Your full name", Icon: User, type: "text" },
              { field: "email", label: "Email Address", placeholder: "you@example.com", Icon: Mail, type: "email" },
              { field: "phone", label: "Phone Number", placeholder: "+91 91208 79879", Icon: Phone, type: "tel" },
            ].map(({ field, label, placeholder, Icon, type }) => (
              <div key={field}>
                <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>{label}</label>
                <div style={{ position: "relative" }}>
                  <Icon size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                  <input type={type} placeholder={placeholder} value={form[field as keyof typeof form]} onChange={e => setForm({...form, [field]: e.target.value})}
                    required={field !== "phone"}
                    style={{ width: "100%", padding: "12px 16px 12px 44px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
                </div>
              </div>
            ))}
            <div>
              <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                <input type={show ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  required
                  minLength={6}
                  style={{ width: "100%", padding: "12px 44px 12px 44px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
                <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer" }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#C8C0B0", fontSize: "0.8rem", cursor: "pointer" }}>
              <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} required style={{ accentColor: "#C9A84C", marginTop: "2px", flexShrink: 0 }} />
              I agree to the <Link href="#" style={{ color: "#C9A84C" }}>Terms of Service</Link> and <Link href="#" style={{ color: "#C9A84C" }}>Privacy Policy</Link>
            </label>
            {error ? <p style={{ color: "#E58B8B", fontSize: "0.8rem", margin: 0 }}>{error}</p> : null}
            <p style={{ color: "#C9A84C", fontSize: "0.8rem", margin: 0, minHeight: "1.2rem", visibility: hasMounted && !isConfigured ? "visible" : "hidden" }}>
              Add your Firebase environment variables to enable registration.
            </p>
            <button type="submit" disabled={submitting || !acceptedTerms || !canUseFirebase} style={{ display: "block", background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", border: "none", padding: "14px", color: "#0A0A0A", cursor: submitting || !acceptedTerms || !canUseFirebase ? "not-allowed" : "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", textAlign: "center", opacity: submitting || !acceptedTerms || !canUseFirebase ? 0.7 : 1 }}>
              {submitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", background: "#2A2A2A" }} />
            <span style={{ color: "#666", fontSize: "0.8rem" }}>or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "#2A2A2A" }} />
          </div>

          <button type="button" onClick={handleGoogle} disabled={submitting || !canUseFirebase} style={{ width: "100%", background: "#0A0A0A", border: "1px solid #2A2A2A", padding: "12px", color: "#C8C0B0", cursor: submitting || !canUseFirebase ? "not-allowed" : "pointer", fontFamily: "Raleway, sans-serif", fontSize: "0.85rem", transition: "border-color 0.2s", opacity: submitting || !canUseFirebase ? 0.7 : 1 }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A84C")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#2A2A2A")}>
            Continue with Google
          </button>
        </div>

        <p style={{ textAlign: "center", color: "#666", fontSize: "0.875rem", marginTop: "1.5rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#C9A84C", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
