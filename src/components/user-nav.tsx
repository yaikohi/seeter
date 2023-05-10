import { SignedIn, UserButton } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useThemeContext } from "./context/theme";
export function UserNav() {
  const { theme, toggleTheme } = useThemeContext();
  return (
    <SignedIn>
      <UserButton
        appearance={{
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          baseTheme: theme === "dark" ? dark : neobrutalism,
          // variables: {
          //   borderRadius: "var(--radius)",
          //   colorAlphaShade: "black",
          //   colorBackground: "var(--background)",
          //   colorDanger: "var(--destructive)",
          //   colorInputBackground: "",
          //   colorInputText: "",
          //   colorPrimary: "var(--primary)",
          //   colorShimmer: "",
          //   colorSuccess: "",
          //   colorText: "var(--foreground)",
          //   colorTextOnPrimaryBackground: "",
          //   colorTextSecondary: "var(--secondary)",
          //   colorWarning: "",
          //   fontFamily: "inherit",
          //   fontFamilyButtons: "inherit",
          //   fontSize: "1.25rem",
          //   fontSmoothing: "antialiased",
          // }
        }}
      />
    </SignedIn>
  );
}
