import { SignedIn, UserButton } from "@clerk/nextjs";
// import { useThemeContext } from "./context/theme";

export function UserNav() {
  // const { theme, toggleTheme } = useThemeContext();
  return (
    <SignedIn>
      <UserButton
        // appearance={{
        //   variables: {
        //     // colorPrimary: "hsl(var(--primary))",
        //     colorBackground: "hsl(var(--background))",
        //     colorAlphaShade: "hsl(var(--foreground))",
        //   },
        // }}
      />
    </SignedIn>
  );
}
