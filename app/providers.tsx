"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { createContext, useContext, useMemo, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside Providers");
  return ctx;
};

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("dark");

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  // 🔥 recreate Chakra system when theme changes
  const system = useMemo(() => {
    return createSystem({
      ...defaultConfig,
      theme: {
        ...defaultConfig.theme,
        semanticTokens: {
          colors: {
            bg: {
              value: theme === "dark" ? "#0b0b0b" : "#f5f5f5",
            },
            fg: {
              value: theme === "dark" ? "#ffffff" : "#111111",
            },
          },
        },
      },
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ChakraProvider value={system}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
}