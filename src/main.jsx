import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./auth.css";
import "./content.css";
import "./install.css";
import "./onboarding.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
if ("serviceWorker" in navigator)
  window.addEventListener("load", async () => {
    const registration = await navigator.serviceWorker.register("/sw.js");
    if (registration.waiting)
      window.dispatchEvent(new Event("sakinah-update-ready"));
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller)
          window.dispatchEvent(new Event("sakinah-update-ready"));
      });
    });
    navigator.serviceWorker.addEventListener("controllerchange", () =>
      location.reload(),
    );
  });
