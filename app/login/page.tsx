"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/lib/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login, continueWithGoogle, isConfigured } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });
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
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          return "The email or password you entered is incorrect.";
        case "auth/too-many-requests":
          return "Too many attempts. Please wait a moment and try again.";
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
      await login(form.email, form.password);
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
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img
              src="/Images/Logo.png"
              alt="Devang Organics"
              style={{ height: "88px", width: "auto", margin: "0 auto", objectFit: "contain" }}
            />
          </Link>
          <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", color: "#F5F0E8", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Welcome Back</h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Sign in to your account</p>
        </div>

        <div style={{ background: "#161616", border: "1px solid #2A2A2A", padding: "2.5rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  required
                  style={{ width: "100%", padding: "12px 16px 12px 44px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", color: "#C8C0B0", fontSize: "0.8rem", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                <input type={show ? "text" : "password"} placeholder="Your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  required
                  style={{ width: "100%", padding: "12px 44px 12px 44px", background: "#0A0A0A", border: "1px solid #2A2A2A", color: "#F5F0E8", fontSize: "0.875rem" }} />
                <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer" }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#C8C0B0", fontSize: "0.8rem", cursor: "pointer" }}>
                <input type="checkbox" checked={form.remember} onChange={e => setForm({...form, remember: e.target.checked})} style={{ accentColor: "#C9A84C" }} />
                Remember me
              </label>
              <Link href="#" style={{ color: "#C9A84C", fontSize: "0.8rem", textDecoration: "none" }}>Forgot password?</Link>
            </div>
            {error ? <p style={{ color: "#E58B8B", fontSize: "0.8rem", margin: 0 }}>{error}</p> : null}
            <p style={{ color: "#C9A84C", fontSize: "0.8rem", margin: 0, minHeight: "1.2rem", visibility: hasMounted && !isConfigured ? "visible" : "hidden" }}>
              Add your Firebase environment variables to enable sign-in.
            </p>
            <button type="submit" disabled={submitting || !canUseFirebase} style={{ display: "block", width: "100%", background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #9A7A2E 100%)", border: "none", padding: "14px", color: "#0A0A0A", cursor: submitting || !canUseFirebase ? "not-allowed" : "pointer", fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", opacity: submitting || !canUseFirebase ? 0.7 : 1 }}>
              {submitting ? "SIGNING IN..." : "SIGN IN"}
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
          Don't have an account?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(nextPath)}`}
            style={{ color: "#C9A84C", textDecoration: "none" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C" }}>
          Loading sign in...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
