import { AuthContextProvider } from "@/components/contexts";
import { Layout } from "@/components/elements";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </AuthContextProvider>
  );
}
