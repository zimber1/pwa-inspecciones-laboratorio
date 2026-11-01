export function createSecurityHeaders(
  isDevelopment = process.env.NODE_ENV === "development",
) {
  const scriptSources = ["'self'", "'unsafe-inline'"];
  if (isDevelopment) scriptSources.push("'unsafe-eval'");

  return Object.freeze([
    Object.freeze({
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        `script-src ${scriptSources.join(" ")}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'",
        "connect-src 'self'",
        "manifest-src 'self'",
        "worker-src 'self'",
        "media-src 'self' blob:",
      ].join("; "),
    }),
    Object.freeze({ key: "X-Content-Type-Options", value: "nosniff" }),
    Object.freeze({ key: "X-Frame-Options", value: "DENY" }),
    Object.freeze({
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    }),
    Object.freeze({
      key: "Permissions-Policy",
      value:
        "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()",
    }),
  ]);
}

export const securityHeaders = createSecurityHeaders();
