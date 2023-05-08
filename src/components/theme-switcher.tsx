import { Button } from "~/components/ui/button";
import { useThemeContext } from "~/components/context/theme";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <>
      {theme === "dark" && (
        <Button
          variant={"secondary"}
          onClick={() => {
            toggleTheme();
          }}
        >
          <Moon className="hover:cursor-pointer" />
        </Button>
      )}
      {theme === "light" && (
        <Button variant={"secondary"} onClick={() => toggleTheme()}>
          <Sun className="hover:cursor-pointer" />
        </Button>
      )}
    </>
  );
}
