import { Button } from "~/components/ui/button";
import { useThemeContext } from "~/components/context/theme";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <>
      {theme === "dark" && (
        <Button
          variant={"ghost"}
          onClick={() => {
            toggleTheme();
          }}
        >
          <Moon
            className="hover:cursor-pointer"
            aria-label="Change to light mode"
          />
        </Button>
      )}
      {theme === "light" && (
        <Button variant={"ghost"} onClick={() => toggleTheme()}>
          <Sun
            className="hover:cursor-pointer"
            aria-label="Change to dark mode"
          />
        </Button>
      )}
    </>
  );
}
