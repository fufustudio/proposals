import type { NextConfig } from "next";
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
          value: "max-age=63072000",
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
  "img-src": ["'self'", "data:", "blob:"],
  "font-src": ["'self'", "data:"],
  "connect-src": [
    "'self'",
    "https://va.vercel-scripts.com",
    "https://*.vercel-insights.com",
  ],
  "frame-src": ["'self'"],
  "form-action": ["'self'"],
  "manifest-src": ["'self'"],
  "worker-src": ["'self'", "blob:"],
});

const privateContentSecurityPolicy = contentSecurityPolicy({
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "frame-ancestors": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isProduction ? [] : ["'unsafe-eval'"]),
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'"],
  "frame-src": ["'self'"],
  "form-action": ["'self'"],
  "manifest-src": ["'self'"],
  "worker-src": ["'self'", "blob:"],
});

const privateRouteHeaders = [
  {
    key: "Content-Security-Policy",
    value: privateContentSecurityPolicy,
  },
  {
    key: "Cache-Control",
    value: "private, no-store, max-age=0, must-revalidate",
  },
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive, nosnippet",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
        source: "/admin/:path*",
        headers: privateRouteHeaders,
      },
      {
        source: "/proposals/:path*",
        headers: privateRouteHeaders,
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
