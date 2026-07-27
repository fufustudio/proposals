import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { analyticsConfig } from "@/analytics/config";

export function SiteScripts() {
  return (
    <>
      {analyticsConfig.vercel.enabled ? <Analytics /> : null}
      <SpeedInsights />
    </>
  );
}
