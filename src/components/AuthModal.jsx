import React, { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { cleanText, safeAuthMessage, validEmail } from "../lib/security";

const authRedirectUrl = `${window.location.origin}/?view=profile`;
export default function AuthModal({ close, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);

  const google = async () => {
    if (!isSupabaseConfigured) return setMessage("Account services are not configured yet.");
    setBusy(true);
    setMessage("");
    try {
      const { data, error } = await Promise.race([
        supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: authRedirectUrl,
            skipBrowserRedirect: true,
            queryParams: { prompt: "select_account" },
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("oauth_timeout")), 15000)),
      ]);
      if (error || !data?.url) throw error || new Error("missing_oauth_url");
      const destination = new URL(data.url);
      const expected = new URL(import.meta.env.VITE_SUPABASE_URL);
      if (destination.protocol !== "https:" || destination.origin !== expected.origin) throw new Error("invalid_oauth_origin");
      window.location.assign(destination.href);
    } catch (reason) {
      console.warn("[Sakinah Auth] Google request failed", { code: reason?.code || "oauth_error" });
      setBusy(false);
      setMessage("Google sign-in could not start. Please try again.");
    }
  };

  const run = async (event) => {
    event.preventDefault();
    if (!isSupabaseConfigured) return setMessage("Account services are not configured yet.");
    setBusy(true);
    setMessage("");
    const normalizedEmail = validEmail(email);
    const normalizedName = cleanText(name, 80);
    if (!normalizedEmail || password.length > 128 || (mode === "signup" && (!normalizedName || password.length < 8))) {
      setBusy(false);
      setMessage("Please enter valid account details.");
      return;
    }
    try {
      let result;
      if (mode === "signup") {
        result = await supabase.auth.signUp({ email: normalizedEmail, password, options: { data: { name: normalizedName }, emailRedirectTo: authRedirectUrl } });
      } else if (mode === "reset") {
        result = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo: authRedirectUrl });
      } else {
        result = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      }
      if (result.error) throw result.error;
      if (mode === "reset") setMessage(safeAuthMessage("reset"));
      else if (mode === "signup" && !result.data?.session) setMessage("Account created. Check your inbox for the confirmation link.");
      else close();
    } catch (reason) {
      console.warn("[Sakinah Auth] request failed", { mode, code: reason?.code || "auth_error" });
      setMessage(safeAuthMessage(mode));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button type="button" className="modal-close" onClick={close} aria-label="Close account dialog"><X /></button>
        <img src="/icons/icon-192.png" alt="Sakinah" />
        <span>WELCOME TO SAKINAH</span>
        <h2 id="auth-title">{mode === "signup" ? "Create your account" : mode === "reset" ? "Reset your password" : "Peace begins here."}</h2>
        <p>{mode === "login" ? "Sign in to sync your worship journey across devices." : "Your private spiritual companion."}</p>
        <form onSubmit={run}>
          {mode === "signup" && <label><User /><input required maxLength="80" autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} /></label>}
          <label><Mail /><input required type="email" maxLength="254" autoComplete="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          {mode !== "reset" && <label><Lock /><input required minLength="8" maxLength="128" autoComplete={mode === "signup" ? "new-password" : "current-password"} type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} /></label>}
          <button className="auth-primary" disabled={busy}>{busy ? "Please wait..." : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"}</button>
        </form>
        {mode === "login" && <><button type="button" className="google-oauth-button" onClick={google} disabled={busy}><span className="google-mark">G</span>Continue with Google</button><button type="button" className="text-btn" onClick={() => setMode("reset")}>Forgot password?</button></>}
        {message && <div className="auth-message" role="status">{message}</div>}
        <div className="auth-switch">{mode === "signup" ? "Already have an account?" : "New to Sakinah?"}{" "}<button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>{mode === "signup" ? "Sign in" : "Create account"}</button></div>
      </section>
    </div>
  );
}