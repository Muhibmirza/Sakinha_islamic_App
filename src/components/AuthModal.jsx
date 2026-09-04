import React, { useEffect, useRef, useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const authRedirectUrl = import.meta.env.PROD
  ? "https://sakinah-islamic.vercel.app/?view=profile"
  : `${window.location.origin}/?view=profile`;
const googleClientId =
  "472540174416-75dubdv37121e55vocusr2ikgj3afk8i.apps.googleusercontent.com";

function GoogleIdentityButton({ onSuccess, onError }) {
  const target = useRef(null);
  useEffect(() => {
    const render = () => {
      if (!window.google?.accounts?.id || !target.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          const { error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: credential,
          });
          if (error) onError(error.message);
          else onSuccess();
        },
      });
      target.current.innerHTML = "";
      window.google.accounts.id.renderButton(target.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 320,
        logo_alignment: "left",
      });
    };
    const existing = document.querySelector("script[data-sakinah-google]");
    if (existing) {
      render();
      existing.addEventListener("load", render, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.dataset.sakinahGoogle = "true";
    script.onload = render;
    script.onerror = () =>
      onError("Google Sign-In could not load. Check your connection.");
    document.head.appendChild(script);
  }, [onError, onSuccess]);
  return <div className="google-identity-button" ref={target} />;
}
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
        options: { data: { name }, emailRedirectTo: authRedirectUrl },
      }));
    else if (mode === "reset")
      ({ error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: authRedirectUrl,
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
            <GoogleIdentityButton onSuccess={close} onError={setMessage} />
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
