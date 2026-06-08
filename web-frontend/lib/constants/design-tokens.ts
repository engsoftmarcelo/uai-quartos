export const designTokens = {
  colors: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    surface: "var(--surface)",
    surfaceMuted: "var(--surface-muted)",
    border: "var(--border)",
    brand: "var(--brand)",
    brandStrong: "var(--brand-strong)",
    accent: "var(--accent)",
    signal: "var(--signal)",
    danger: "var(--danger)",
    success: "var(--success)",
  },
  radius: {
    xs: "var(--radius-xs)",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
  },
  shadows: {
    xs: "var(--shadow-xs)",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
  },
  spacing: {
    pageX: "1rem",
    sectionY: "clamp(3rem, 7vw, 6rem)",
    controlHeight: "2.75rem",
  },
  typography: {
    body: "var(--font-sans)",
    display: "var(--font-display)",
    scale: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
  },
  zIndex: {
    base: "var(--z-base)",
    header: "var(--z-header)",
    overlay: "var(--z-overlay)",
    modal: "var(--z-modal)",
    toast: "var(--z-toast)",
  },
  motion: {
    fast: "var(--motion-fast)",
    base: "var(--motion-base)",
    slow: "var(--motion-slow)",
  },
} as const;

export type DesignTokens = typeof designTokens;
