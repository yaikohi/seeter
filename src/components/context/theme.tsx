import React, { createContext, useContext, useEffect, useState } from "react";
import useIsClient from "./client";

type Themes = "light" | "dark";

interface ThemeContextProps {
  theme: Themes;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {
    //empty
  },
});

interface ThemeContextProviderProps {
  children?: React.ReactNode;
}

export function ThemeContextProvider({
  children,
}: ThemeContextProviderProps): React.ReactElement {
  const isClient = useIsClient();
  const userBrowserPreferredTheme =
    isClient && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useState<Themes>(userBrowserPreferredTheme);
  const isLocalStorageEmpty = isClient && !localStorage.getItem("theme");

  useEffect(() => {
    if (isLocalStorageEmpty) {
      localStorage.setItem("theme", userBrowserPreferredTheme);
    } else {
      setTheme(localStorage.getItem("theme") as Themes);
    }
  }, [isLocalStorageEmpty, userBrowserPreferredTheme]);

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme(): void {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
