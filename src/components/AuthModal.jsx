import React, { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const authRedirectUrl = `${window.location.origin}/?view=profile`;
export default function AuthModal({ close, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const google = async () => {
    if (!isSupabaseConfigured)
      return setMessage("Supabase credentials are not configured yet.");
    setBusy(true);
    setMessage("");
    console.info("[Sakinah Auth] OAuth redirect", { redirect: authRedirectUrl, origin: window.location.origin });
    let data;
    let error;
    try {
      const result = await Promise.race([
        supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: authRedirectUrl,
            skipBrowserRedirect: true,
            queryParams: { prompt: "select_account" },
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Google sign-in timed out. Check your connection and try again.")), 15000)),
      ]);
      ({ data, error } = result);
    } catch (reason) {
      setBusy(false);
      setMessage(reason.message || "Google sign-in could not start.");
      return;
    }
    if (error || !data?.url) {
      setBusy(false);
      setMessage(
        error?.message || "Google sign-in could not start. Please try again.",
      );
      return;
    }
    window.location.assign(data.url);
  };
  const run = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return setMessage("Supabase credentials are not configured yet.");
    setBusy(true);
    setMessage("");
    console.info("[Sakinah Auth] request", { mode, redirect: authRedirectUrl, origin: window.location.origin });
    try {
      let result;
      if (mode === "signup") {
        result = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim() }, emailRedirectTo: authRedirectUrl } });
      } else if (mode === "reset") {
        result = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: authRedirectUrl });
      } else {
        result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      }
      console.info("[Sakinah Auth] response", { mode, success: !result.error, hasSession: Boolean(result.data?.session), userId: result.data?.user?.id || null });
      if (result.error) throw result.error;
      if (mode === "reset") setMessage("Password-reset email sent. Check your inbox and spam folder.");
      else if (mode === "signup" && !result.data?.session) setMessage("Account created. Check your inbox and spam folder for the confirmation link.");
      else close();
    } catch (reason) {
      console.error("[Sakinah Auth] failure", { mode, message: reason?.message, status: reason?.status, code: reason?.code });
      setMessage(reason?.message || "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };  return (
    <div className="modal-backdrop">
      <section className="auth-modal">
        <button className="modal-close" onClick={close}>
          <X />
        </button>
        <img src="/icons/icon-192.png" />
        <span>WELCOME TO SAKINAH</span>
        <h2>
          {mode === "signup"
            ? "Create your account"
            : mode === "reset"
              ? "Reset your password"
              : "Peace begins here."}
        </h2>
        <p>
          {mode === "login"
            ? "Sign in to sync your worship journey across devices."
            : "Your private spiritual companion."}
        </p>
        <form onSubmit={run}>
          {mode === "signup" && (
            <label>
              <User />
              <input
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          <label>
            <Mail />
            <input
              required
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {mode !== "reset" && (
            <label>
              <Lock />
              <input
                required
                minLength="8"
                type="password"
                placeholder="Password (8+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}
          <button className="auth-primary" disabled={busy}>
            {busy
              ? "Please wait…"
              : mode === "signup"
                ? "Create account"
                : mode === "reset"
                  ? "Send reset link"
                  : "Sign in"}
          </button>
        </form>
        {mode === "login" && (
          <>
            <button
              type="button"
              className="google-oauth-button"
              onClick={google}
              disabled={busy}
            >
              <span className="google-mark">G</span>
              Continue with Google
            </button>
            <button className="text-btn" onClick={() => setMode("reset")}>
              Forgot password?
            </button>
          </>
        )}
        {message && <div className="auth-message">{message}</div>}
        <div className="auth-switch">
          {mode === "signup" ? "Already have an account?" : "New to Sakinah?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup" ? "Sign in" : "Create account"}
          </button>
        </div>
      </section>
    </div>
  );
}
