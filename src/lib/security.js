const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

export function cleanText(value, maxLength) {
  return String(value ?? "").replace(CONTROL_CHARS, "").trim().slice(0, maxLength);
}

export function validEmail(value) {
  const email = cleanText(value, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

export function safeAuthMessage(mode) {
  if (mode === "reset") return "If an account exists for this email, a reset link will be sent.";
  if (mode === "signup") return "Account creation could not be completed. Check the details and try again.";
  return "Sign-in could not be completed. Check your details and try again.";
}

export function allowedImageFile(file) {
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  return Boolean(file && allowed.has(file.type) && file.size > 0 && file.size <= 1_500_000);
}

export function boundedInteger(value, minimum, maximum) {
  const number = Number(value);
  return Number.isInteger(number) && number >= minimum && number <= maximum ? number : null;
}