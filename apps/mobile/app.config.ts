import type { ConfigContext, ExpoConfig } from "expo/config";

// Variant is driven by APP_VARIANT (set per EAS build profile in eas.json, and
// falls back to "development" for local `expo start`). It lets the dev and prod
// builds install side by side on one device with different names/ids/schemes.
type Variant = "development" | "preview" | "production";
const variant = (process.env.APP_VARIANT as Variant) || "development";

const BUNDLE_ID = "com.krave.app";

const variants: Record<
  Variant,
  { name: string; bundleId: string; scheme: string }
> = {
  development: { name: "eKMG (Dev)", bundleId: `${BUNDLE_ID}.dev`, scheme: "kravedev" },
  preview: { name: "eKMG (Preview)", bundleId: `${BUNDLE_ID}.preview`, scheme: "kravepreview" },
  production: { name: "eKMG", bundleId: BUNDLE_ID, scheme: "krave" },
};

// `config` is the static app.json, which Expo reads first and passes in here.
export default ({ config }: ConfigContext): ExpoConfig => {
  const v = variants[variant];

  return {
    ...config,
    name: v.name,
    slug: "mobile",
    scheme: v.scheme,
    ios: {
      ...config.ios,
      bundleIdentifier: v.bundleId,
    },
    android: {
      ...config.android,
      package: v.bundleId,
      // Shrink the window above the IME so ScrollViews can reach covered fields.
      softwareKeyboardLayoutMode: "resize",
    },
  };
};
