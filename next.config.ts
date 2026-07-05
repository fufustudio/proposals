import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import path from "node:path";

const isProduction = process.env.NODE_ENV === "production";

function contentSecurityPolicy(directives: Record<string, string[]>) {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}

const sharedSecurityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const publicContentSecurityPolicy = contentSecurityPolicy({
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "frame-ancestors": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isProduction ? [] : ["'unsafe-eval'"]),
    "https://va.vercel-scripts.com",
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://cdn.sanity.io",
    "https://*.sanity.io",
    "https://maps.gstatic.com",
    "https://*.googleapis.com",
    "https://*.googleusercontent.com",
  ],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  "connect-src": [
    "'self'",
    "https://*.sanity.io",
    "https://*.api.sanity.io",
    "https://*.apicdn.sanity.io",
    "https://va.vercel-scripts.com",
    "https://*.vercel-insights.com",
  ],
  "frame-src": ["'self'", "https://maps.google.com", "https://www.google.com"],
  "form-action": ["'self'"],
  "manifest-src": ["'self'"],
  "worker-src": ["'self'", "blob:"],
});

const studioContentSecurityPolicy = contentSecurityPolicy({
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "frame-ancestors": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://*.sanity.io",
    "https://*.sanity-cdn.com",
    "https://va.vercel-scripts.com",
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://cdn.sanity.io",
    "https://*.sanity.io",
    "https://*.sanity-cdn.com",
    "https://*.googleusercontent.com",
  ],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  "connect-src": [
    "'self'",
    "https://*.sanity.io",
    "https://*.api.sanity.io",
    "https://*.apicdn.sanity.io",
    "https://*.sanity-cdn.com",
    "wss://*.sanity.io",
    "wss://*.api.sanity.io",
    "https://va.vercel-scripts.com",
    "https://*.vercel-insights.com",
  ],
  "frame-src": ["'self'", "https://*.sanity.io", "https://*.sanity-cdn.com"],
  "form-action": ["'self'"],
  "manifest-src": ["'self'"],
  "worker-src": ["'self'", "blob:"],
});

const nextConfig: NextConfig = {
  typedRoutes: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...sharedSecurityHeaders,
          {
            key: "Content-Security-Policy",
            value: publicContentSecurityPolicy,
          },
        ],
      },
      {
        source: "/studio/:path*",
        headers: [
          ...sharedSecurityHeaders,
          {
            key: "Content-Security-Policy",
            value: studioContentSecurityPolicy,
          },
        ],
      },
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/next-image-loader.ts",
    qualities: [75],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
