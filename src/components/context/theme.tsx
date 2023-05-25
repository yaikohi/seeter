import React from "react";
import useIsClient from "./client";

type Themes = "light" | "dark" | null;

interface ThemeContextProps {
  theme: Themes;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextProps>({
  theme: "dark",
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
  const [theme, setTheme] = React.useState<Themes>(null);

  /** Handles initial render of the page.
   * 
   * 1. Check user localStorage for theme -> set this as theme and end.
   * 2. Check for user browser preferences -> set this as theme and end.
   */
  React.useEffect(() => {
    const isLocalStorageEmpty = isClient && !localStorage.getItem("theme");

    const userBrowserPreferredTheme =
      isClient && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    if (!isLocalStorageEmpty) {
      setTheme(localStorage.getItem("theme") as Themes);
    } else {
      localStorage.setItem("theme", userBrowserPreferredTheme);
    }
  }, [isClient]);


  /** Handles the state change / theme toggle button. */
  React.useEffect(() => {
    document.body.classList.remove("dark", "light");
    theme && localStorage.setItem("theme", theme);
    document.body.classList.add(localStorage.getItem("theme") as 'light' | 'dark');
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
