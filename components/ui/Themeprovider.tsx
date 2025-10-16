"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  attribute?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ournotes-theme",
  enableSystem = true,
  disableTransitionOnChange = true,
  attribute = "class",
  ...props
}: ThemeProviderProps) {
  // Always start with defaultTheme to match server rendering
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  // Only run on client-side after hydration
  React.useEffect(() => {
    setMounted(true);

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, [storageKey]);

  // Apply theme to DOM when theme changes
  React.useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    // Disable transitions during theme change
    if (disableTransitionOnChange) {
      root.style.setProperty("--disable-transitions", "1");
    }

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Re-enable transitions
    if (disableTransitionOnChange) {
      setTimeout(() => {
        root.style.removeProperty("--disable-transitions");
      }, 1);
    }
  }, [theme, mounted, disableTransitionOnChange]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (!mounted || !enableSystem || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted, enableSystem]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  // Prevent hydration mismatch by always rendering children
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
