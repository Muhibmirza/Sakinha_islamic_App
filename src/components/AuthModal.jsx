import React, { useState } from "react";
import { X, Mail, Lock, User, Chrome } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
export default function AuthModal({ close, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const run = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured)
      return setMessage("Supabase credentials are not configured yet.");
    setBusy(true);
    setMessage("");
    let error;
    if (mode === "signup")
      ({ error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name }, emailRedirectTo: location.origin },
      }));
    else if (mode === "reset")
      ({ error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: location.origin + "/?view=profile",
      }));
    else
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    setBusy(false);
    if (error) setMessage(error.message);
    else if (mode === "login") close();
    else
      setMessage(
        mode === "signup"
          ? "Check your email to confirm your account."
          : "Password-reset email sent.",
      );
  };
  const google = async () => {
    if (!supabase)
      return setMessage("Supabase credentials are not configured yet.");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: location.origin + "/?view=profile" },
    });
  };
  return (
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
            <button className="google-btn" onClick={google}>
              <Chrome /> Continue with Google
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
