import { AppProps } from "next/app";
import { Header } from "../components/Header";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "../styles/global.scss";

import { Provider as NextAuthProvider } from "next-auth/client";

const payPalInitialOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "BRL",
  intent: "capture",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <PayPalScriptProvider options={payPalInitialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  );
}

export default MyApp;
