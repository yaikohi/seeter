import "~/styles/globals.css";

import React from "react";
import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
export { reportWebVitals } from "next-axiom";
import { api } from "~/utils/api";
import { Toaster } from "~/components/ui/toaster";
import {
  ThemeContextProvider,
  useThemeContext,
} from "~/components/context/theme";
import { dark } from "@clerk/themes";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
      <ThemeContextProvider>
        <ClerkWrapper>
          <Component {...pageProps} />
          <Toaster />
        </ClerkWrapper>
      </ThemeContextProvider>
  );
};

const ClerkWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useThemeContext();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
