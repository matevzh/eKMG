// Design tokens ported from FarmApp.jsx
export const C = {
  bg: "#F6F1E4", // cream
  card: "#FDFBF6", // milk white
  ink: "#23301F", // deep pasture green-black
  green: "#2F4733", // pasture
  sage: "#8FA888",
  soil: "#8B5E3C",
  amber: "#C77D2E",
  line: "#E2D9C3",
  red: "#A6432F",
  mist: "#E7EFE3", // pale green fill (avatars, ear tags)
  muted: "#8C8470",
  faint: "#A9A28C",
  paper: "#FDFBF6",
} as const;

// With custom fonts, React Native needs the exact family name per weight.
export const F = {
  display: "Fraunces_500Medium",
  displayRegular: "Fraunces_400Regular",
  displaySemiBold: "Fraunces_600SemiBold",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
  mono: "JetBrainsMono_500Medium",
  monoSemiBold: "JetBrainsMono_600SemiBold",
} as const;
