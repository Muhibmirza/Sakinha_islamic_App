import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./auth.css";
import "./content.css";
import "./install.css";
import "./onboarding.css";
import "./upgrade.css";

class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("[Sakinah] render failure", error, info); }
  render() {
    if (this.state.error) return (
      <main style={{ padding: 24, fontFamily: "system-ui", color: "#0F5132" }}>
        <h1>Sakinah</h1>
        <p>The app could not start. Please close it, reconnect, and open it again.</p>
        <button onClick={() => location.reload()}>Try again</button>
      </main>
    );
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <AppErrorBoundary><React.StrictMode><App /></React.StrictMode></AppErrorBoundary>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
      await registration.update();
      if (registration.waiting) window.dispatchEvent(new Event("sakinah-update-ready"));
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller)
            window.dispatchEvent(new Event("sakinah-update-ready"));
        });
      });
      let reloading = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!reloading) { reloading = true; location.reload(); }
      });
    } catch (error) {
      console.error("[Sakinah] service worker registration failed", error);
    }
  });
}