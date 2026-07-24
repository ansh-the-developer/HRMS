// apps/frontend-ui-monorepo/src/theme/designTokens.js

export const designTokens = {
  // Theme Toggles & Feature Switches
  enableSakuraEffect: true,         // Cinematic slow falling sakura petals canvas
  enableBackgroundOverlay: true,    // Atmospheric ambient background overlay

  // Layout Dimensions
  sidebarWidth: "270px",
  sidebarWidthCollapsed: "80px",
  topBarHeight: "72px",

  // Border Radii
  borderRadiusCard: "20px",
  borderRadiusButton: "12px",
  borderRadiusInput: "12px",
  borderRadiusDialog: "24px",
  borderRadiusDropdown: "14px",
  borderRadiusBadge: "999px",
  borderRadiusTable: "20px",

  // HappyHRMS v3 Architectural Glassmorphism Settings (36px Blur & 76-82% Opacity)
  glassBlur: "36px",
  glassBlurSidebar: "40px",

  // Multi-Stop Signature Tinted Aero Glass Sidebar Gradients
  sidebarGradientDark: "linear-gradient(180deg, rgba(30, 27, 58, 0.82) 0%, rgba(22, 33, 60, 0.80) 30%, rgba(18, 26, 48, 0.82) 65%, rgba(12, 17, 32, 0.86) 100%)",
  sidebarGradientLight: "linear-gradient(180deg, rgba(238, 234, 252, 0.88) 0%, rgba(226, 233, 248, 0.84) 30%, rgba(218, 227, 244, 0.84) 65%, rgba(228, 233, 246, 0.88) 100%)",
  sidebarShadowDark: "inset 0 1px 0 0 rgba(255, 255, 255, 0.20), 0 20px 50px rgba(0, 0, 0, 0.50)",
  sidebarShadowLight: "inset 0 1px 0 0 rgba(255, 255, 255, 0.95), 0 12px 36px rgba(15, 23, 42, 0.08)",

  // Specular Edge Reflections & Glass Shadows
  glassShadowLight: "inset 0 1px 0 0 rgba(255, 255, 255, 0.90), 0 12px 40px rgba(15, 23, 42, 0.08)",
  glassShadowDark: "inset 0 1px 0 0 rgba(255, 255, 255, 0.18), 0 16px 48px rgba(0, 0, 0, 0.40)",
  cardShadow: "0 8px 32px rgba(0, 0, 0, 0.20)",
  dialogShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.90), 0 24px 60px rgba(15, 23, 42, 0.14)",

  // Apple-style Motion System Settings
  easeApple: "cubic-bezier(0.16, 1, 0.3, 1)",
  durationFast: "180ms",
  durationNormal: "250ms",
  durationSlow: "350ms",

  // Light Mode Design Tokens (HappyHRMS v3 Soft Japanese Spring & Winter Glass)
  light: {
    background: "#DDE4F0",             // Soothing Japanese spring/winter mist
    secondaryBackground: "#D0D9E8",    // Cool mist slate
    surface: "rgba(244, 248, 255, 0.78)",
    cardBackground: "rgba(244, 248, 255, 0.78)", // Architectural Frosted Glass
    glassBackground: "rgba(238, 244, 255, 0.74)", // Floating Sheet Glass
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    accent: "#6366F1",                 // Soft Indigo
    accentSecondary: "#818CF8",        // Soft Electric Blue
    border: "rgba(255, 255, 255, 0.60)", // Translucent glass border
    divider: "rgba(15, 23, 42, 0.06)",
    hoverBackground: "rgba(99, 102, 241, 0.09)",
    selectedBackground: "rgba(99, 102, 241, 0.18)",
    focusRing: "#818CF8",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#0EA5E9",
  },

  // Dark Mode Design Tokens (HappyHRMS v3 Deep Indigo Aero Glass)
  dark: {
    background: "#090D1B",              // Deep Indigo Navy
    secondaryBackground: "#0E1528",     // Cold Navy Surface
    surface: "rgba(20, 27, 45, 0.76)",
    cardBackground: "rgba(20, 27, 45, 0.76)", // Architectural Frosted Cold Glass
    glassBackground: "rgba(16, 22, 38, 0.72)",  // Sidebar/TopBar Frosted Glass
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    accent: "#818CF8",                 // Soft Indigo
    accentSecondary: "#A5B4FC",        // Soft Lavender
    border: "rgba(255, 255, 255, 0.14)",
    divider: "rgba(255, 255, 255, 0.08)",
    hoverBackground: "rgba(255, 255, 255, 0.08)",
    selectedBackground: "rgba(99, 102, 241, 0.25)",
    focusRing: "#818CF8",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#38BDF8",
  }
};
