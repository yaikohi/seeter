import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
export { reportWebVitals } from "next-axiom";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import { Toaster } from "~/components/ui/toaster";
import { ThemeContextProvider } from "~/components/context/theme";
import { useRouter } from "next/router";
import { dark } from "@clerk/themes";
import React from "react";

type Themes = "light" | "dark";
const MyApp: AppType = ({ Component, pageProps }) => {
  const { push } = useRouter();

  const theme =
    typeof window !== "undefined"
      ? (localStorage.getItem("theme") as Themes)
      : "light";

  return (
    <ThemeContextProvider>
      <ClerkProvider
        {...pageProps}
        navigate={(to) => push(to)}
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
      >
        <Component {...pageProps} />
        <Toaster />
      </ClerkProvider>
    </ThemeContextProvider>
  );
};

export default api.withTRPC(MyApp);
