import React from "react";
import useIsClient from "./client";

type Themes = "light" | "dark";

interface ThemeContextProps {
  theme: Themes;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextProps>({
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

  const [theme, setTheme] = React.useState<Themes>("light");
  
  const isLocalStorageEmpty = isClient && !localStorage.getItem("theme");

  React.useEffect(() => {
    const userBrowserPreferredTheme =
      isClient && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    if (isLocalStorageEmpty) {
      localStorage.setItem("theme", userBrowserPreferredTheme);
    } else {
      setTheme(localStorage.getItem("theme") as Themes);
    }
  }, [isClient, isLocalStorageEmpty]);

  React.useEffect(() => {
    document.body.classList.remove("dark", "light");

    localStorage.setItem("theme", theme);
    /** The type is asserted because we add the theme to `localStorage` one line above here so we know it exists. */
    document.body.classList.add(localStorage.getItem("theme") as Themes);
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

export const useThemeContext = () => React.useContext(ThemeContext);
