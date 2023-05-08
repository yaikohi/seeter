import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
export { reportWebVitals } from "next-axiom";

import "~/styles/globals.css";

import { api } from "~/utils/api";
import { Toaster } from "~/components/ui/toaster";
import { ThemeContextProvider } from "~/components/context/theme";
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      {/* <ThemeContextProvider> */}
        <Component {...pageProps} />
        <Toaster />
      {/* </ThemeContextProvider> */}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
