import "../styles/globals.css";
import type { AppProps } from "next/app";

// FIXME: follow this for JSS
// https://medium.com/wesionary-team/implementing-react-jss-on-next-js-projects-7ceaee985cad
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
